import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BấtĐộngSản, KháchHàng } from '../types';
import { getBatDongSanById, getAllBatDongSan, addKhachHang } from '../services/firebaseService';
import { 
  Ruler, MapPin, Compass, Phone, FileText, Calendar, 
  ChevronRight, Share2, Heart, PlayCircle, Map, Info, User
} from 'lucide-react';
import { formatPrice, formatDate } from '../lib/utils';
import { DEFAULT_PROPERTY_IMAGE } from '../constants';
import Loading from '../components/Loading';
import { motion } from 'motion/react';

/**
 * TRANG CHI TIẾT SẢN PHẨM: LẤY DỮ LIỆU THEO ID VÀ FORM KHÁCH HÀNG
 */

export default function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState<BấtĐộngSản | null>(null);
  const [related, setRelated] = useState<BấtĐộngSản[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  
  const [contactForm, setContactForm] = useState({ hoTen: '', soDienThoai: '', nhuCau: '' });

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        console.log(`🏠 Đang tải chi tiết SP: ${id}`);
        const data = await getBatDongSanById(id!);
        if (data) {
          setListing(data);
          
          // Gợi ý sản phẩm cùng mục
          const all = await getAllBatDongSan();
          setRelated(all.filter(l => l.id !== id && l.loaiCap2 === data.loaiCap2).slice(0, 3));
        }
      } catch (error) {
        console.error("❌ Lỗi tải chi tiết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
    window.scrollTo(0, 0);
  }, [id]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("📩 Đang gửi thông tin khách hàng:", contactForm.hoTen);
      await addKhachHang({
        ...contactForm,
        sanPhamQuanTam: id
      });
      alert('Thông tin của bạn đã được gửi tới Lục Hà Giang. Tôi sẽ liên hệ lại ngay lập tức!');
      setContactForm({ hoTen: '', soDienThoai: '', nhuCau: '' });
    } catch (error) {
      alert('Lỗi khi gửi thông tin: ' + error);
    }
  };

  if (loading) return <Loading />;
  if (!listing) return <div className="text-center py-20 font-serif text-2xl">Không tìm thấy sản phẩm.</div>;

  // Logic lấy mảng ảnh để hiển thị gallery
  const galleryImages = (listing.danhSachAnh && listing.danhSachAnh.length > 0) 
    ? listing.danhSachAnh 
    : [listing.imageUrl || DEFAULT_PROPERTY_IMAGE];

  return (
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-6 text-sm text-gray-500 flex items-center gap-2">
        <Link to="/" className="hover:text-brand-forest">Trang chủ</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to={`/danh-muc/${encodeURIComponent(listing.loaiCap1)}`} className="hover:text-brand-forest">{listing.loaiCap1}</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium line-clamp-1">{listing.tieuDe}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cột Trái: Ảnh & Nội dung */}
          <div className="lg:col-span-2 space-y-10">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl group">
                <img 
                  src={galleryImages[activeImg] || DEFAULT_PROPERTY_IMAGE} 
                  alt={listing.tieuDe}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_PROPERTY_IMAGE;
                  }}
                />
                <div className="absolute bottom-6 right-6 flex gap-3">
                   <button className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:bg-brand-forest hover:text-white transition-all"><Share2 className="w-5 h-5" /></button>
                   <button className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg hover:text-red-500 transition-all"><Heart className="w-5 h-5" /></button>
                </div>
                {listing.trangThai === 'Đã bán' && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="border-8 border-white text-white font-black text-6xl px-12 py-4 rotate-12 rounded-3xl opacity-80 uppercase tracking-widest">ĐÃ BÁN</span>
                  </div>
                )}
              </div>
              
              {galleryImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {galleryImages.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setActiveImg(idx)}
                      className={`flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${activeImg === idx ? 'border-brand-gold scale-105 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Thông tin chính */}
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                 <span className="bg-brand-paper text-brand-forest px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-brand-forest/10">{listing.loaiCap2}</span>
                 <span className="bg-brand-paper text-brand-gold px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-brand-gold/10">Mã SP: {listing.maSanPham}</span>
              </div>
              <h1 className="text-4xl font-serif text-brand-forest leading-tight">{listing.tieuDe}</h1>
              <div className="flex items-center gap-3 text-gray-500 font-medium">
                <MapPin className="w-5 h-5 text-brand-gold" />
                <span className="text-lg">{listing.diaChi} • {listing.khuVuc}</span>
              </div>
            </div>

            {/* Đặc điểm */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-10 border-y border-brand-paper">
               <div className="text-center space-y-1">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Giá bán</p>
                 <p className="text-2xl font-black text-brand-gold">{formatPrice(listing.gia)}</p>
               </div>
               <div className="text-center space-y-1">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Diện tích</p>
                 <p className="text-2xl font-black text-brand-forest">{listing.dienTich} m²</p>
               </div>
               <div className="text-center space-y-1">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hướng cửa</p>
                 <p className="text-2xl font-black text-brand-forest">{listing.huong}</p>
               </div>
               <div className="text-center space-y-1">
                 <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pháp lý</p>
                 <p className="text-2xl font-black text-brand-forest">{listing.phapLy}</p>
               </div>
            </div>

            {/* Mô tả chi tiết */}
            <div className="space-y-6">
               <div className="flex items-center gap-3 border-l-4 border-brand-gold pl-4">
                  <h2 className="text-2xl font-serif text-brand-forest">Mô tả chi tiết</h2>
               </div>
               <div className="text-gray-600 leading-loose whitespace-pre-wrap text-lg">
                 {listing.noiDung}
               </div>
            </div>

            {/* Tiện ích / Đặc điểm nổi bật */}
            {listing.dacDiemNoiBat && listing.dacDiemNoiBat.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-l-4 border-brand-gold pl-4">
                  <h2 className="text-2xl font-serif text-brand-forest">Đặc điểm nổi bật</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {listing.dacDiemNoiBat.map((info, i) => (
                     <div key={i} className="flex items-center gap-3 bg-brand-paper/40 p-4 rounded-2xl">
                        <CheckCircleIcon />
                        <span className="font-medium text-gray-700">{info}</span>
                     </div>
                   ))}
                </div>
              </div>
            )}

            {/* Maps & Video Placeholders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-brand-paper/30 p-8 rounded-3xl text-center space-y-4 border border-brand-paper hover:border-brand-gold transition-all group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-all"><PlayCircle className="w-8 h-8 text-brand-gold" /></div>
                  <h3 className="font-bold text-gray-800 uppercase tracking-widest text-xs">Video thực tế</h3>
                  <p className="text-xs text-gray-400">Xem video 4K chi tiết sản phẩm</p>
               </div>
               <div className="bg-brand-paper/30 p-8 rounded-3xl text-center space-y-4 border border-brand-paper hover:border-brand-forest transition-all group">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 transition-all"><Map className="w-8 h-8 text-brand-forest" /></div>
                  <h3 className="font-bold text-gray-800 uppercase tracking-widest text-xs">Vị trí bản đồ</h3>
                  <p className="text-xs text-gray-400">Xem vị trí trên Google Maps</p>
               </div>
            </div>
          </div>

          {/* Cột Phải: Sidebar & Form */}
          <div className="space-y-8">
            {/* Form liên hệ */}
            <div className="sticky top-24 bg-white p-8 rounded-[40px] shadow-2xl border border-brand-paper space-y-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-paper rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="relative z-10">
                <h3 className="text-2xl font-serif text-brand-forest mb-2">Bạn quan tâm sản phẩm này?</h3>
                <p className="text-sm text-gray-500 italic mb-8">Để lại thông tin, Lục Hà Giang sẽ gọi lại cho bạn ngay!</p>
                
                <form onSubmit={handleContactSubmit} className="space-y-5">
                   <div className="relative">
                      <User className="absolute left-4 top-4 w-5 h-5 text-gray-300" />
                      <input required value={contactForm.hoTen} onChange={e => setContactForm({...contactForm, hoTen: e.target.value})} placeholder="Họ và tên của bạn..." className="w-full pl-12 pr-4 py-4 bg-brand-paper/40 border-0 rounded-2xl focus:ring-2 focus:ring-brand-forest transition-all" />
                   </div>
                   <div className="relative">
                      <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-300" />
                      <input required value={contactForm.soDienThoai} onChange={e => setContactForm({...contactForm, soDienThoai: e.target.value})} placeholder="Số điện thoại..." className="w-full pl-12 pr-4 py-4 bg-brand-paper/40 border-0 rounded-2xl focus:ring-2 focus:ring-brand-forest transition-all" />
                   </div>
                   <textarea value={contactForm.nhuCau} onChange={e => setContactForm({...contactForm, nhuCau: e.target.value})} placeholder="Ghi chú thêm nhu cầu (không bắt buộc)..." className="w-full p-4 bg-brand-paper/40 border-0 rounded-2xl h-32 focus:ring-2 focus:ring-brand-forest transition-all resize-none" />
                   <button type="submit" className="w-full luxury-gradient text-white py-5 rounded-2xl font-black text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all">NHẬN TƯ VẤN NGAY</button>
                </form>

                <div className="pt-8 border-t border-gray-100 flex items-center gap-4">
                   <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-brand-paper">
                      <img src="https://picsum.photos/seed/broker/200/200" className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phụ trách sản phẩm</p>
                      <p className="font-bold text-brand-forest uppercase">Lục Hà Giang</p>
                      <a href="tel:0888928628" className="text-sm font-black text-brand-gold hover:underline">0888.928.628</a>
                   </div>
                </div>
              </div>
            </div>

            {/* Sản phẩm liên quan */}
            {related.length > 0 && (
              <div className="space-y-6">
                <h3 className="text-xl font-serif text-brand-forest border-b-2 border-brand-paper pb-2">Sản phẩm tương tự</h3>
                <div className="space-y-4">
                  {related.map(rel => (
                    <Link key={rel.id} to={`/san-pham/${rel.id}`} className="group flex gap-4 bg-white p-3 rounded-2xl hover:shadow-lg transition-all border border-transparent hover:border-brand-paper">
                       <img 
                         src={rel.imageUrl || DEFAULT_PROPERTY_IMAGE} 
                         className="w-20 h-20 object-cover rounded-xl shadow-sm" 
                         referrerPolicy="no-referrer" 
                         onError={(e) => {
                           (e.target as HTMLImageElement).src = DEFAULT_PROPERTY_IMAGE;
                         }}
                       />
                       <div className="space-y-1 py-1">
                          <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-brand-forest transition-colors">{rel.tieuDe}</p>
                          <p className="text-brand-gold font-black text-sm">{formatPrice(rel.gia)}</p>
                          <p className="text-[10px] text-gray-400 font-medium italic">{rel.khuVuc}</p>
                       </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircleIcon() {
  return (
    <svg className="w-5 h-5 text-brand-gold shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}
