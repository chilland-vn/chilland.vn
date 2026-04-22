import { Phone, MessageSquare, Linkedin, Youtube, Award } from 'lucide-react';

export default function BrokerIntro() {
  const qualities = [
    "Chuyên Sun Group, Vingroup, nhà phố trung tâm",
    "Tư vấn đúng nhu cầu, không ép mua",
    "Hỗ trợ pháp lý rõ ràng",
    "Đồng hành trước – trong – sau giao dịch"
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
      <div className="relative order-2 lg:order-1">
        <img 
          src="https://gianglh.th/avatar.png" 
          alt="Lục Hà Giang" 
          className="relative z-10 w-full h-[400px] object-cover rounded-3xl shadow-xl"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://picsum.photos/seed/agent/800/800";
          }}
        />
      </div>

      <div className="order-1 lg:order-2 space-y-6">
        <div className="space-y-1">
          <span className="text-brand-gold uppercase tracking-[0.3em] text-[10px] font-black">Cố vấn tận tâm</span>
          <h2 className="text-4xl font-serif text-brand-forest">Lục Hà Giang</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
           {qualities.map((item, i) => (
             <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-brand-paper shadow-sm">
                <Award className="w-4 h-4 text-brand-gold shrink-0" />
                <p className="text-xs font-bold text-gray-700 leading-tight">{item}</p>
             </div>
           ))}
        </div>

        <div className="pt-4 flex gap-3">
          <a href="tel:0888928628" className="luxury-gradient text-white px-6 py-3 rounded-xl font-bold text-xs flex items-center gap-2 hover:scale-105 transition-all">
            <Phone className="w-4 h-4" /> Liên hệ Giang
          </a>
        </div>
      </div>
    </section>
  );
}
