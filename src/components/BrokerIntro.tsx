import { Phone, MessageSquare, Linkedin, Youtube, Award } from 'lucide-react';

export default function BrokerIntro() {
  return (
    <section className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-20 items-center">
      <div className="relative order-2 lg:order-1">
        <div className="absolute inset-0 bg-brand-forest/5 rounded-3xl -rotate-3 transition-transform hover:rotate-0 duration-500"></div>
        <img 
          src="https://gianglh.th/avatar.png" // Placeholder
          alt="Lục Hà Giang" 
          className="relative z-10 w-full h-[600px] object-cover rounded-3xl shadow-2xl"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://picsum.photos/seed/agent/800/1200";
          }}
        />
        <div className="absolute -bottom-10 -right-10 z-20 bg-brand-forest text-white p-8 rounded-2xl shadow-2xl hidden md:block">
           <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-brand-gold rounded-xl">
                 <Award className="w-8 h-8 text-brand-forest" />
              </div>
              <div>
                 <p className="text-brand-gold text-[10px] uppercase tracking-widest font-bold">Số chứng chỉ</p>
                 <p className="text-xl font-serif">15061985-LH G</p>
              </div>
           </div>
           <p className="text-sm opacity-80 italic">"Gắn bó với thị trường BĐS Nha Trang bằng cả sự tận tâm và kiến thức chuyên môn."</p>
        </div>
      </div>

      <div className="order-1 lg:order-2 space-y-8">
        <span className="text-brand-gold uppercase tracking-[0.3em] text-sm font-bold">Chân dung môi giới</span>
        <h2 className="text-6xl font-serif tracking-tight">Lục Hà Giang</h2>
        <p className="text-lg text-gray-600 leading-relaxed">
          Với hơn 10 năm kinh nghiệm trong lĩnh vực bất động sản tại Khánh Hòa, tôi tự hào là người đồng hành tin cậy cho hàng trăm nhà đầu tư. Triết lý làm việc của tôi lấy "Giá trị tích lũỹ niềm tin" làm kim chỉ nam.
        </p>
        
        <div className="space-y-4">
           <div className="flex items-center gap-6 p-4 rounded-2xl border border-gray-100 hover:border-brand-gold transition-colors group">
              <a href="tel:0888928628" className="bg-brand-forest p-4 rounded-xl text-white group-hover:bg-brand-gold transition-colors">
                <Phone className="w-6 h-6" />
              </a>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Hotline 24/7</p>
                <p className="text-xl font-bold">0888.928.628</p>
              </div>
           </div>
           
           <div className="flex items-center gap-6 p-4 rounded-2xl border border-gray-100 hover:border-brand-gold transition-colors group">
              <a href="https://zalo.me/0888928628" target="_blank" rel="noreferrer" className="bg-blue-600 p-4 rounded-xl text-white">
                <MessageSquare className="w-6 h-6" />
              </a>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Zalo tư vấn</p>
                <p className="text-xl font-bold underline">0888.928.628</p>
              </div>
           </div>
        </div>

        <div className="flex gap-4 pt-4">
           <a href="#" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-brand-forest hover:text-brand-forest transition-all">
             <Linkedin className="w-5 h-5" />
           </a>
           <a href="#" className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:border-brand-forest hover:text-brand-forest transition-all">
             <Youtube className="w-5 h-5" />
           </a>
        </div>
      </div>
    </section>
  );
}
