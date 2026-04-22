import { motion } from 'motion/react';
import { Phone, MessageSquare } from 'lucide-react';

export default function Banner() {
  return (
    <section className="flex flex-col lg:flex-row gap-8 items-center lg:min-h-[350px] shrink-0 mb-8 max-w-7xl mx-auto px-4 lg:px-8 pt-6">
      {/* Main Headline & CTA */}
      <div className="w-full lg:w-3/5 space-y-6 order-2 lg:order-1">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="space-y-4"
        >
          <h1 className="text-3xl md:text-5xl font-serif leading-tight text-brand-forest">
            “Tôi giúp bạn <span className="text-brand-gold italic">chọn đúng tài sản</span> tại Nha Trang”
          </h1>
          
          <p className="text-lg text-gray-600 font-medium border-l-2 border-brand-gold pl-4">
            Sun & Vin | Nhà phố | Chung cư cao cấp
          </p>
        </motion.div>
        
        <div className="flex flex-wrap gap-3 pt-2">
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="tel:0888928628"
            className="luxury-gradient text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl shadow-brand-forest/20"
          >
            <Phone className="w-4 h-4" />
            <span>Gọi ngay</span>
          </motion.a>
          <motion.a 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href="https://zalo.me/0888928628"
            target="_blank"
            className="bg-white border border-brand-forest text-brand-forest px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-sm hover:bg-brand-forest hover:text-white transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Zalo Giang</span>
          </motion.a>
        </div>
      </div>

      {/* Broker Profile Card - Smaller */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full lg:w-2/5 aspect-[16/9] lg:aspect-[4/3] relative rounded-3xl overflow-hidden bg-brand-paper shadow-lg group order-1 lg:order-2"
      >
        <div className="absolute inset-0 flex items-end p-6 bg-gradient-to-t from-brand-forest/80 via-transparent to-transparent z-10">
          <div className="text-white">
            <h2 className="text-xl font-serif">Lục Hà Giang</h2>
            <p className="text-[10px] uppercase tracking-widest text-brand-gold font-bold">Chuyên gia BĐS Nha Trang</p>
          </div>
        </div>
        <img 
          src="https://gianglh.th/avatar.png" 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          alt="Lục Hà Giang" 
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://picsum.photos/seed/broker/800/600";
          }}
        />
      </motion.div>
    </section>
  );
}
