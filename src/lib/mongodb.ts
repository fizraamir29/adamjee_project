import mongoose from 'mongoose';
import dns from 'dns';

// Force IPv4 first and use public DNS servers to resolve MongoDB SRV records reliably
try {
  if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder('ipv4first');
  }
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (e) {
  console.warn('⚠️ Could not set custom DNS servers:', e);
}

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI || '';

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null, failedAt: 0, error: null };
}

// Only retry MongoDB connection every 5 seconds after a failure
const RETRY_AFTER_MS = 5_000;

export function getMongoError() {
  if (!MONGODB_URI) {
    return 'MONGO_URI or MONGODB_URI is not set in environment variables.';
  }
  return cached.error || null;
}

// Pre-resolve SRV record if needed to avoid node DNS querySrv ECONNREFUSED on Windows
async function resolveUriIfNeeded(uri: string): Promise<string> {
  if (!uri.startsWith('mongodb+srv://')) return uri;

  try {
    const match = uri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/([^?]*)\??(.*)$/);
    if (!match) return uri;

    const [, user, pass, srvHost, dbName, queryParams] = match;
    const srvQuery = `_mongodb._tcp.${srvHost}`;

    const resolver = new dns.Resolver();
    resolver.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

    const addresses = await new Promise<dns.SrvRecord[]>((resolve, reject) => {
      resolver.resolveSrv(srvQuery, (err, addrs) => {
        if (err || !addrs || addrs.length === 0) reject(err || new Error('No SRV records'));
        else resolve(addrs);
      });
    });

    const hostList = addresses.map(a => `${a.name}:${a.port}`).join(',');
    const resolvedUri = `mongodb://${user}:${pass}@${hostList}/${dbName}?ssl=true&authSource=admin&${queryParams || 'retryWrites=true&w=majority'}`;
    console.log('✅ Resolved MongoDB SRV via Google DNS successfully');
    return resolvedUri;
  } catch (err: any) {
    console.warn('⚠️ SRV pre-resolution fallback to raw URI:', err.message);
    return uri;
  }
}

export async function connectDB() {
  if (!MONGODB_URI) {
    console.warn('⚠️ MONGO_URI / MONGODB_URI is not set in environment variables.');
    cached.error = 'MONGO_URI or MONGODB_URI is not set in environment variables.';
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (cached.failedAt && Date.now() - cached.failedAt < RETRY_AFTER_MS) {
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
    };

    cached.promise = (async () => {
      const finalUri = await resolveUriIfNeeded(MONGODB_URI);
      try {
        const mongooseInstance = await mongoose.connect(finalUri, opts);
        console.log('✅ MongoDB Connected (Cached)');
        cached.failedAt = 0;
        cached.error = null;
        return mongooseInstance;
      } catch (err: any) {
        console.error('❌ MongoDB Connection Error:', err.message);
        cached.promise = null;
        cached.failedAt = Date.now();
        cached.error = err.message || String(err);
        return null;
      }
    })();
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
