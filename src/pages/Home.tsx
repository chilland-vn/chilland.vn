import Banner from '../components/Banner';
import SearchBar from '../components/SearchBar';
import FeaturedListings from '../components/FeaturedListings';
import BrokerIntro from '../components/BrokerIntro';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <div>
        <Banner />
        <SearchBar />
      </div>

      {/* Featured Listings */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-xs uppercase tracking-[0.3em] font-black text-brand-forest">Tin nổi bật - Nha Trang</h2>
            <div className="w-12 h-1 bg-brand-gold mt-2"></div>
          </div>
          <Link to="/danh-muc/Nhà đất dân cư" className="text-[10px] uppercase font-black text-brand-gold border-b-2 border-brand-gold pb-1 hover:text-brand-forest hover:border-brand-forest transition-all">
            Xem tất cả
          </Link>
        </div>
        <FeaturedListings />
      </section>

      {/* Video Section */}
      <section className="luxury-gradient py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-brand-gold uppercase tracking-widest text-sm font-bold">Video Review</span>
            <h2 className="text-5xl font-serif mt-4 mb-8">Trải nghiệm thực tế dự án</h2>
            <p className="text-lg opacity-80 leading-relaxed mb-10 italic">
               "Một góc nhìn chân thực hơn về không gian sống và tiềm năng đầu tư. Chúng tôi trực tiếp đi khảo sát từng ngõ ngách để mang lại thông tin chính xác nhất."
            </p>
          </div>
          <div className="aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl relative group">
             <iframe 
               width="100%" 
               height="100%" 
               src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
               title="YouTube video player" 
               frameBorder="0" 
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
               allowFullScreen
             ></iframe>
             <div className="absolute inset-0 bg-brand-forest/10 pointer-events-none group-hover:opacity-0 transition-opacity"></div>
          </div>
        </div>
      </section>

      {/* Broker Intro */}
      <BrokerIntro />
    </div>
  );
}
