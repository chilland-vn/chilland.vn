import { motion } from 'motion/react';
import { Phone, MessageSquare } from 'lucide-react';

export default function FloatingCTA() {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] w-[90%] max-w-md lg:hidden">
      <div className="bg-brand-forest/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-2 flex gap-2">
        <motion.a 
          whileTap={{ scale: 0.95 }}
          href="tel:0888928628"
          className="flex-1 bg-white h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg"
        >
          <Phone className="w-5 h-5 text-brand-gold fill-brand-gold/10" />
          <span className="text-[11px] font-black uppercase tracking-widest text-brand-forest">Gọi ngay</span>
        </motion.a>
        
        <motion.a 
          whileTap={{ scale: 0.95 }}
          href="https://zalo.me/0888928628"
          target="_blank"
          className="flex-1 bg-brand-gold h-12 rounded-xl flex items-center justify-center gap-2 shadow-lg"
        >
          <MessageSquare className="w-5 h-5 text-white fill-white/10" />
          <span className="text-[11px] font-black uppercase tracking-widest text-white">Chat Zalo</span>
        </motion.a>
      </div>
    </div>
  );
}
