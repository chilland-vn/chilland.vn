import React, { useEffect, useState } from 'react';
import { BấtĐộngSản } from '../types';
import { Ruler, MapPin, Compass } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { Link } from 'react-router-dom';
import { getFeaturedBatDongSan } from '../services/firebaseService';
import { DEFAULT_PROPERTY_IMAGE } from '../constants';
import Loading from './Loading';

/**
 * COMPONENT HIỂN THỊ TIN NỔI BẬT LẤY TỪ FIRESTORE
 */

export default function FeaturedListings() {
  const [listings, setListings] = useState<BấtĐộngSản[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🔥 Tải tin nổi bật từ Firestore...");
    getFeaturedBatDongSan(6)
      .then(data => {
        setListings(data);
        console.log(`✅ Đã tải ${data.length} tin nổi bật.`);
      })
      .catch(err => console.error("❌ Lỗi tải tin nổi bật:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  if (listings.length === 0) {
    return (
      <div className="text-center py-20 bg-brand-paper rounded-3xl border-2 border-dashed border-gray-200">
        <p className="text-gray-400 italic">Hiện tại chưa có sản phẩm nổi bật nào được cập nhật.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {listings.map((listing) => {
        // 5. Thêm console log kiểm tra ảnh
        if (listing.id) {
          console.log(`🖼️ Ảnh hiển thị [${listing.maSanPham}]:`, {
            anhDaiDien: listing.anhDaiDien,
            danhSachAnh: listing.danhSachAnh
          });
        }

        return (
          <Link 
            key={listing.id} 
            to={`/san-pham/${listing.id}`}
            className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-black/5 flex flex-col h-full"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <img 
                src={listing.imageUrl || DEFAULT_PROPERTY_IMAGE} 
                alt={listing.tieuDe} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_PROPERTY_IMAGE;
                }}
              />
            <div className="absolute top-4 left-4 bg-brand-gold text-white text-[9px] px-3 py-1.5 rounded-sm uppercase font-black tracking-widest shadow-lg">
              {listing.loaiCap2}
            </div>
            {listing.trangThai === 'Đã bán' && (
              <div className="absolute inset-0 bg-brand-forest/60 flex items-center justify-center backdrop-blur-[2px]">
                 <span className="border-2 border-white text-white font-black text-xl px-4 py-1 rotate-12 rounded-lg opacity-90">ĐÃ BÁN</span>
              </div>
            )}
          </div>
          
          <div className="p-6 flex flex-col flex-1 justify-between gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                 <span className="text-brand-gold">{listing.khuVuc}</span>
                 <span className="text-gray-400">{listing.dienTich}m² • {listing.huong}</span>
              </div>
              <h3 className="text-sm font-bold text-brand-ink line-clamp-2 leading-snug group-hover:text-brand-gold transition-colors">
                {listing.tieuDe}
              </h3>
            </div>
            
            <div className="flex justify-between items-end border-t border-gray-50 pt-4 mt-auto">
               <p className="text-2xl font-serif text-brand-forest italic leading-none">{formatPrice(listing.gia)}</p>
               <span className="text-[9px] font-black underline uppercase tracking-widest text-gray-400 group-hover:text-brand-gold">Chi tiết</span>
            </div>
          </div>
        </Link>
      ); })}
    </div>
  );
}
