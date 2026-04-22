export default function News() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
         <h1 className="text-5xl font-serif text-brand-forest mb-4">Tin tức & Kinh nghiệm</h1>
         <p className="text-gray-500">Cập nhật thị trường bất động sản Nha Trang mới nhất và chia sẻ kinh nghiệm đầu tư.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* Placeholder news items */}
        {[1, 2, 3].map(i => (
          <div key={i} className="group cursor-pointer">
            <div className="aspect-video overflow-hidden rounded-2xl mb-6 shadow-md">
               <img src={`https://picsum.photos/seed/news${i}/800/450`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">21 Tháng 04, 2026 • Kinh nghiệm</p>
            <h3 className="text-2xl font-serif text-brand-forest mb-4 line-clamp-2 leading-snug group-hover:text-brand-gold transition-colors">
               Thanh khoản bất động sản Nha Trang quý 1 năm 2026: Những dấu hiệu tích cực từ hạ tầng.
            </h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
               Cùng Lục Hà Giang điểm qua những dự án hạ tầng trọng điểm đang thúc đẩy giá trị bất động sản dân dụng và khu đô thị tại khu vực phía Tây Nha Trang...
            </p>
            <span className="text-xs font-bold text-brand-gold flex items-center gap-2">XEM CHI TIẾT →</span>
          </div>
        ))}
      </div>
    </div>
  );
}
