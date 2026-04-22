import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { BấtĐộngSản } from '../types';

/**
 * SERVICE XỬ LÝ PHÂN TÁCH FILE (EXCEL/CSV)
 */

export interface ImportRow extends Partial<BấtĐộngSản> {
  isValid?: boolean;
  errors?: string[];
  isDuplicate?: boolean;
  imageCount?: number;
}

export const parseImportFile = (file: File): Promise<ImportRow[]> => {
  return new Promise((resolve, reject) => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          resolve(validateAndMapData(results.data as any[]));
        },
        error: (err) => reject(err)
      });
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        resolve(validateAndMapData(jsonData as any[]));
      };
      reader.onerror = (err) => reject(err);
      reader.readAsBinaryString(file);
    }
  });
};

const validateAndMapData = (data: any[]): ImportRow[] => {
  return data.map(row => {
    const errors: string[] = [];
    
    // Chuẩn hóa key (hỗ trợ cả tiếng Việt có dấu và không dấu từ file)
    const getVal = (keys: string[]) => {
      for (const k of keys) {
        if (row[k] !== undefined) return row[k];
      }
      return undefined;
    };

    const item: ImportRow = {
      maSanPham: getVal(['maSanPham', 'mã sản phẩm', 'Ma SP']),
      loaiCap1: getVal(['loaiCap1', 'loại cấp 1', 'Loai 1']) || 'Nhà đất dân cư',
      loaiCap2: getVal(['loaiCap2', 'loại cấp 2', 'Loai 2']) || 'Khác',
      tieuDe: getVal(['tieuDe', 'tiêu đề', 'Tieu de']),
      noiDung: getVal(['noiDung', 'mô tả', 'Noi dung']) || '',
      gia: parseFloat(getVal(['gia', 'giá', 'Gia']) || 0),
      dienTich: parseFloat(getVal(['dienTich', 'diện tích', 'Dien tich']) || 0),
      huong: getVal(['huong', 'hướng', 'Huong']) || 'Đông',
      khuVuc: getVal(['khuVuc', 'khu vực', 'Khu vuc']),
      diaChi: getVal(['diaChi', 'địa chỉ', 'Dia chi']) || '',
      phapLy: getVal(['phapLy', 'pháp lý', 'Phap ly']) || 'Sổ đỏ',
      trangThai: (getVal(['trangThai', 'trạng thái', 'Trang thai']) || 'Đang bán') as any,
      dacDiemNoiBat: String(getVal(['dacDiemNoiBat', 'đặc điểm', 'Dac diem']) || '').split(',').map(s => s.trim()).filter(Boolean),
      videoUrl: getVal(['videoUrl', 'video', 'Video']) || '',
      googleMap: getVal(['googleMap', 'bản đồ', 'Map']) || '',
      nguoiPhuTrach: getVal(['nguoiPhuTrach', 'người phụ trách', 'Chu tro']) || 'Lục Hà Giang',
      soDienThoai: getVal(['soDienThoai', 'số điện thoại', 'SĐT']) || '0888928628',
      danhSachAnh: String(getVal(['danhSachAnh', 'danh sách ảnh', 'Anh']) || '').split(',').map(s => s.trim()).filter(Boolean),
    };

    // Kiểm tra cột bắt buộc
    if (!item.maSanPham) errors.push("Thiếu mã sản phẩm");
    if (!item.loaiCap1) errors.push("Thiếu loại cấp 1");
    if (!item.tieuDe) errors.push("Thiếu tiêu đề");
    if (!item.gia || isNaN(item.gia)) errors.push("Giá không hợp lệ");
    if (!item.dienTich || isNaN(item.dienTich)) errors.push("Diện tích không hợp lệ");
    if (!item.khuVuc) errors.push("Thiếu khu vực");

    return {
      ...item,
      isValid: errors.length === 0,
      errors,
      imageCount: item.danhSachAnh?.length || 0
    };
  });
};

/**
 * QUY ƯỚC ĐẶT TÊN ẢNH: [maSanPham]-anyname.jpg
 * Ví dụ: BDS001-mattien.jpg, BDS001-phongkhach.png
 */
export const mapUploadedImagesToRows = (rows: ImportRow[], uploadedImages: {url: string, name: string}[]): ImportRow[] => {
  return rows.map(row => {
    if (!row.maSanPham) return row;
    
    // Tìm các ảnh có tiền tố là mã sản phẩm
    const matchedImages = uploadedImages
      .filter(img => img.name.startsWith(row.maSanPham!))
      .map(img => img.url);

    if (matchedImages.length > 0) {
      return {
        ...row,
        danhSachAnh: matchedImages, // Ghi đè bằng ảnh từ Storage nếu có
        imageCount: matchedImages.length
      };
    }
    return row;
  });
};
