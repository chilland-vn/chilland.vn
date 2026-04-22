import { motion } from 'motion/react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FeaturedNews() {
  const news = [
    {
      id: 1,
      title: "Thị trường BĐS Nha Trang 2026: Đâu là điểm nóng đầu tư?",
      date: "22 Tháng 04, 2026",
      category: "Kiến trúc & Đầu tư",
      image: "https://picsum.photos/seed/nha1/800/600",
      excerpt: "Phân tích xu hướng chuyển dịch dòng tiền từ trung tâm sang các khu đô thị vệ tinh tại Khánh Hòa..."
    },
    {
      id: 2,
      title: "Kinh nghiệm pháp lý khi mua nhà phố cổ Nha Trang",
      date: "20 Tháng 04, 2026",
      category: "Pháp lý",
      image: "https://picsum.photos/seed/nha2/800/600",
      excerpt: "Những lưu ý quan trọng về quy hoạch và sổ đỏ khi giao dịch tại các khu vực lâu đời..."
    },
    {
      id: 3,
      title: "Cập nhật tiến độ các dự án Sun Group tại Nha Trang",
      date: "18 Tháng 04, 2026",
      category: "Dự án mới",
      image: "https://picsum.photos/seed/nha3/800/600",
      excerpt: "Tiến độ thi công thực tế và thời điểm bàn giao các phân khu thấp tầng..."
    }
  ];

  return (
    <section className="py-12 bg-white/50 border-t border-brand-paper">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 bg-brand-forest/5 rounded-full flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-brand-gold" />
             </div>
             <div>
                <span className="text-brand-gold uppercase tracking-[0.2em] text-[10px] font-black italic">Kiến thức chuyên sâu</span>
                <h2 className="text-2xl font-serif text-brand-forest italic">Tin Tức & Kinh Nghiệm</h2>
             </div>
          </div>
          <Link 
            to="/tin-tuc" 
            className="flex items-center gap-2 text-[10px] uppercase font-black text-brand-gold hover:text-brand-forest transition-colors group bg-white px-4 py-2 rounded-full border border-brand-paper shadow-sm"
          >
            Tất cả tin tức <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item) => (
            <motion.div 
              key={item.id}
              whileHover={{ x: 5 }}
              className="group cursor-pointer bg-white p-3 rounded-2xl border border-brand-paper shadow-sm hover:shadow-md transition-all"
            >
              <Link to="/tin-tuc" className="flex items-center gap-4">
                <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-xl">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <span className="text-[9px] uppercase font-black tracking-widest text-brand-gold opacity-70">
                    {item.date}
                  </span>
                  <h3 className="text-sm font-serif text-brand-forest italic leading-tight group-hover:text-brand-gold transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
