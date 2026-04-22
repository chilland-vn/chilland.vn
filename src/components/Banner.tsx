import { motion } from 'motion/react';
import { Phone, MessageSquare } from 'lucide-react';

export default function Banner() {
  return (
    <section className="flex flex-col lg:flex-row gap-8 items-center lg:h-[320px] shrink-0 mb-8 max-w-7xl mx-auto px-4 lg:px-8 pt-6">
      {/* Broker Profile Card */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full lg:w-1/3 h-[280px] lg:h-full relative rounded-3xl overflow-hidden bg-gray-200 shadow-xl group"
      >
        <div className="absolute inset-0 flex items-end p-8 bg-gradient-to-t from-brand-forest/90 via-brand-forest/40 to-transparent z-10">
          <div className="text-white">
            <p className="text-[10px] uppercase tracking-[0.3em] opacity-70 mb-2 font-bold">Chuyên gia Môi giới</p>
            <h2 className="text-3xl font-serif mb-2 italic">Lục Hà Giang</h2>
            <p className="text-[10px] uppercase tracking-widest text-brand-gold font-black">CC: 15.06.1985/KH</p>
          </div>
        </div>
        <img 
          src="https://picsum.photos/seed/broker/800/1200" 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
          alt="Lục Hà Giang" 
        />
      </motion.div>

      {/* Main Headline & CTA */}
      <div className="w-full lg:w-2/3 space-y-6 lg:pl-6">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-serif leading-[1.1] text-brand-forest"
        >
          Kiến tạo không gian sống,<br />
          <span className="text-brand-gold italic">Trao gửi trọn niềm tin.</span>
        </motion.h3>
        
        <div className="flex gap-4 pt-2">
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="tel:0888928628"
            className="bg-brand-forest text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 shadow-lg shadow-brand-forest/20"
          >
            <Phone className="w-4 h-4 text-brand-gold" />
            <span>GỌI NGAY</span>
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://zalo.me/0888928628"
            target="_blank"
            className="bg-sky-600 text-white px-10 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20"
          >
            ZALO
          </motion.a>
        </div>
      </div>
    </section>
  );
}
