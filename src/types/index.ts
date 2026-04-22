export interface BấtĐộngSản {
  id: string;
  maSanPham: string;
  loaiCap1: string; // Nhà đất dân cư, Nhà đất khu đô thị, Căn hộ chung cư, Khách sạn, Cho thuê
  loaiCap2: string; // Đất ở, An Viên...
  tieuDe: string;
  noiDung: string;
  gia: number; // Trong triệu/tỷ
  dienTich: number;
  huong: string;
  khuVuc: string;
  diaChi: string;
  phapLy: string;
  trangThai: 'Đang bán' | 'Đã bán' | 'Ngừng giao dịch';
  dacDiemNoiBat: string[];
  danhSachAnh: string[];
  anhDaiDien: string;
  imageUrl?: string;
  videoUrl?: string;
  googleMap?: string;
  nguoiPhuTrach: string;
  soDienThoai: string;
  createdAt: any;
  updatedAt: any;
}

export interface KháchHàng {
  id: string;
  hoTen: string;
  soDienThoai: string;
  nhuCau: string;
  sanPhamQuanTam?: string; // listingId
  createdAt: any;
}

export interface CấuHìnhWeb {
  tenWebsite: string;
  slogan: string;
  hotline: string;
  zalo: string;
  email: string;
  diaChi: string;
  logo: string;
  anhCaNhan: string;
  soChungChi: string;
  mangXaHoi: {
    facebook?: string;
    youtube?: string;
    tiktok?: string;
  };
}

export const CATEGORIES = {
  'Nhà đất dân cư': ['Đất ở', 'Đất nông nghiệp', 'Nhà ở', 'Nhà kinh doanh'],
  'Nhà đất khu đô thị': ['An Viên', 'Phước Long', 'Phước Hải', 'Mỹ Gia', 'Mipeco', 'Vĩnh Hoà', 'Cồn Tân Lập', 'Ven sông Tắc', 'An Bình Tân', 'Hà Quang', 'CharmoraCity', 'Vin Pearl Bay', 'Khác'],
  'Căn hộ chung cư': ['Panorama', 'Goldcoast', 'D’qua', 'Sceniabay', 'HUD', 'NOXH', 'VCN', 'CharmoraCity', 'Khác'],
  'Khách sạn': ['Mini Hotel', 'Khách sạn sao', 'Homestay'],
  'Cho thuê BĐS': ['Căn hộ cho thuê', 'Nhà nguyên căn', 'Mặt bằng kinh doanh']
};

export const REGIONS = ['Nha Trang', 'Bắc Nha Trang', 'Nam Nha Trang', 'Tây Nha Trang', 'Cam Lâm', 'Ninh Hoà', 'Diên Khánh', 'Vân Phong', 'Cam Ranh'];
export const DIRECTIONS = ['Đông', 'Tây', 'Nam', 'Bắc', 'Đông Nam', 'Đông Bắc', 'Tây Nam', 'Tây Bắc'];
