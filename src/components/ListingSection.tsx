import React, { useEffect, useState } from 'react';
import { BấtĐộngSản } from '../types';
import { getBatDongSanByCategory } from '../services/firebaseService';
import { formatPrice } from '../lib/utils';
import { Link } from 'react-router-dom';
import { DEFAULT_PROPERTY_IMAGE } from '../constants';
import Loading from './Loading';
import { Search, ArrowRight } from 'lucide-react';

interface ListingSectionProps {
  category: string;
  title: string;
  subtitle: string;
  key?: string | number;
}

export default function ListingSection({ category, title, subtitle }: ListingSectionProps) {
  const [listings, setListings] = useState<BấtĐộngSản[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBatDongSanByCategory(category, 10)
      .then(setListings)
      .catch(err => console.error(`Error loading ${category}:`, err))
      .finally(() => setLoading(false));
  }, [category]);

  if (loading) return (
    <div className="py-12 flex justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
    </div>
  );

  if (listings.length === 0) return null;

  return (
    <section className="py-16 border-b border-brand-paper last:border-0 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-end mb-10 gap-6">
          <div className="space-y-1">
            <span className="text-brand-gold uppercase tracking-[0.3em] text-[10px] font-black">{subtitle}</span>
            <h2 className="text-3xl md:text-4xl font-serif text-brand-forest italic">{title}</h2>
          </div>
          <Link 
            to={`/danh-muc/${category}`} 
            className="hidden sm:flex items-center gap-2 text-[10px] uppercase font-black text-brand-gold hover:text-brand-forest transition-colors group"
          >
            Xem tất cả <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Horizontal scroll container on mobile, grid on desktop */}
        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8 scrollbar-hide">
          {listings.map((listing) => (
            <Link 
              key={listing.id} 
              to={`/san-pham/${listing.id}`}
              className="flex-shrink-0 w-[280px] sm:w-auto group bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(197,160,89,0.15)] transition-all duration-700 border border-black/[0.03] flex flex-col"
            >
              <div className="relative aspect-[16/11] overflow-hidden">
                <img 
                  src={listing.imageUrl || DEFAULT_PROPERTY_IMAGE} 
                  alt={listing.tieuDe} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-brand-forest text-white text-[9px] px-3 py-1.5 rounded-lg uppercase font-black tracking-widest shadow-xl backdrop-blur-md bg-opacity-90">
                  {listing.loaiCap2}
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1 justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.15em] font-black text-brand-gold">
                    <span>{listing.khuVuc}</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-400">{listing.dienTich}m²</span>
                  </div>
                  <h3 className="text-[15px] font-bold text-brand-ink line-clamp-2 leading-snug group-hover:text-brand-gold transition-colors tracking-tight">
                    {listing.tieuDe}
                  </h3>
                </div>
                
                <div className="flex justify-between items-end border-t border-gray-50 pt-5 mt-auto">
                  <p className="text-xl font-serif text-brand-forest italic font-bold leading-none">{formatPrice(listing.gia)}</p>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 group-hover:text-brand-gold transition-colors">Khám phá</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
