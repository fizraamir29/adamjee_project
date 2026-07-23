'use client';
import React from "react";
import { Star, ArrowRight, Eye } from "lucide-react";
import Link from "next/link";
import { Product } from "../types";
import { NEW_ARRIVALS } from "../data";
import { getCategoryFallbackImage } from "../utils/storage";

interface NewArrivalsProps {
  onAddToCart: (product: Product) => void;
  formatPrice: (usdAmount: number) => string;
}

export default function NewArrivals({ onAddToCart, formatPrice }: NewArrivalsProps) {
  // Always use local NEW_ARRIVALS — the API returns all products (incl. bundles)
  // which breaks the curated 6-card new arrivals section.
  const products = NEW_ARRIVALS.slice(0, 6);

  return (
    <section id="featured-arrivals" className="px-4 md:px-12 py-16 bg-[#fafbfc]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6 reveal-up">
          <div className="space-y-2 max-w-xl text-left">
            <span className="text-xs font-extrabold tracking-widest uppercase text-[#164475]">
              NEW ARRIVALS
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[#0a1b2d] tracking-tight leading-[1.1]">
              Fresh Tech. Latest<br />Performance.
            </h2>
          </div>
          <div className="max-w-md text-gray-500 text-sm leading-relaxed text-left space-y-3">
            <p>
              Stay ahead with newly launched gaming hardware, cutting-edge accessories, and upgraded PC components. Discover the latest arrivals from top tech brands
            </p>
            <Link 
              href="/category/all" 
              className="font-bold text-[#0a1b2d] inline-flex items-center gap-1.5 hover:text-[#164475] transition-colors border-b border-[#0a1b2d] pb-0.5"
            >
              Explore New Arrivals <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 3x2 Grid (6 Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod, idx) => {
            const tag = prod.tag || 'New';
            const isHot = tag.toLowerCase() === 'hot';

            return (
              <div 
                key={prod.id || idx} 
                className="bg-white rounded-[24px] border border-gray-100 hover:border-[#164475] p-6 flex flex-col justify-between group transition-all duration-300 hover:shadow-[0_12px_32px_rgba(22,68,117,0.08)] cursor-pointer relative reveal-up"
                style={{ transitionDelay: `${(idx % 3) * 100}ms` }}
              >
                {/* Card Top Row: Tag & Rating */}
                <div className="flex justify-between items-center w-full select-none z-10">
                  <span className={`text-[11px] font-extrabold px-3.5 py-1 rounded-full uppercase tracking-wider ${
                    isHot ? 'bg-[#f3b73e] text-white' : 'bg-[#164475] text-white'
                  }`}>
                    {tag}
                  </span>

                  <div className="relative flex items-center justify-end">
                    {/* Rating Pill (Fades out on hover) */}
                    <span className="bg-white px-2.5 py-1 rounded-full text-[11px] font-bold text-[#0a1b2d] flex items-center gap-1 shadow-sm border border-gray-100 transition-all duration-300 group-hover:opacity-0 group-hover:pointer-events-none">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{prod.rating ? prod.rating.toFixed(1) : "5.0"}</span>
                    </span>
                    {/* Eye Icon (Fades in on hover) */}
                    <span className="absolute right-0 bg-white w-7 h-7 rounded-full flex items-center justify-center shadow-sm border border-gray-100 transition-all duration-300 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100">
                      <Eye className="w-3.5 h-3.5 text-[#0a1b2d]" />
                    </span>
                  </div>
                </div>

                {/* Product Main Image Area */}
                <Link 
                  href={`/product/${prod.id}`}
                  className="my-4 flex flex-col items-center justify-center h-[180px] w-full relative"
                >
                  <img 
                    src={prod.image} 
                    alt={prod.name}
                    className="max-h-[150px] w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getCategoryFallbackImage(prod.category, prod.name);
                    }}
                    style={{ mixBlendMode: "multiply" }}
                  />
                  {/* Dots under image */}
                  <div className="flex items-center gap-1.5 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="w-1.5 h-1.5 rounded-full border border-gray-400" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0a1b2d]" />
                    <span className="w-1.5 h-1.5 rounded-full border border-gray-400" />
                  </div>
                </Link>

                {/* Card Bottom Area: Code, Title, Price, Variant Swatches */}
                <div className="space-y-1 pt-2 text-left">
                  <span className="text-[11px] font-semibold text-gray-400 block tracking-wide uppercase">
                    {prod.code || "Code u2917w"}
                  </span>

                  <div className="flex items-baseline justify-between gap-2">
                    <Link href={`/product/${prod.id}`}>
                      <h3 className="text-base font-bold text-[#0a1b2d] group-hover:text-[#164475] transition-colors line-clamp-1">
                        {prod.name}
                      </h3>
                    </Link>
                    <span className="text-sm font-bold text-gray-500 shrink-0">
                      {formatPrice(prod.price)}
                    </span>
                  </div>

                  {/* Thumbnail Swatches */}
                  <div className="flex items-center gap-1.5 pt-2">
                    <div className="w-7 h-7 rounded-md border border-[#0a1b2d] p-0.5 bg-white flex items-center justify-center">
                      <img 
                        src={prod.image} 
                        alt="Thumb" 
                        className="w-full h-full object-contain mix-blend-multiply"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = getCategoryFallbackImage(prod.category, prod.name);
                        }}
                      />
                    </div>
                    {prod.additionalImages && prod.additionalImages.slice(0, 2).map((img, i) => (
                      <div key={i} className="w-7 h-7 rounded-md border border-gray-200 p-0.5 bg-white flex items-center justify-center hover:border-[#164475]">
                        <img 
                          src={img} 
                          alt="Thumb" 
                          className="w-full h-full object-contain mix-blend-multiply"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = getCategoryFallbackImage(prod.category, prod.name);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
