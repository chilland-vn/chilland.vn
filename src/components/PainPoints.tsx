import { ShieldAlert, TrendingUp, Search, FileCheck } from 'lucide-react';
import { motion } from 'motion/react';

export default function PainPoints() {
  const pains = [
    { title: "Sợ mua nhầm pháp lý", icon: <ShieldAlert className="w-8 h-8" />, desc: "Kiểm tra quy hoạch, pháp lý minh bạch trước khi giao dịch." },
    { title: "Giá bị kê cao", icon: <TrendingUp className="w-8 h-8" />, desc: "Cam kết giá gốc chính chủ, không qua nhiều tầng trung gian." },
    { title: "Không biết chọn căn nào", icon: <Search className="w-8 h-8" />, desc: "Phân tích ưu nhược điểm từng căn để bạn chọn đúng nhu cầu." },
    { title: "Lo không ra sổ", icon: <FileCheck className="w-8 h-8" />, desc: "Hỗ trợ thủ tục sang tên, cấp sổ tận tâm đến khi hoàn tất." }
  ];

  return (
    <section className="bg-brand-paper/50 py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16 space-y-4">
           <h2 className="text-3xl md:text-5xl font-serif text-brand-forest italic">Đừng để việc mua nhà trở thành gánh nặng lo âu</h2>
           <p className="text-gray-500 uppercase tracking-widest text-xs font-black">Giang hiểu những khó khăn bạn đang gặp phải</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
           {pains.map((p, i) => (
             <motion.div 
               key={i}
               whileHover={{ y: -10 }}
               className="bg-white p-8 rounded-[32px] shadow-xl border border-brand-paper hover:border-brand-gold transition-all"
             >
                <div className="w-16 h-16 bg-brand-paper rounded-2xl flex items-center justify-center text-brand-gold mb-6">
                   {p.icon}
                </div>
                <h3 className="text-xl font-bold text-brand-forest mb-4">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
             </motion.div>
           ))}
        </div>
      </div>
    </section>
  );
}
