import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BấtĐộngSản, KháchHàng, CấuHìnhWeb } from '../types';
import { DEFAULT_PROPERTY_IMAGE } from '../constants';

/**
 * HÀM CHUẨN HOÁ DỮ LIỆU SẢN PHẨM (Client-side)
 */
export const normalizeListing = (item: any): BấtĐộngSản => {
  const listing = { ...item };
  
  // Kiểm tra nếu không có ảnh
  if (!listing.anhDaiDien && (!listing.danhSachAnh || listing.danhSachAnh.length === 0)) {
    listing.imageUrl = DEFAULT_PROPERTY_IMAGE; // Hoặc NO_IMAGE_URL
  } else {
    listing.imageUrl = listing.anhDaiDien || listing.danhSachAnh[0];
  }

  // Đảm bảo các mảng luôn tồn tại
  if (!listing.danhSachAnh) listing.danhSachAnh = [];
  if (!listing.anhDaiDien) listing.anhDaiDien = listing.imageUrl === DEFAULT_PROPERTY_IMAGE ? '' : listing.imageUrl;

  return listing as BấtĐộngSản;
};

/**
 * FILE CHỨA CÁC HÀM CRUD (THÊM, SỬA, XOÁ, LẤY DỮ LIỆU)
 */

/**
 * HÀM CRUD BẤT ĐỘNG SẢN - DỮ LIỆU THẬT FIRESTORE
 */

// Lấy toàn bộ danh sách
export const getAllBatDongSan = async () => {
  console.log("🔥 Fetching all products...");
  const q = query(collection(db, 'batdongsan'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  const data = snapshot.docs.map(d => normalizeListing({ id: d.id, ...d.data() }));
  console.log(`✅ Loaded ${data.length} items.`);
  return data;
};

// Lấy chi tiết theo ID
export const getBatDongSanById = async (id: string) => {
  console.log(`🔍 Fetching product ID: ${id}`);
  const docRef = doc(db, 'batdongsan', id);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return normalizeListing({ id: snap.id, ...snap.data() });
  }
  console.warn("⚠️ Product not found!");
  return null;
};

// Lấy theo mã sản phẩm (Dùng cho check trùng/import)
export const getBatDongSanByMa = async (ma: string) => {
  const q = query(collection(db, 'batdongsan'), where('maSanPham', '==', ma));
  const snap = await getDocs(q);
  if (!snap.empty) {
    return { id: snap.docs[0].id, ...snap.docs[0].data() } as BấtĐộngSản;
  }
  return null;
};

// Thêm sản phẩm mới
export const addBatDongSan = async (data: Partial<BấtĐộngSản>) => {
  console.log("💾 Adding new product:", data.maSanPham);
  return await addDoc(collection(db, 'batdongsan'), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    trangThai: data.trangThai || 'Đang bán'
  });
};

// Cập nhật sản phẩm
export const updateBatDongSan = async (idOrMa: string, data: Partial<BấtĐộngSản>) => {
  let finalId = idOrMa;
  
  // Kiểm tra xem đây có phải là Mã SP không (không phải UUID thường thấy của Firestore)
  // Nếu không tìm thấy ID khớp, thử tìm theo maSanPham
  const docRefTry = doc(db, 'batdongsan', idOrMa);
  const snapTry = await getDoc(docRefTry);
  
  if (!snapTry.exists()) {
    const byMa = await getBatDongSanByMa(idOrMa);
    if (byMa) finalId = byMa.id!;
  }

  console.log(`Updating product ID: ${finalId}`);
  const docRef = doc(db, 'batdongsan', finalId);
  return await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};

// Xoá sản phẩm
export const deleteBatDongSan = async (id: string) => {
  console.log(`🗑 Deleting product ID: ${id}`);
  return await deleteDoc(doc(db, 'batdongsan', id));
};

// Lấy tin nổi bật
export const getFeaturedBatDongSan = async (count = 6) => {
  const q = query(
    collection(db, 'batdongsan'), 
    where('trangThai', '==', 'Đang bán'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => normalizeListing({ id: d.id, ...d.data() })).slice(0, count);
};

// Lấy sản phẩm theo danh mục
export const getBatDongSanByCategory = async (category: string, count = 10) => {
  console.log(`🔥 Fetching category: ${category}`);
  const q = query(
    collection(db, 'batdongsan'),
    where('loaiCap1', '==', category),
    where('trangThai', '==', 'Đang bán'),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => normalizeListing({ id: d.id, ...d.data() })).slice(0, count);
};

// Import hàng loạt
export const importBatchBatDongSan = async (items: any[]) => {
  console.log(`📦 Batch importing ${items.length} items...`);
  const batch = writeBatch(db);
  items.forEach((item) => {
    const newDocRef = doc(collection(db, 'batdongsan'));
    batch.set(newDocRef, {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
  });
  return await batch.commit();
};

// --- QUẢN LÝ KHÁCH HÀNG ---
export const addKhachHang = async (data: Partial<KháchHàng>) => {
  console.log("📩 Saving new lead:", data.hoTen);
  return await addDoc(collection(db, 'khachhang'), {
    ...data,
    createdAt: serverTimestamp()
  });
};

export const getAllKhachHang = async () => {
  const q = query(collection(db, 'khachhang'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as KháchHàng));
};

export const deleteKhachHang = async (id: string) => {
  return await deleteDoc(doc(db, 'khachhang', id));
};

// --- QUẢN LÝ CẤU HÌNH WEB ---
export const settingsService = {
  get: async () => {
    const docRef = doc(db, 'cauhinhweb', 'main');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as CấuHìnhWeb;
    }
    return null;
  },
  update: async (data: Partial<CấuHìnhWeb>) => {
    const docRef = doc(db, 'cauhinhweb', 'main');
    // Dùng set với merge để tạo nếu chưa có
    const snap = await getDoc(docRef);
    if (!snap.exists()) {
       // @ts-ignore
       await addDoc(collection(db, 'cauhinhweb'), { ...data }, { id: 'main' }); // Simplified for demo
    }
    return await updateDoc(docRef, data);
  }
};

/**
 * HÀM DỌN DẸP DỮ LIỆU CŨ (Maintanance)
 */
export const fixLegacyData = async () => {
  const { NO_IMAGE_URL } = await import('../constants');
  console.log("🧹 Bắt đầu dọn dẹp dữ liệu cũ...");
  const q = query(collection(db, 'batdongsan'));
  const snap = await getDocs(q);
  
  let count = 0;
  const batch = writeBatch(db);
  
  snap.docs.forEach(d => {
    const data = d.data();
    let needsUpdate = false;
    const updatePayload: any = {};
    
    // Nếu không có anhDaiDien hoặc danhSachAnh rỗng
    if (!data.anhDaiDien && (!data.danhSachAnh || data.danhSachAnh.length === 0)) {
      updatePayload.anhDaiDien = NO_IMAGE_URL;
      updatePayload.danhSachAnh = [];
      needsUpdate = true;
    } else if (!data.danhSachAnh) {
      updatePayload.danhSachAnh = [];
      needsUpdate = true;
    }
    
    if (needsUpdate) {
      batch.update(d.ref, updatePayload);
      count++;
    }
  });
  
  if (count > 0) {
    await batch.commit();
    console.log(`✅ Đã cập nhật ${count} sản phẩm cũ.`);
  } else {
    console.log("ℹ️ Không có dữ liệu cần dọn dẹp.");
  }
  
  return count;
};
