import SearchBar from '../components/SearchBar';
import ListingSection from '../components/ListingSection';
import ProjectShowcase from '../components/ProjectShowcase';
import TrustFooter from '../components/TrustFooter';
import FloatingCTA from '../components/FloatingCTA';
import FeaturedNews from '../components/FeaturedNews';

export default function Home() {
  const sections = [
    { category: "Nhà đất dân cư", title: "Nhà Đất Dân Cư", subtitle: "Tinh hoa bất động sản" },
    { category: "Nhà đất khu đô thị", title: "Nhà Đất Khu Đô Thị", subtitle: "Tâm điểm các dự án quy mô" },
    { category: "Căn hộ chung cư", title: "Căn Hộ Chung Cư", subtitle: "Trải nghiệm sống tầm cao mới" },
    { category: "Khách sạn", title: "Khách Sạn & Resort", subtitle: "Cơ hội kinh doanh đắc lợi" },
    { category: "Cho thuê BĐS", title: "Bất Động Sản Cho Thuê", subtitle: "Tạo ra dòng tiền bền vững" },
  ];

  return (
    <div className="space-y-4 pb-24 relative">
      {/* Floating Buttons for Mobile */}
      <FloatingCTA />

      {/* SearchBar at the top */}
      <div className="pt-20 pb-10 text-center space-y-4">
        <div className="space-y-2">
          <span className="text-brand-gold uppercase tracking-[0.4em] text-[10px] font-black">Khởi đầu hành trình tinh hoa</span>
          <h1 className="text-4xl md:text-5xl font-serif text-brand-forest italic">Tìm kiếm không gian sống của riêng bạn</h1>
        </div>
        <SearchBar />
      </div>

      {/* Projects Showcase */}
      <ProjectShowcase />

      {/* Categorized Listings */}
      <div>
        {sections.map((section) => (
          <ListingSection 
            key={section.category}
            category={section.category}
            title={section.title}
            subtitle={section.subtitle}
          />
        ))}
      </div>

      {/* Featured News Section */}
      <FeaturedNews />

      {/* Combined Trust Section at the bottom */}
      <div className="pt-20">
        <TrustFooter />
      </div>
    </div>
  );
}
