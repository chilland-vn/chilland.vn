import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';

export default function ProjectShowcase() {
  const projects = [
    {
      name: "Charmoracity",
      tagline: "Khu đô thị đẳng cấp trung tâm Dĩ An",
      image: "https://picsum.photos/seed/charm/800/600",
      color: "from-blue-600/80"
    },
    {
      name: "Vinpearl Bay",
      tagline: "Hào quang rực rỡ bên vịnh biển",
      image: "https://picsum.photos/seed/vinpearl/800/600",
      color: "from-brand-gold/80"
    },
    {
      name: "Dự án Anh Nguyễn",
      tagline: "Kiệt tác nghỉ dưỡng trên triền núi",
      image: "https://picsum.photos/seed/anhnguyen/800/600",
      color: "from-brand-forest/80"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="space-y-2">
           <span className="text-brand-gold uppercase tracking-[0.2em] text-[10px] font-black">Dự án tâm điểm</span>
           <h2 className="text-4xl font-serif text-brand-forest italic">Dự án tiêu biểu đang phân phối</h2>
        </div>
        <p className="text-gray-400 text-sm max-w-md italic">
          Khám phá danh sách các dự án trọng điểm với tiềm năng sinh lời và không gian sống thượng lưu tại Nha Trang.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((project, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="group relative aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl"
          >
            <div className={`absolute inset-0 bg-gradient-to-t ${project.color} to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity`}></div>
            <img 
              src={project.image} 
              alt={project.name} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-end p-8 text-white">
               <h3 className="text-2xl font-bold mb-2">{project.name}</h3>
               <p className="text-sm opacity-90 mb-6 font-medium italic">{project.tagline}</p>
               <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b border-white/30 pb-1 hover:border-white transition-all w-fit">
                 Tìm hiểu thêm <ExternalLink className="w-3 h-3" />
               </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

