import { Product } from '../types';
import { ALL_PRODUCTS, NEW_ARRIVALS, BUNDLE_PRODUCTS } from '../data';

export const getCategoryFallbackImage = (category?: string, name?: string): string => {
  const cat = (category || '').toLowerCase();
  const n = (name || '').toLowerCase();
  if (cat.includes('headphone') || n.includes('headphone') || n.includes('headset') || n.includes('airpod')) {
    return '/images/headphones_red_black_1780246535746.png';
  }
  if (cat.includes('earphone') || n.includes('earbud') || n.includes('earphone') || n.includes('bud')) {
    return '/images/tws_blue_earbuds_1780227103510.png';
  }
  if (cat.includes('speaker') || n.includes('speaker') || n.includes('soundbar')) {
    return '/images/image 117.png';
  }
  if (cat.includes('desktop') || n.includes('pc') || n.includes('build') || n.includes('rig')) {
    return '/images/custom_blue_gaming_pc_cases_1780242165601.png';
  }
  if (n.includes('mouse') || n.includes('mice')) {
    return '/images/gaming_mouse_rgb_new.png';
  }
  if (n.includes('keyboard')) {
    return '/images/mechanical_keyboard_1780238028029.png';
  }
  if (n.includes('chair')) {
    return '/images/gaming_chair_blue_1780246513295.png';
  }
  return '/images/dell_led_monitor_1780238004077.png';
};

export const getProductImage = (product: any): string => {
  if (!product) return getCategoryFallbackImage();
  let img = product.image;
  if (!img || typeof img !== 'string' || img.trim().length === 0 || img.startsWith('/uploads/')) {
    img = Array.isArray(product.images) && product.images.find((i: any) => typeof i === 'string' && i.trim().length > 0 && !i.startsWith('/uploads/'));
  }
  if (!img || typeof img !== 'string' || img.trim().length === 0 || img.startsWith('/uploads/')) {
    img = Array.isArray(product.additionalImages) && product.additionalImages.find((i: any) => typeof i === 'string' && i.trim().length > 0 && !i.startsWith('/uploads/'));
  }
  if (img && typeof img === 'string' && img.trim().length > 0 && !img.startsWith('/uploads/')) {
    return img;
  }
  return getCategoryFallbackImage(product?.category, product?.name);
};

// NEW_ARRIVALS come first so they appear in the New Arrivals section (they have 'New'/'Hot' tags)
export const INITIAL_PRODUCTS = [
  ...NEW_ARRIVALS,
  ...ALL_PRODUCTS.filter(p => !NEW_ARRIVALS.find(n => n.id === p.id)),
  ...BUNDLE_PRODUCTS.filter(b => !ALL_PRODUCTS.find(p => p.id === b.id) && !NEW_ARRIVALS.find(p => p.id === b.id))
];

