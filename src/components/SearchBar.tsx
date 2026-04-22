import { REGIONS, DIRECTIONS, CATEGORIES } from '../types';
import { Search, MapPin, Ruler, DollarSign, Compass, Home } from 'lucide-react';
import { useState } from 'react';

export default function SearchBar() {
  const [filters, setFilters] = useState({
    region: '',
    area: '',
    price: '',
    direction: '',
    category2: ''
  });

  const areaRanges = [
    { label: '< 50m²', value: '0-50' },
    { label: '50-100m²', value: '50-100' },
    { label: '100-200m²', value: '100-200' },
    { label: '200-500m²', value: '200-500' },
    { label: '> 500m²', value: '500-9999' }
  ];

  const priceRanges = [
    { label: '< 1 tỷ', value: '0-1000' },
    { label: '1-3 tỷ', value: '1000-3000' },
    { label: '3-5 tỷ', value: '3000-5000' },
    { label: '5-10 tỷ', value: '5000-10000' },
    { label: '10-15 tỷ', value: '10000-15000' },
    { label: '> 15 tỷ', value: '15000-99999' }
  ];

  // Flatten all subcategories (level 2 only as requested)
  const allSubCats = Object.values(CATEGORIES).flat();

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 mb-12">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 rounded-2xl overflow-hidden shadow-2xl border border-black/5 bg-black/5 gap-[1px]">
        
        <div className="bg-white p-5 group hover:bg-brand-cream transition-colors cursor-pointer">
          <div className="text-[9px] uppercase font-black text-gray-400 tracking-widest mb-2 flex items-center gap-1">
             <MapPin className="w-3 h-3 text-brand-gold" /> Khu vực
          </div>
          <select 
            className="w-full bg-transparent font-bold text-sm outline-none appearance-none"
            value={filters.region}
            onChange={(e) => setFilters({...filters, region: e.target.value})}
          >
            <option value="">Nha Trang</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="bg-white p-5 group hover:bg-brand-cream transition-colors cursor-pointer">
          <div className="text-[9px] uppercase font-black text-gray-400 tracking-widest mb-2 flex items-center gap-1">
             <Ruler className="w-3 h-3 text-brand-gold" /> Diện tích
          </div>
          <select 
            className="w-full bg-transparent font-bold text-sm outline-none appearance-none"
            value={filters.area}
            onChange={(e) => setFilters({...filters, area: e.target.value})}
          >
            <option value="">Tất cả</option>
            {areaRanges.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>

        <div className="bg-white p-5 group hover:bg-brand-cream transition-colors cursor-pointer">
          <div className="text-[9px] uppercase font-black text-gray-400 tracking-widest mb-2 flex items-center gap-1">
             <DollarSign className="w-3 h-3 text-brand-gold" /> Mức giá
          </div>
          <select 
            className="w-full bg-transparent font-bold text-sm outline-none appearance-none"
            value={filters.price}
            onChange={(e) => setFilters({...filters, price: e.target.value})}
          >
            <option value="">Tất cả</option>
            {priceRanges.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>

        <div className="bg-white p-5 group hover:bg-brand-cream transition-colors cursor-pointer">
          <div className="text-[9px] uppercase font-black text-gray-400 tracking-widest mb-2 flex items-center gap-1">
             <Compass className="w-3 h-3 text-brand-gold" /> Hướng
          </div>
          <select 
            className="w-full bg-transparent font-bold text-sm outline-none appearance-none"
            value={filters.direction}
            onChange={(e) => setFilters({...filters, direction: e.target.value})}
          >
            <option value="">Đông Nam</option>
            {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="bg-white p-5 group hover:bg-brand-cream transition-colors cursor-pointer">
          <div className="text-[9px] uppercase font-black text-gray-400 tracking-widest mb-2 flex items-center gap-1">
             <Home className="w-3 h-3 text-brand-gold" /> Loại hình
          </div>
          <select 
            className="w-full bg-transparent font-bold text-sm outline-none appearance-none"
            value={filters.category2}
            onChange={(e) => setFilters({...filters, category2: e.target.value})}
          >
            <option value="">Tất cả loại</option>
            {allSubCats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <button className="bg-brand-forest text-white h-full py-5 rounded-none font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-2 hover:bg-brand-gold transition-colors">
          <Search className="w-4 h-4" /> TÌM KIẾM
        </button>

      </div>
    </div>
  );
}
