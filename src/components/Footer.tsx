import { Shield, Phone, Mail, MapPin, Facebook, Youtube, Instagram, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-brand-forest text-white/90 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-20">
        
        {/* Brand */}
        <div className="space-y-6">
          <Link to="/" className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
               <span className="text-brand-forest font-black text-xl">C</span>
             </div>
             <div className="flex flex-col">
               <span className="text-xl font-bold tracking-tighter leading-none">Chilland.vn</span>
               <span className="text-[9px] tracking-[0.2em] opacity-60 uppercase font-black">Giá trị tích luỹ niềm tin</span>
             </div>
          </Link>
          <p className="text-xs opacity-60 leading-relaxed font-medium">
            Nền tảng kết nối những giá trị thực trong bất động sản tại Khánh Hòa. Kiến tạo không gian sống, trao gửi trọn niềm tin.
          </p>
          <div className="flex gap-4">
             <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors"><Facebook className="w-4 h-4" /></a>
             <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors"><Youtube className="w-4 h-4" /></a>
             <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-gold transition-colors"><Instagram className="w-4 h-4" /></a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-brand-gold font-serif text-xl mb-8 uppercase tracking-widest">Danh mục</h4>
          <ul className="space-y-4 text-sm opacity-70">
            <li><Link to="/danh-muc/Nhà đất dân cư" className="hover:text-brand-gold">Nhà đất dân cư</Link></li>
            <li><Link to="/danh-muc/Nhà đất khu đô thị" className="hover:text-brand-gold">Nhà đất khu đô thị</Link></li>
            <li><Link to="/danh-muc/Căn hộ chung cư" className="hover:text-brand-gold">Căn hộ chung cư</Link></li>
            <li><Link to="/danh-muc/Khách sạn" className="hover:text-brand-gold">Khách sạn</Link></li>
            <li><Link to="/danh-muc/Cho thuê BĐS" className="hover:text-brand-gold">Cho thuê</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-brand-gold font-serif text-xl mb-8 uppercase tracking-widest">Thông tin liên hệ</h4>
          <ul className="space-y-6">
            <li className="flex gap-4 text-sm">
              <Phone className="w-5 h-5 text-brand-gold shrink-0" />
              <div>
                 <p className="font-bold">Hotline / Zalo</p>
                 <p className="opacity-70">0888.928.628</p>
              </div>
            </li>
            <li className="flex gap-4 text-sm">
              <Mail className="w-5 h-5 text-brand-gold shrink-0" />
              <div>
                 <p className="font-bold">Email</p>
                 <p className="opacity-70">gianglh.th@gmail.com</p>
              </div>
            </li>
            <li className="flex gap-4 text-sm">
              <MapPin className="w-5 h-5 text-brand-gold shrink-0" />
              <div>
                 <p className="font-bold">Văn phòng</p>
                 <p className="opacity-70">Thành phố Nha Trang, tỉnh Khánh Hòa</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Certificate */}
        <div className="bg-white/5 p-8 rounded-2xl border border-white/10 space-y-4">
           <div className="p-3 bg-brand-gold/20 rounded-xl w-fit">
              <Shield className="w-8 h-8 text-brand-gold" />
           </div>
           <h4 className="font-serif text-xl">Chứng chỉ hành nghề</h4>
           <p className="text-xs opacity-50 uppercase tracking-widest">Số thẻ: 15061985-LH G</p>
           <p className="text-sm italic opacity-70">"Được cấp bởi Sở Xây Dựng tỉnh Khánh Hòa, cam kết tư vấn chuẩn pháp lý."</p>
        </div>

      </div>

      <div className="max-w-7xl mx-auto px-4 mt-24 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase font-bold tracking-[0.2em] opacity-40">
        <p>© 2026 Chilland.vn - All rights reserved</p>
        <div className="flex items-center gap-4">
           <p>Phát triển bởi chuyên gia Lục Hà Giang</p>
           <Link to="/admin" className="hover:text-brand-gold transition-colors">
              <Lock className="w-3 h-3" />
           </Link>
        </div>
      </div>
    </footer>
  );
}