export const getProducts = (): Product[] => {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS;
  const data = localStorage.getItem('adamjee_products');
  if (data) {
    const stored: Product[] = JSON.parse(data);
    // If stored data has no tagged products, it's stale — merge fresh NEW_ARRIVALS in
    const hasTagged = stored.some(p => p.tag === 'New' || p.tag === 'Hot');
    if (!hasTagged) {
      const adminAdded = stored.filter(p => !INITIAL_PRODUCTS.find(ip => ip.id === p.id));
      const fresh = [...INITIAL_PRODUCTS, ...adminAdded];
      localStorage.setItem('adamjee_products', JSON.stringify(fresh));
      return fresh;
    }
    return stored;
  }
  localStorage.setItem('adamjee_products', JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
};

export const saveProducts = (products: Product[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('adamjee_products', JSON.stringify(products));
};

export const saveProduct = (product: any) => {
  if (typeof window === 'undefined' || !product) return;
  const products = getProducts();
  const idToMatch = product._id || product.id;
  const idx = products.findIndex(p => (p as any)._id === idToMatch || (p as any).id === idToMatch);
  if (idx !== -1) {
    products[idx] = { ...products[idx], ...product };
  } else {
    products.unshift(product);
  }
  localStorage.setItem('adamjee_products', JSON.stringify(products));
};

export const deleteProductFromStorage = (id: string) => {
  if (typeof window === 'undefined' || !id) return;
  const products = getProducts();
  const filtered = products.filter(p => (p as any)._id !== id && (p as any).id !== id);
  localStorage.setItem('adamjee_products', JSON.stringify(filtered));
};

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  phone: string;
  address: string;
  city: string;
  items: { product: Product; qty: number }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  date: string;
}

export const getOrders = (): Order[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('adamjee_orders');
  return data ? JSON.parse(data) : [];
};

export const saveOrder = (order: any) => {
  if (typeof window === 'undefined' || !order) return;
  const orders = getOrders();
  const idToMatch = order._id || order.id || order.orderId;
  const exists = orders.some(o => (o as any)._id === idToMatch || (o as any).id === idToMatch || (o as any).orderId === idToMatch);
  if (!exists) {
    orders.unshift(order);
    localStorage.setItem('adamjee_orders', JSON.stringify(orders));
  }
};

export const updateOrderStatus = (orderId: string, status: Order['status']) => {
  if (typeof window === 'undefined') return;
  const orders = getOrders();
  const updated = orders.map(o => o.id === orderId ? { ...o, status } : o);
  localStorage.setItem('adamjee_orders', JSON.stringify(updated));
};

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export const getMessages = (): ContactMessage[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('adamjee_messages');
  return data ? JSON.parse(data) : [];
};

export const saveMessage = (msg: Omit<ContactMessage, 'id' | 'date' | 'read'>) => {
  if (typeof window === 'undefined') return;
  const messages = getMessages();
  const newMessage: ContactMessage = {
    ...msg,
    id: `msg-${Date.now()}`,
    date: new Date().toISOString(),
    read: false,
  };
  messages.unshift(newMessage);
  localStorage.setItem('adamjee_messages', JSON.stringify(messages));
};

export const markMessageRead = (id: string) => {
  if (typeof window === 'undefined') return;
  const messages = getMessages();
  const updated = messages.map(m => m.id === id ? { ...m, read: true } : m);
  localStorage.setItem('adamjee_messages', JSON.stringify(updated));
};

export const deleteMessage = (id: string) => {
  if (typeof window === 'undefined') return;
  const messages = getMessages();
  const updated = messages.filter(m => m.id !== id);
  localStorage.setItem('adamjee_messages', JSON.stringify(updated));
};

export const getWishlist = (): string[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('adamjee_wishlist');
  return data ? JSON.parse(data) : [];
};

export const toggleWishlist = (productId: string): boolean => {
  if (typeof window === 'undefined') return false;
  const wishlist = getWishlist();
  const index = wishlist.indexOf(productId);
  let added = false;
  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(productId);
    added = true;
  }
  localStorage.setItem('adamjee_wishlist', JSON.stringify(wishlist));
  return added;
};

export const isInWishlist = (productId: string): boolean => {
  if (typeof window === 'undefined') return false;
  return getWishlist().includes(productId);
};

export interface BlogItem {
  _id?: string;
  id?: string;
  title: string;
  slug?: string;
  content: string;
  author?: string;
  image?: string;
  category?: string;
  excerpt?: string;
  isPublished?: boolean;
  publishedAt?: string;
  createdAt?: string;
}

export const getBlogs = (): BlogItem[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem('adamjee_blogs');
  return data ? JSON.parse(data) : [];
};

export const saveBlogs = (blogs: BlogItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('adamjee_blogs', JSON.stringify(blogs));
};

export const saveBlog = (blog: BlogItem) => {
  if (typeof window === 'undefined' || !blog) return;
  const blogs = getBlogs();
  const idToMatch = blog._id || blog.id || blog.slug;
  const idx = blogs.findIndex(b => b._id === idToMatch || b.id === idToMatch || b.slug === idToMatch);
  if (idx !== -1) {
    blogs[idx] = { ...blogs[idx], ...blog };
  } else {
    blogs.unshift(blog);
  }
  localStorage.setItem('adamjee_blogs', JSON.stringify(blogs));
};

export const deleteBlogFromStorage = (id: string) => {
  if (typeof window === 'undefined' || !id) return;
  const blogs = getBlogs();
  const filtered = blogs.filter(b => b._id !== id && b.id !== id && b.slug !== id);
  localStorage.setItem('adamjee_blogs', JSON.stringify(filtered));
};
