import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BấtĐộngSản } from '../types';
import { getAllBatDongSan } from '../services/firebaseService';
import { Ruler, MapPin, Compass, Search } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { DEFAULT_PROPERTY_IMAGE } from '../constants';
import Loading from '../components/Loading';

/**
 * TRANG DANH SÁCH SẢN PHẨM: HIỂN THỊ DỮ LIỆU THỰC TỪ FIRESTORE
 */

export default function ListingList() {
  const { category } = useParams();
  const [listings, setListings] = useState<BấtĐộngSản[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const all = await getAllBatDongSan();
        const decodedCat = category ? decodeURIComponent(category) : '';
        
        // Lọc theo category nếu có
        const filtered = decodedCat 
          ? all.filter(l => l.loaiCap1 === decodedCat || l.loaiCap2 === decodedCat)
          : all;
          
        setListings(filtered);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [category]);

  const filteredListings = listings.filter(l => 
    l.tieuDe.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.maSanPham.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif text-brand-forest mb-2">
            {category ? decodeURIComponent(category) : 'Tất cả bất động sản'}
          </h1>
          <p className="text-brand-gold font-medium italic">Tìm thấy {filteredListings.length} sản phẩm phù hợp</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <input 
            type="text"
            placeholder="Tìm theo tên hoặc mã SP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-brand-paper rounded-2xl focus:border-brand-gold outline-none transition-all shadow-sm"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
      </div>

      {filteredListings.length === 0 ? (
        <div className="text-center py-20 bg-brand-paper rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 italic font-serif text-xl">Không tìm thấy sản phẩm nào trong mục này.</p>
          <Link to="/" className="text-brand-forest font-bold mt-4 inline-block hover:underline">Quay về trang chủ</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredListings.map((listing) => {
            return (
              <Link 
                key={listing.id} 
                to={`/san-pham/${listing.id}`}
                className="group bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-brand-paper hover:-translate-y-2 flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={listing.imageUrl || DEFAULT_PROPERTY_IMAGE} 
                    alt={listing.tieuDe} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_PROPERTY_IMAGE;
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-brand-forest/90 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-full uppercase font-black tracking-widest shadow-lg">
                    {listing.loaiCap2}
                  </div>
                {listing.trangThai === 'Đã bán' && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="border-4 border-white text-white font-black text-2xl px-6 py-2 rotate-12 rounded-xl">ĐÃ BÁN</span>
                  </div>
                )}
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="bg-brand-forest text-white px-4 py-2 rounded-xl font-black shadow-xl text-lg inline-block">
                    {formatPrice(listing.gia)}
                  </span>
                </div>
              </div>
              
              <div className="p-8 flex-grow flex flex-col justify-between">
                <h3 className="text-lg font-bold text-gray-800 mb-6 line-clamp-2 leading-relaxed group-hover:text-brand-forest transition-colors">
                  {listing.tieuDe}
                </h3>
                
                <div className="space-y-4">
                   <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <MapPin className="w-4 h-4 text-brand-gold" />
                      <span className="font-medium">{listing.khuVuc} • {listing.diaChi || 'Toàn khu vực'}</span>
                   </div>

                   <div className="flex justify-between items-center text-[11px] text-gray-400 pt-5 border-t border-gray-50 uppercase font-black tracking-widest">
                      <div className="flex items-center gap-1">
                        <Ruler className="w-3.5 h-3.5" /> {listing.dienTich}m²
                      </div>
                      <div className="flex items-center gap-1">
                        <Compass className="w-3.5 h-3.5" /> {listing.huong}
                      </div>
                      <div>Mã: {listing.maSanPham}</div>
                   </div>
                </div>
              </div>
            </Link>
          ); })}
        </div>
      )}
    </div>
  );
}
