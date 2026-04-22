import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown } from 'lucide-react';
import { CATEGORIES } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface MenuItem {
  name: string;
  path: string;
  subItems?: string[];
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems: MenuItem[] = [
    { name: 'Trang chủ', path: '/' },
    ...Object.keys(CATEGORIES).map(cat => ({
      name: cat,
      path: `/danh-muc/${encodeURIComponent(cat)}`,
      subItems: CATEGORIES[cat as keyof typeof CATEGORIES]
    })),
    { name: 'Tin tức', path: '/tin-tuc' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-white text-brand-ink border-b border-black/5 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-forest flex items-center justify-center">
              <span className="text-brand-gold font-bold text-xl">C</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tighter leading-none uppercase">Chilland.vn</span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400">Giá trị tích luỹ niềm tin</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex space-x-6 items-center">
            {menuItems.map((item) => (
              <div key={item.name} className="relative group">
                <Link 
                  to={item.path} 
                  className="px-2 py-1 text-[11px] uppercase tracking-widest font-semibold hover:text-brand-gold transition-colors flex items-center gap-1"
                >
                  {item.name}
                  {item.subItems && <ChevronDown className="w-3 h-3 opacity-50" />}
                </Link>
                
                {item.subItems && (
                  <div className="absolute left-0 mt-2 w-56 bg-white text-brand-ink rounded-lg shadow-2xl border border-black/5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 overflow-hidden">
                    <div className="py-2">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub}
                          to={`/danh-muc/${encodeURIComponent(sub)}`}
                          className="block px-6 py-3 text-[10px] uppercase tracking-wider font-bold hover:bg-brand-cream hover:text-brand-gold transition-colors"
                        >
                          {sub}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <a 
              href="tel:0888928628" 
              className="text-brand-forest text-sm font-bold ml-4 border-l border-gray-200 pl-6 flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-brand-gold" />
              0888.928.628
            </a>
          </nav>

          {/* Mobile toggle */}
          <button className="lg:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="text-brand-forest" /> : <Menu className="text-brand-forest" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden bg-white border-t border-black/5 px-6 pt-2 pb-8 space-y-2"
          >
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="block px-3 py-4 text-xs font-black uppercase tracking-widest border-b border-gray-50 last:border-0"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
