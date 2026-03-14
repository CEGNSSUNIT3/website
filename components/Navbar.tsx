'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Shield } from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/activities', label: 'Activities' },
  { href: '/events', label: 'Events' },
  { href: '/gallery', label: 'Gallery' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/98 backdrop-blur-md shadow-md'
          : 'bg-black/40 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nss-green to-nss-blue flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">NSS</span>
            </div> */}
            <div className="leading-tight">
              <p className={`font-display font-bold text-base leading-none ${scrolled ? 'text-nss-green' : 'text-white'}`}>
                NSS Unit 3
              </p>
              <p className={`text-xs font-medium ${scrolled ? 'text-gray-500' : 'text-gray-300'}`}>CEG Anna University</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold transition-colors duration-200 relative pb-1
                  ${pathname === link.href
                    ? 'text-nss-green after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-nss-green after:rounded'
                    : scrolled
                    ? 'text-gray-700 hover:text-nss-green'
                    : 'text-white hover:text-green-300'
                  }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-lg border transition-all duration-200
                ${scrolled
                  ? 'border-nss-maroon text-nss-maroon hover:bg-nss-maroon hover:text-white'
                  : 'border-white/70 text-white hover:bg-white/20'
                }`}
            >
              <Shield size={14} />
              Admin
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg text-white" 
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg animate-fade-in">
          <div className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-semibold ${
                  pathname === link.href ? 'text-nss-green' : 'text-gray-700'
                }`}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="flex items-center gap-2 text-sm font-semibold text-nss-maroon"
              onClick={() => setOpen(false)}
            >
              <Shield size={14} /> Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}