import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { BấtĐộngSản, KháchHàng, CấuHìnhWeb, CATEGORIES, REGIONS, DIRECTIONS } from '../types';
import { 
  getAllBatDongSan, 
  addBatDongSan, 
  updateBatDongSan, 
  deleteBatDongSan, 
  getAllKhachHang, 
  deleteKhachHang, 
  importBatchBatDongSan,
  settingsService,
  fixLegacyData 
} from '../services/firebaseService';
import { 
  LogIn, LogOut, Plus, Trash2, Edit2, FileUp, Save, X, 
  Users, LayoutDashboard, Settings as SettingsIcon, CheckCircle, XCircle,
  Image as ImageIcon, Upload, Star, ChevronDown, ChevronUp, RefreshCw, Loader2, Sparkles
} from 'lucide-react';
import { DEFAULT_PROPERTY_IMAGE } from '../constants';
import Loading from '../components/Loading';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';

import ImportManager from '../components/ImportManager';

import { uploadImage, uploadMultipleImages } from '../services/storageService';
import { optimizeImage, formatBytes } from '../services/imageOptimizer';

/**
 * ADMIN PAGE: QUẢN TRỊ TOÀN BỘ HỆ THỐNG CHILLAND.VN
 */

export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState<BấtĐộngSản[]>([]);
  const [contacts, setContacts] = useState<KháchHàng[]>([]);
  const [settings, setSettings] = useState<CấuHìnhWeb | null>(null);
  const [activeTab, setActiveTab] = useState<'listings' | 'contacts' | 'settings' | 'import'>('listings');
  
  const [isAdding, setIsAdding] = useState(false);
  const [editListing, setEditListing] = useState<Partial<BấtĐộngSản> | null>(null);
  const [isFixingLegacy, setIsFixingLegacy] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // States for Image Upload System
  const [selectedImages, setSelectedImages] = useState<{
    id: string,
    file: File, 
    optimizedBlob?: Blob,
    preview: string, 
    progress: number, 
    status: 'idle' | 'uploading' | 'success' | 'error', 
    url?: string,
    originalSize: number,
    optimizedSize?: number
  }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showAdvancedImg, setShowAdvancedImg] = useState(false);

  const resetForm = () => {
    setEditListing({
      maSanPham: '',
      tieuDe: '',
      loaiCap1: '',
      loaiCap2: '',
      gia: 0,
      dienTich: 0,
      huong: '',
      khuVuc: '',
      diaChi: '',
      phapLy: 'Sổ đỏ',
      noiDung: '',
      danhSachAnh: [],
      anhDaiDien: '',
      trangThai: 'Đang bán'
    });
    setSelectedImages([]);
    setShowAdvancedImg(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u && u.email === 'gianglh.th@gmail.com') {
        loadData();
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadData = async () => {
    console.log("🔄 Bắt đầu tải dữ liệu hệ thống...");
    setLoading(true);
    try {
      const [l, c, s] = await Promise.all([
        getAllBatDongSan(),
        getAllKhachHang(),
        settingsService.get()
      ]);
      setListings(l);
      setContacts(c);
      setSettings(s);
      console.log("✅ Tải dữ liệu thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleFixLegacy = async () => {
    if (!window.confirm("Hệ thống sẽ duyệt tất cả sản phẩm cũ và gán ảnh mặc định nếu thiếu. Bạn có chắc chắn?")) return;
    
    setIsFixingLegacy(true);
    try {
      const count = await fixLegacyData();
      alert(`✅ Đã xử lý xong! Cập nhật ${count} sản phẩm cũ.`);
      loadData();
    } catch (error) {
      alert("❌ Lỗi dọn dẹp dữ liệu: " + error);
    } finally {
      setIsFixingLegacy(false);
    }
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    console.log(`📸 Đã chọn ${files.length} ảnh mới từ máy.`);

    const currentTotal = selectedImages.length + files.length;
    if (currentTotal > 30) {
      alert("⚠️ Tối đa 30 ảnh mỗi tin đăng!");
      return;
    }

    // Preview ngay lập tức - gắn ID để quản lý chính xác
    const newItems = files.map((file: File) => ({
      id: Math.random().toString(36).substring(7) + Date.now(),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: 'idle' as const,
      originalSize: file.size
    }));

    const startIndex = selectedImages.length;
    setSelectedImages(prev => [...prev, ...newItems]);

    // Nén ảnh ngầm sau khi đã hiện preview
    for (let i = 0; i < newItems.length; i++) {
       try {
          console.log(`🌀 Đang tối ưu ảnh: ${newItems[i].file.name}`);
          const optimized = await optimizeImage(newItems[i].file);
          if (optimized) {
            setSelectedImages(prev => {
              const updated = [...prev];
              const idx = startIndex + i;
              if (updated[idx]) {
                updated[idx].optimizedBlob = optimized.blob;
                updated[idx].optimizedSize = optimized.optimizedSize;
              }
              return updated;
            });
            console.log(`✅ Tối ưu xong: ${newItems[i].file.name} (${formatBytes(optimized.optimizedSize)})`);
          }
       } catch (err) {
          console.error(`❌ Lỗi tối ưu ảnh ${newItems[i].file.name}:`, err);
       }
    }
  };

  const handleUploadImages = async (): Promise<string[]> => {
    const toUpload = selectedImages.filter(img => img.status === 'idle' || img.status === 'error');
    const currentUser = auth.currentUser;
    console.log(`🔐 Kiểm tra quyền upload. User: ${currentUser?.email || 'N/A'}`);

    if (!currentUser) {
      const errorMsg = "❌ Bạn cần đăng nhập để tải ảnh";
      alert(errorMsg);
      throw new Error(errorMsg);
    }

    if (toUpload.length === 0) {
       const alreadyOk = selectedImages.filter(img => img.status === 'success' && img.url).map(img => img.url!);
       return alreadyOk;
    }

    setIsUploading(true);
    const uploadSingle = async (img: typeof selectedImages[0]) => {
      const dataToUpload = img.optimizedBlob || img.file;
      const fileName = img.file.name;
      
      setSelectedImages(prev => prev.map(item => 
        item.id === img.id ? { ...item, status: 'uploading', progress: 0 } : item
      ));

      try {
        const url = await uploadImage(dataToUpload, fileName, (progress) => {
          setSelectedImages(prev => prev.map(item => 
            item.id === img.id ? { ...item, progress: Math.round(progress) } : item
          ));
        });
        
        setSelectedImages(prev => prev.map(item => 
          item.id === img.id ? { ...item, status: 'success', url } : item
        ));
        
        return url;
      } catch (error) {
        setSelectedImages(prev => prev.map(item => 
          item.id === img.id ? { ...item, status: 'error' } : item
        ));
        throw error;
      }
    };

    try {
       const newUrls = await Promise.all(toUpload.map(img => uploadSingle(img)));
       const allUrls = [
         ...(editListing?.danhSachAnh || []),
         ...selectedImages.filter(img => img.status === 'success' && img.url).map(img => img.url!),
         ...newUrls
       ];
       const uniqueUrls = Array.from(new Set(allUrls));

       setEditListing(prev => {
         if (!prev) return null;
         return {
           ...prev,
           danhSachAnh: uniqueUrls,
           anhDaiDien: prev.anhDaiDien || uniqueUrls[0] || ''
         };
       });

       setIsUploading(false);
       return uniqueUrls;
    } catch (error) {
       setIsUploading(false);
       throw error;
    }
  };

  const removeSelectedImage = (id: string) => {
    setSelectedImages(prev => {
      const idx = prev.findIndex(img => img.id === id);
      if (idx !== -1) {
        URL.revokeObjectURL(prev[idx].preview);
        const updated = [...prev];
        updated.splice(idx, 1);
        return updated;
      }
      return prev;
    });
  };

  const removeExistingImage = (url: string) => {
    setEditListing(prev => {
      const newUrls = prev?.danhSachAnh?.filter(u => u !== url) || [];
      return {
        ...prev!,
        danhSachAnh: newUrls,
        anhDaiDien: prev?.anhDaiDien === url ? (newUrls[0] || '') : prev?.anhDaiDien || ''
      };
    });
  };

  const handleSaveListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editListing) return;
    
    if (!editListing.maSanPham || !editListing.tieuDe || !editListing.loaiCap1 || !editListing.khuVuc) {
       alert("⚠️ Vui lòng điền đầy đủ các thông tin bắt buộc (*)");
       return;
    }

    try {
      const pendingImages = selectedImages.filter(img => img.status === 'idle' || img.status === 'error');
      let finalUrls: string[] = [...(editListing.danhSachAnh || [])];

      if (pendingImages.length > 0) {
         finalUrls = await handleUploadImages();
      }

      const finalListing: Partial<BấtĐộngSản> = { 
        ...editListing,
        danhSachAnh: finalUrls,
        anhDaiDien: editListing.anhDaiDien || finalUrls[0] || ''
      };

      if (finalListing.id) {
        await updateBatDongSan(finalListing.id, finalListing);
      } else {
        await addBatDongSan(finalListing as BấtĐộngSản);
      }

      setIsAdding(false);
      resetForm();
      loadData();
      alert('✅ Đã lưu tin đăng thành công!');
    } catch (error) {
      alert('❌ Lỗi khi lưu: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const handleStatusToggle = async (listing: BấtĐộngSản) => {
    const nextStatus = listing.trangThai === 'Đang bán' ? 'Đã bán' : 'Đang bán';
    await updateBatDongSan(listing.id, { trangThai: nextStatus });
    loadData();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    await settingsService.update(settings);
    alert('Cập nhật cấu hình thành công!');
  };

  if (loading) return <Loading />;

  if (!user || user.email !== 'gianglh.th@gmail.com') {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-2xl shadow-2xl text-center flex flex-col items-center">
        <div className="w-20 h-20 bg-brand-paper rounded-full flex items-center justify-center mb-6">
          <SettingsIcon className="w-10 h-10 text-brand-forest" />
        </div>
        <h2 className="text-3xl font-serif text-brand-forest mb-2">Quản trị Chilland</h2>
        <p className="text-gray-400 mb-8">Vui lòng đăng nhập bằng email:<br/><span className="text-brand-gold font-bold">gianglh.th@gmail.com</span></p>
        <button 
          onClick={handleLogin}
          className="w-full bg-brand-forest text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-gold transition-all shadow-lg hover:shadow-brand-gold/20"
        >
          <LogIn className="w-6 h-6" /> Đăng nhập Google
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif text-brand-forest">Chào Quản trị viên</h1>
          <div className="flex items-center gap-2 mt-1">
             <p className="text-brand-gold font-medium italic">Hệ thống Chilland.vn đang vận hành ổn định</p>
             <span className="text-[10px] bg-brand-paper px-2 py-0.5 rounded-full text-brand-forest font-bold border border-brand-forest/10 flex items-center gap-1">
                <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                {user?.email}
             </span>
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          <button 
            disabled={isFixingLegacy}
            onClick={handleFixLegacy} 
            className="bg-brand-paper text-brand-forest px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-brand-gold hover:text-white transition-all disabled:opacity-50"
            title="Sửa lỗi thiếu ảnh cho các sản phẩm cũ"
          >
            {isFixingLegacy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} 
            Dọn dẹp dữ liệu
          </button>
          <button onClick={() => { resetForm(); setIsAdding(true); }} className="luxury-gradient text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl hover:scale-105 transition-all">
            <Plus className="w-5 h-5" /> Đăng tin mới
          </button>
          <button onClick={() => signOut(auth)} className="bg-red-50 text-red-500 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-md">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-10 mb-8 border-b-2 border-brand-paper">
         {[
           { id: 'listings', label: 'BẤT ĐỘNG SẢN', icon: LayoutDashboard, count: listings.length },
           { id: 'contacts', label: 'KHÁCH HÀNG (LEADS)', icon: Users, count: contacts.length },
           { id: 'import', label: 'IMPORT DỮ LIỆU', icon: FileUp, count: null },
           { id: 'settings', label: 'CẤU HÌNH WEB', icon: SettingsIcon, count: null }
         ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id as any)}
             className={`pb-4 px-2 text-xs font-black tracking-widest flex items-center gap-2 transition-all relative ${activeTab === tab.id ? 'text-brand-forest' : 'text-gray-400 hover:text-gray-600'}`}
           >
             <tab.icon className="w-4 h-4" /> 
             {tab.label} {tab.count !== null && <span className="bg-brand-paper text-brand-forest px-2 py-0.5 rounded-full text-[10px]">{tab.count}</span>}
             {activeTab === tab.id && <motion.div layoutId="activeTab" className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-brand-forest" />}
           </button>
         ))}
      </div>

      {activeTab === 'import' && (
        <ImportManager onComplete={loadData} />
      )}

      {activeTab === 'listings' && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-brand-paper/50 text-gray-500 text-[10px] uppercase font-black">
                 <tr>
                   <th className="px-8 py-5">SẢN PHẨM</th>
                   <th className="px-8 py-5">DANH MỤC</th>
                   <th className="px-8 py-5">GIÁ & DIỆN TÍCH</th>
                   <th className="px-8 py-5">TRẠNG THÁI</th>
                   <th className="px-8 py-5 text-center">THAO TÁC</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {listings.map(item => {
                    return (
                      <tr key={item.id} className="hover:bg-brand-paper/20 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex gap-5 items-center">
                            <img 
                              src={item.imageUrl || DEFAULT_PROPERTY_IMAGE} 
                              className="w-16 h-16 object-cover rounded-2xl shadow-inner group-hover:scale-110 transition-all" 
                              referrerPolicy="no-referrer" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = DEFAULT_PROPERTY_IMAGE;
                              }}
                            />
                            <div>
                               <p className="font-bold text-gray-800 line-clamp-1">{item.tieuDe}</p>
                               <p className="text-[10px] text-gray-400 font-mono">Mã: {item.maSanPham}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className="text-[10px] bg-white border border-brand-forest/20 px-2 py-1 rounded-md text-brand-forest font-bold">{item.loaiCap1}</span>
                           <p className="text-xs text-gray-500 mt-1.5 italic opacity-70">➔ {item.loaiCap2}</p>
                        </td>
                        <td className="px-8 py-6">
                           <p className="font-black text-brand-gold text-lg">{item.gia >= 1000 ? (item.gia/1000).toFixed(1) + ' tỷ' : item.gia + ' triệu'}</p>
                           <p className="text-xs text-brand-forest font-semibold uppercase">{item.dienTich} m² • {item.huong}</p>
                        </td>
                        <td className="px-8 py-6">
                           <button onClick={() => handleStatusToggle(item)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition-all ${item.trangThai === 'Đang bán' ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white' : 'bg-brand-paper text-gray-400 hover:bg-brand-gold hover:text-white'}`}>
                              {item.trangThai === 'Đang bán' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {item.trangThai}
                           </button>
                        </td>
                        <td className="px-8 py-6 text-center">
                           <div className="flex justify-center gap-2">
                              <button onClick={() => {setEditListing(item); setIsAdding(true);}} className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all shadow-sm"><Edit2 className="w-4 h-4" /></button>
                              <button onClick={() => deleteBatDongSan(item.id!).then(loadData)} className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
                           </div>
                        </td>
                      </tr>
                    );
                  })}
               </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'contacts' && (
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-brand-paper/50 text-gray-500 text-[10px] uppercase font-black">
                 <tr>
                   <th className="px-8 py-5">KHÁCH HÀNG</th>
                   <th className="px-8 py-5">LIÊN HỆ</th>
                   <th className="px-8 py-5">NHU CẦU / SẢN PHẨM</th>
                   <th className="px-8 py-5 text-center">THAO TÁC</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                  {contacts.map(contact => (
                    <tr key={contact.id} className="hover:bg-brand-paper/20 transition-all">
                      <td className="px-8 py-6">
                        <p className="font-bold text-gray-800">{contact.hoTen}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-tighter">{new Date(contact.createdAt?.toDate()).toLocaleString('vi-VN')}</p>
                      </td>
                      <td className="px-8 py-6">
                         <a href={`tel:${contact.soDienThoai}`} className="bg-brand-paper text-brand-forest px-4 py-2 rounded-xl font-black text-sm hover:bg-brand-gold hover:text-white transition-all inline-block">
                           {contact.soDienThoai}
                         </a>
                      </td>
                      <td className="px-8 py-6">
                         <p className="text-sm font-medium text-gray-600 line-clamp-2 italic mb-2">"{contact.nhuCau || 'Cần tư vấn bất động sản'}"</p>
                         {contact.sanPhamQuanTam && (
                           <Link to={`/san-pham/${contact.sanPhamQuanTam}`} className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase hover:underline">Sản phẩm: {contact.sanPhamQuanTam}</Link>
                         )}
                      </td>
                      <td className="px-8 py-6 text-center">
                         <button onClick={() => deleteKhachHang(contact.id!).then(loadData)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="w-5 h-5" /></button>
                      </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="max-w-4xl bg-white p-10 rounded-3xl shadow-xl border border-gray-100">
           <form onSubmit={handleSaveSettings} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Tên Website & Slogan</label>
                    <input value={settings?.tenWebsite || ''} onChange={e => setSettings({...settings!, tenWebsite: e.target.value})} className="w-full p-4 bg-brand-paper/30 border-0 rounded-2xl focus:ring-2 focus:ring-brand-forest font-bold" placeholder="Chilland.vn" />
                    <input value={settings?.slogan || ''} onChange={e => setSettings({...settings!, slogan: e.target.value})} className="w-full p-4 bg-brand-paper/30 border-0 rounded-2xl focus:ring-2 focus:ring-brand-forest italic" placeholder="Giá trị tích luỹ niềm tin" />
                 </div>
                 <div className="space-y-4">
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Liên hệ (Hotline & Zalo)</label>
                    <input value={settings?.hotline || ''} onChange={e => setSettings({...settings!, hotline: e.target.value})} className="w-full p-4 bg-brand-paper/30 border-0 rounded-2xl focus:ring-2 focus:ring-brand-forest font-bold" placeholder="0888.928.628" />
                    <input value={settings?.zalo || ''} onChange={e => setSettings({...settings!, zalo: e.target.value})} className="w-full p-4 bg-brand-paper/30 border-0 rounded-2xl focus:ring-2 focus:ring-brand-forest font-bold" placeholder="0888928628" />
                 </div>
              </div>
              <div className="space-y-4">
                 <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Ảnh cá nhân (Môi giới)</label>
                 <input value={settings?.anhCaNhan || ''} onChange={e => setSettings({...settings!, anhCaNhan: e.target.value})} className="w-full p-4 bg-brand-paper/30 border-0 rounded-2xl focus:ring-2 focus:ring-brand-forest" placeholder="URL ảnh cá nhân..." />
                 <input value={settings?.soChungChi || ''} onChange={e => setSettings({...settings!, soChungChi: e.target.value})} className="w-full p-4 bg-brand-paper/30 border-0 rounded-2xl focus:ring-2 focus:ring-brand-forest" placeholder="Số chứng chỉ nghề..." />
              </div>
              <button type="submit" className="luxury-gradient text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all flex items-center gap-2">
                 <Save className="w-5 h-5" /> LƯU CẤU HÌNH WEB
              </button>
           </form>
        </div>
      )}

      {/* Modal Thêm/Sửa */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-forest/60 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }} className="bg-white w-full max-w-6xl h-[95vh] overflow-y-auto rounded-[40px] shadow-2xl p-8 md:p-12">
               <div className="flex justify-between items-center mb-12 border-b border-gray-50 pb-8">
                  <div>
                    <h2 className="text-4xl font-serif text-brand-forest">{editListing?.id ? 'Chỉnh Sửa Tin Đăng' : 'Đăng Tin Bất Động Sản'}</h2>
                    <p className="text-brand-gold font-medium mt-1 italic">Vui lòng điền đầy đủ các thông tin bắt buộc (*)</p>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={resetForm} className="p-4 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 transition-all"><RefreshCw className="w-6 h-6" /></button>
                    <button onClick={() => { setIsAdding(false); setSelectedImages([]); }} className="p-4 bg-red-50 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/10"><X className="w-6 h-6" /></button>
                  </div>
               </div>
               
               <form onSubmit={handleSaveListing} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-7 space-y-10">
                    <div className="space-y-6">
                      <h3 className="text-xs font-black text-brand-gold uppercase tracking-[0.2em] border-l-4 border-brand-gold pl-4">1. Thông tin cơ bản</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required value={editListing?.maSanPham || ''} onChange={e => setEditListing({...editListing!, maSanPham: e.target.value})} placeholder="Mã sản phẩm * (VD: NT-001)" className="w-full p-5 bg-gray-50 border-0 rounded-3xl font-bold focus:ring-2 focus:ring-brand-gold transition-all" />
                        <select required value={editListing?.trangThai || 'Đang bán'} onChange={e => setEditListing({...editListing!, trangThai: e.target.value as any})} className="w-full p-5 bg-gray-50 border-0 rounded-3xl font-black text-sm uppercase outline-none focus:ring-2 focus:ring-brand-gold transition-all">
                           <option value="Đang bán">🟢 Đang giao dịch</option>
                           <option value="Đã bán">🔴 Đã chốt / Đã bán</option>
                           <option value="Ngừng giao dịch">⚪ Ngừng giao dịch</option>
                        </select>
                      </div>
                      <input required value={editListing?.tieuDe || ''} onChange={e => setEditListing({...editListing!, tieuDe: e.target.value})} placeholder="Tiêu đề thu hút khách hàng * (VD: Siêu phẩm mặt tiền...)" className="w-full p-5 bg-gray-50 border-0 rounded-3xl font-black text-xl placeholder:font-medium focus:ring-2 focus:ring-brand-gold transition-all" />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <select required value={editListing?.loaiCap1 || ''} onChange={e => setEditListing({...editListing!, loaiCap1: e.target.value})} className="w-full p-5 bg-gray-50 border-0 rounded-3xl outline-none font-bold focus:ring-2 focus:ring-brand-gold transition-all">
                           <option value="">Loại cấp 1 *</option>
                           {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select required value={editListing?.loaiCap2 || ''} onChange={e => setEditListing({...editListing!, loaiCap2: e.target.value})} className="w-full p-5 bg-gray-50 border-0 rounded-3xl outline-none font-bold focus:ring-2 focus:ring-brand-gold transition-all">
                           <option value="">Loại cấp 2 *</option>
                           {editListing?.loaiCap1 && (CATEGORIES as any)[editListing.loaiCap1].map((sc:string) => <option key={sc} value={sc}>{sc}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xs font-black text-brand-gold uppercase tracking-[0.2em] border-l-4 border-brand-gold pl-4">2. Thông số kỹ thuật & Vị trí</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Giá niêm yết (Triệu/Tỷ)</label>
                          <input type="number" required value={editListing?.gia || ''} onChange={e => setEditListing({...editListing!, gia: parseFloat(e.target.value)})} placeholder="VD: 3500 (là 3.5 Tỷ)" className="w-full p-5 bg-gray-50 border-0 rounded-3xl font-black text-brand-forest focus:ring-2 focus:ring-brand-gold transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Diện tích (M²)</label>
                          <input type="number" required value={editListing?.dienTich || ''} onChange={e => setEditListing({...editListing!, dienTich: parseFloat(e.target.value)})} placeholder="VD: 120" className="w-full p-5 bg-gray-50 border-0 rounded-3xl font-black text-brand-forest focus:ring-2 focus:ring-brand-gold transition-all" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <select value={editListing?.huong || ''} onChange={e => setEditListing({...editListing!, huong: e.target.value})} className="p-5 bg-gray-50 border-0 rounded-3xl font-bold focus:ring-2 focus:ring-brand-gold transition-all">
                           <option value="">Hướng</option>
                           {DIRECTIONS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select required value={editListing?.khuVuc || ''} onChange={e => setEditListing({...editListing!, khuVuc: e.target.value})} className="p-5 bg-gray-50 border-0 rounded-3xl font-bold focus:ring-2 focus:ring-brand-gold transition-all">
                           <option value="">Khu vực *</option>
                           {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>

                      <input value={editListing?.diaChi || ''} onChange={e => setEditListing({...editListing!, diaChi: e.target.value})} placeholder="Địa chỉ chi tiết (Không bắt buộc)..." className="w-full p-5 bg-gray-50 border-0 rounded-3xl focus:ring-2 focus:ring-brand-gold transition-all" />
                      <input value={editListing?.phapLy || 'Sổ đỏ'} onChange={e => setEditListing({...editListing!, phapLy: e.target.value})} placeholder="Tình trạng pháp lý (VD: Sổ hồng riêng)" className="w-full p-5 bg-gray-50 border-0 rounded-3xl focus:ring-2 focus:ring-brand-gold transition-all" />
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-xs font-black text-brand-gold uppercase tracking-[0.2em] border-l-4 border-brand-gold pl-4">3. Mô tả & Liên hệ</h3>
                      <textarea required value={editListing?.noiDung || ''} onChange={e => setEditListing({...editListing!, noiDung: e.target.value})} placeholder="Viết mô tả chi tiết về sản phẩm này để thu hút khách hàng..." className="w-full p-6 bg-gray-50 border-0 rounded-[32px] h-48 focus:ring-2 focus:ring-brand-gold transition-all leading-relaxed" />
                      
                      <div className="grid grid-cols-2 gap-4">
                         <input value={editListing?.nguoiPhuTrach || 'Lục Hà Giang'} onChange={e => setEditListing({...editListing!, nguoiPhuTrach: e.target.value})} placeholder="Người phụ trách" className="w-full p-5 bg-gray-50 border-0 rounded-3xl font-bold" />
                         <input value={editListing?.soDienThoai || '0888928628'} onChange={e => setEditListing({...editListing!, soDienThoai: e.target.value})} placeholder="Số điện thoại" className="w-full p-5 bg-gray-50 border-0 rounded-3xl font-bold" />
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-6 flex flex-col h-full">
                    <div className="bg-brand-paper/40 p-4 rounded-3xl flex flex-wrap items-center justify-between gap-4 text-[10px] font-black uppercase tracking-widest text-brand-forest/60 border border-brand-paper">
                       <div className="flex items-center gap-2">
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Đã chọn: <span className="text-brand-forest">{selectedImages.length}</span></span>
                       </div>
                       <div className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Thành công: <span className="text-emerald-500">{selectedImages.filter(img => img.status === 'success').length}</span></span>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h3 className="text-xs font-black text-brand-gold uppercase tracking-[0.2em] border-l-4 border-brand-gold pl-4">4. Thư viện hình ảnh</h3>
                       <div 
                          className="py-8 border-2 border-dashed border-gray-200 rounded-[32px] bg-gray-50/50 flex flex-col items-center justify-center space-y-2 hover:border-brand-gold transition-all group cursor-pointer" 
                          onClick={() => document.getElementById('listing-imgs')?.click()}
                       >
                          <input type="file" id="listing-imgs" multiple accept="image/*" onChange={handleImageSelect} className="hidden" />
                          <Upload className="w-6 h-6 text-gray-400 group-hover:text-brand-gold group-hover:scale-110 transition-all" />
                          <p className="text-[10px] font-black text-gray-400 group-hover:text-brand-forest uppercase tracking-tighter">Click để chọn nhiều ảnh</p>
                       </div>

                       <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-3 gap-2 max-h-[360px] overflow-y-auto pr-2 custom-scrollbar border border-gray-100 rounded-2xl p-2 bg-gray-50/20">
                          {selectedImages.map((img) => (
                            <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100 bg-gray-200 shadow-sm transition-all hover:ring-2 hover:ring-brand-gold">
                              <img src={img.preview} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-between p-1.5 pt-1">
                                 <div className="flex justify-between items-start">
                                    <button type="button" onClick={() => removeSelectedImage(img.id)} className="p-1 bg-red-500 text-white rounded-md hover:scale-110 transition-all">
                                       <Trash2 className="w-3 h-3" />
                                    </button>
                                    <button 
                                       type="button" 
                                       onClick={() => setEditListing({...editListing!, anhDaiDien: img.url || ''})} 
                                       className={`p-1 rounded-md transition-all ${editListing?.anhDaiDien === img.url ? 'bg-brand-gold text-white' : 'bg-white/20 text-white hover:bg-brand-gold'}`}
                                    >
                                       <Star className="w-3 h-3" fill={editListing?.anhDaiDien === img.url ? "currentColor" : "none"} />
                                    </button>
                                 </div>
                              </div>
                              {img.status === 'uploading' && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-2">
                                  <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                                     <div className="h-full bg-brand-gold transition-all" style={{ width: `${img.progress}%` }}></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}

                          {editListing?.danhSachAnh?.map((url, idx) => (
                            <div key={`old-${idx}`} className={`relative aspect-square rounded-xl overflow-hidden group border-2 ${editListing.anhDaiDien === url ? 'border-brand-gold' : 'border-gray-100 shadow-sm'}`}>
                               <img src={url} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                                  <button type="button" onClick={() => removeExistingImage(url)} className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all">
                                     <Trash2 className="w-4 h-4" />
                                  </button>
                                  <button type="button" onClick={() => setEditListing({...editListing!, anhDaiDien: url})} className="p-1.5 bg-brand-gold text-white rounded-lg hover:scale-110 transition-all">
                                     <Star className="w-4 h-4" fill={editListing.anhDaiDien === url ? "currentColor" : "none" } />
                                  </button>
                               </div>
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                       <button type="button" onClick={() => setShowAdvancedImg(!showAdvancedImg)} className="text-[10px] font-black text-gray-400 hover:text-brand-gold flex items-center gap-2 uppercase tracking-widest transition-all">
                          {showAdvancedImg ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />} Nhập URL thủ công
                       </button>
                       {showAdvancedImg && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4">
                             <textarea 
                                value={editListing?.danhSachAnh?.join('\n') || ''}
                                onChange={e => setEditListing({...editListing!, danhSachAnh: e.target.value.split('\n').filter(Boolean)})}
                                placeholder="Dán mỗi link ảnh một dòng..."
                                className="w-full p-4 bg-gray-50 border-0 rounded-2xl h-32 text-xs font-mono focus:ring-1 focus:ring-brand-gold"
                             />
                          </motion.div>
                       )}
                    </div>

                    <div className="mt-auto pt-8 flex gap-4">
                       <button 
                          type="button" 
                          onClick={handleUploadImages} 
                          disabled={isUploading || selectedImages.filter(img => img.status === 'idle' || img.status === 'error').length === 0}
                          className="flex-1 bg-white border-2 border-brand-paper text-brand-forest py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-paper transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                       >
                          {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-brand-gold" /> : <Upload className="w-4 h-4" />}
                          Tải ảnh mới
                       </button>
                       <button 
                          type="submit" 
                          disabled={isUploading}
                          className="flex-[2] luxury-gradient text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:grayscale disabled:opacity-50 flex items-center justify-center gap-2"
                       >
                          {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} LƯU TIN ĐĂNG
                       </button>
                    </div>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
