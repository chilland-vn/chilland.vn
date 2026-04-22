import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MessageSquare, Award, ShieldAlert, TrendingUp, Search, FileCheck, Mail, MapPin, X, Star, HeartHandshake, Building2 } from 'lucide-react';

export default function TrustFooter() {
  const [showAbout, setShowAbout] = useState(false);

  const pains = [
    { title: "Chuyên Sun & Vin, Nhà phố, Căn hộ Nha Trang", icon: <Building2 className="w-4 h-4" /> },
    { title: "Tư vấn tận tâm", icon: <HeartHandshake className="w-4 h-4" /> },
    { title: "Giá gốc chính chủ", icon: <TrendingUp className="w-4 h-4" /> },
    { title: "Pháp lý rõ ràng", icon: <ShieldAlert className="w-4 h-4" /> },
    { title: "Đồng hành trọn đời", icon: <Search className="w-4 h-4" /> }
  ];

  return (
    <footer className="bg-brand-paper/40 py-12 border-t border-brand-paper">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Column 1: Advisor Info - Name Larger (4 columns) */}
          <div className="lg:col-span-4 flex items-center gap-6">
            <div className="relative shrink-0">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img 
                  src="https://gianglh.th/avatar.png" 
                  alt="Lục Hà Giang" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://picsum.photos/seed/broker/200/200";
                  }}
                />
              </div>
              <div className="absolute -top-1 -right-1 bg-brand-gold text-brand-forest p-1.5 rounded-full shadow-md border border-white">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1.5 min-w-max">
              <span className="text-brand-gold uppercase tracking-[0.2em] text-[10px] font-black underline underline-offset-4 whitespace-nowrap">Cố vấn tận tâm</span>
              <h3 className="text-3xl font-serif text-brand-forest leading-none whitespace-nowrap">Lục Hà Giang</h3>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest leading-none pb-1">
                CC: 15061985-LH G
              </p>
              <div className="pt-2">
                <button 
                  onClick={() => setShowAbout(true)}
                  className="text-xs font-black uppercase text-brand-forest hover:text-brand-gold flex items-center gap-1.5 transition-colors group"
                >
                  <Star className="w-3.5 h-3.5 group-hover:rotate-45 transition-transform" /> Tìm hiểu về Giang
                </button>
              </div>
            </div>
          </div>

          {/* Column 2: Commitments + Contact Info (5 columns) */}
          <div className="lg:col-span-5 bg-white/40 p-6 rounded-3xl border border-white/60 space-y-5">
            <div className="space-y-3.5 pb-4 border-b border-brand-gold/10">
              {pains.map((p, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="text-brand-gold shrink-0">
                    {p.icon}
                  </div>
                  <span className="text-xs font-bold text-gray-700">{p.title}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-3 text-xs text-brand-forest">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span className="font-bold">gianglh.th@gmail.com</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-brand-forest">
                <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
                <span className="font-bold">Nha Trang, Khánh Hòa</span>
              </div>
            </div>
          </div>

          {/* Column 3: High Conversion CTA (3 columns) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
              <motion.a 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="https://zalo.me/0888928628"
                target="_blank"
                className="luxury-gradient text-white px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(27,67,50,0.3)] flex items-center justify-center gap-3"
              >
                <MessageSquare className="w-5 h-5 fill-white/20" /> Nhắn Zalo Giang
              </motion.a>
              <motion.a 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href="tel:0888928628"
                className="bg-white border-2 border-brand-forest text-brand-forest px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 hover:bg-brand-forest hover:text-white transition-all duration-300"
              >
                <Phone className="w-5 h-5 text-brand-gold fill-brand-gold/10" /> Gọi trực tiếp
              </motion.a>
          </div>

        </div>
      </div>

      {/* About Me Modal */}
      <AnimatePresence>
        {showAbout && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAbout(false)}
              className="absolute inset-0 bg-brand-forest/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowAbout(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
              
              <div className="flex gap-6 items-start">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border-2 border-brand-gold">
                  <img 
                    src="https://gianglh.th/avatar.png" 
                    alt="Lục Hà Giang" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://picsum.photos/seed/broker/200/200";
                    }}
                  />
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-serif text-brand-forest">Lục Hà Giang</h3>
                  <p className="text-brand-gold font-bold text-[10px] uppercase tracking-[0.2em]">Chuyên gia BĐS cao cấp tại Nha Trang</p>
                </div>
              </div>

              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>Tôi là <strong>Lục Hà Giang</strong>, một cố vấn bất động sản tâm huyết với hơn nhiều năm kinh nghiệm tại thị trường Nha Trang - Khánh Hòa. Với phương châm <em>"Giá trị tích luỹ niềm tin"</em>, tôi không chỉ bán một bất động sản, mà tôi đồng hành cùng quý khách để tìm ra một tài sản giá trị thật.</p>
                
                <div className="grid grid-cols-1 gap-2 bg-brand-paper/50 p-4 rounded-xl border border-brand-gold/10">
                  {[
                    "Chuyên sâu các dự án Sun Group, Vingroup & Nhà phố trung tâm Nha Trang.",
                    "Tư vấn đúng nhu cầu, phân tích bài toán tài chính tối ưu, không áp đặt ép mua.",
                    "Giá gốc chính chủ: Đảm bảo quyền lợi khách hàng với mức giá thực tế.",
                    "Pháp lý rõ ràng: Chỉ giới thiệu các sản phẩm sạch, đủ điều kiện pháp lý.",
                    "Đồng hành trọn đời: Hỗ trợ khách hàng trước, trong và sau khi hoàn thành giao dịch."
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-brand-gold mt-1.5 flex-shrink-0" />
                      <p className="text-[12px]">{item}</p>
                    </div>
                  ))}
                </div>

                <p className="pt-2 italic text-brand-forest text-xs font-medium border-t border-gray-100 mt-4">"Tôi tin rằng mỗi giao dịch thành công bắt đầu từ sự trung thực và kết thúc bằng sự hài lòng bền lâu của khách hàng."</p>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  onClick={() => setShowAbout(false)}
                  className="bg-brand-forest text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-brand-ink transition-colors"
                >
                  Đóng lại
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </footer>
  );
}

