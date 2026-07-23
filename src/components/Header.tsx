'use client';

import React, { useState, useEffect } from "react";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderProps {
  cartCount: number;
  onCartToggle: () => void;
  onBuildPcOpen: () => void;
}

export default function Header({ cartCount, onCartToggle, onBuildPcOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        id="main-navigation"
        className={`sticky top-0 z-50 w-full px-4 md:px-12 py-4 flex justify-between items-center text-gray-800 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
            : 'bg-white border-b border-gray-100'
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer select-none flex-shrink-0">
          <img
            src="/images/Mask group.png"
            alt="AC"
            className="h-8 md:h-9 w-auto object-contain"
          />
          <img
            src="/images/Mask group (1).png"
            alt="Adamjee Computers"
            className="h-6 md:h-7 w-auto object-contain hidden sm:block"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-medium tracking-wide text-gray-600">
          {[
            { href: '/category/all', label: 'Shop' },
            { href: '/category/best-sellers', label: 'Best Sellers' },
            { href: '/build-your-pc', label: 'Build Your Custom PC' },
            { href: '/benchmarks', label: 'Benchmarks' },
            { href: '/about', label: 'Why Us' }
          ].map((link) => {
            const active = link.href === '/category/all' 
              ? (pathname === '/category/all' || (pathname.startsWith('/category/') && pathname !== '/category/best-sellers') || pathname.startsWith('/product/'))
              : (pathname === link.href || pathname.startsWith(link.href));

            return (
              <Link 
                key={link.href}
                href={link.href}
                className={`group relative inline-flex items-center gap-1.5 transition-all duration-300 font-semibold text-sm ${
                  active ? 'text-[#164475] font-bold' : 'text-gray-600 hover:text-[#164475]'
                }`}
              >
                {/* Dot indicator next to link (Figma hover dot animation) */}
                <span 
                  className={`w-1.5 h-1.5 rounded-full bg-[#164475] transition-all duration-300 shrink-0 ${
                    active 
                      ? 'opacity-100 scale-100 w-1.5' 
                      : 'opacity-0 scale-0 w-0 group-hover:opacity-100 group-hover:scale-100 group-hover:w-1.5'
                  }`}
                  style={{ marginTop: '1px' }}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Icons */}
        <div className="flex items-center gap-4 text-gray-800">
          <Link href="/search" className="icon-hover-scale hover:text-[#164475] transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center justify-center">
            <Search className="w-5 h-5 font-light" strokeWidth={1.5} />
          </Link>

          <button
            onClick={onCartToggle}
            className="icon-hover-scale relative hover:text-[#164475] transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            <ShoppingCart className="w-5 h-5 font-light" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#164475] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>

          <Link href="/login" className="icon-hover-scale hover:text-[#164475] transition-colors cursor-pointer bg-transparent border-none p-0 items-center justify-center hidden sm:flex">
            <User className="w-5 h-5 font-light" strokeWidth={1.5} />
          </Link>

          {/* Mobile hamburger button */}
          <button
            className="lg:hidden p-1 text-gray-700 hover:text-[#164475] transition-colors"
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer panel */}
          <div className="fixed top-0 right-0 h-full w-72 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col lg:hidden">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <img src="/images/Mask group.png" alt="AC" className="h-7 w-auto" />
                <img src="/images/Mask group (1).png" alt="Adamjee" className="h-5 w-auto" />
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {[
                { href: '/category/all', label: 'Shop', highlight: true },
                { href: '/category/best-sellers', label: 'Best Sellers' },
                { href: '/build-your-pc', label: 'Build Your Custom PC' },
                { href: '/benchmarks', label: 'Benchmarks' },
                { href: '/about', label: 'Why Us' },
                { href: '/blog', label: 'Blog' },
              ].map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    link.highlight
                      ? 'text-[#164475] bg-[#f0f7ff]'
                      : 'text-gray-700 hover:text-[#164475] hover:bg-[#f0f7ff]'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Bottom CTA buttons */}
            <div className="p-4 border-t border-gray-100 flex gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-[#164475] text-[#164475] rounded-xl font-bold text-sm hover:bg-[#164475] hover:text-white transition-all"
              >
                <User className="w-4 h-4" /> Login
              </Link>
              <Link
                href="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#164475] text-white rounded-xl font-bold text-sm hover:bg-[#0a1b2d] transition-all"
              >
                <Search className="w-4 h-4" /> Search
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
