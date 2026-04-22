import React, { useState, useRef } from 'react';
import { 
  FileUp, CheckCircle, XCircle, 
  Loader2, Play, Trash2, Download, Eye
} from 'lucide-react';
import { parseImportFile, ImportRow } from '../services/importService';
import { addBatDongSan, updateBatDongSan, getAllBatDongSan } from '../services/firebaseService';
import { motion, AnimatePresence } from 'motion/react';

/**
 * COMPONENT QUẢN LÝ IMPORT DỮ LIỆU CHUẨN
 * Flow: Chọn file -> Đọc dữ liệu -> Preview -> Import -> Kết quả
 */

export default function ImportManager({ onComplete }: { onComplete: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importStatus, setImportStatus] = useState<{success: number, error: number, logs: string[]}>({
    success: 0,
    error: 0,
    logs: []
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setRows([]); // Xoá preview cũ
      setImportStatus({ success: 0, error: 0, logs: [] }); // Xoá log cũ
    }
  };

  const readData = async () => {
    if (!selectedFile) return;
    setIsParsing(true);
    try {
      const parsedRows = await parseImportFile(selectedFile);
      const existing = await getAllBatDongSan();
      // Đánh dấu trùng lặp dựa trên mã sản phẩm
      const finalRows = parsedRows.map(row => ({
        ...row,
        isDuplicate: existing.some(ex => ex.maSanPham === row.maSanPham)
      }));
      setRows(finalRows);
    } catch (err) {
      alert("⚠️ Lỗi đọc file: " + err);
    } finally {
      setIsParsing(false);
    }
  };

  const startImport = async () => {
    if (rows.length === 0) return;
    setIsImporting(true);
    setProgress(0);
    let successCount = 0;
    let errorCount = 0;
    const newLogs: string[] = ["🚀 Bắt đầu quá trình import dữ liệu..."];

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (!row.isValid) {
            errorCount++;
            newLogs.push(`❌ Dòng ${i + 1}: Bỏ qua do dữ liệu không hợp lệ (${row.errors?.join(', ')})`);
            continue;
        }

        try {
            if (row.isDuplicate) {
                // Cập nhật nếu trùng mã
                await updateBatDongSan(row.maSanPham!, { 
                  ...row as any, 
                  updatedAt: new Date() 
                });
                newLogs.push(`✅ Cập nhật thành công: ${row.maSanPham}`);
            } else {
                // Thêm mới
                await addBatDongSan({
                    ...row as any,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                newLogs.push(`✅ Thêm mới thành công: ${row.maSanPham}`);
            }
            successCount++;
        } catch (err: any) {
            errorCount++;
            newLogs.push(`❌ Lỗi hệ thống khi xử lý ${row.maSanPham}: ${err.message}`);
        }
        
        setProgress(Math.round(((i + 1) / rows.length) * 100));
        setImportStatus({ success: successCount, error: errorCount, logs: [...newLogs] });
    }

    setIsImporting(false);
    alert(`🎉 Import hoàn tất!\nThành công: ${successCount}\nLỗi: ${errorCount}`);
    onComplete();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setRows([]);
    setImportStatus({ success: 0, error: 0, logs: [] });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadTemplate = () => {
    const headers = "maSanPham,loaiCap1,loaiCap2,tieuDe,noiDung,gia,dienTich,huong,khuVuc,diaChi,phapLy,trangThai\n";
    const sample = "BDS001,Nhà đất dân cư,Đất nền,Lô đất đẹp mặt tiền,Mô tả lô đất...,3500,120,Đông,Nha Trang,Trần Phú,Sổ đỏ,Đang bán\n";
    const blob = new Blob(["\uFEFF" + headers + sample], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "mau_import_chilland.csv");
    link.click();
  };

  return (
    <div className="space-y-6 bg-white p-6 md:p-10 rounded-[40px] border border-gray-100 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 pb-6">
        <div>
          <h2 className="text-3xl font-serif text-brand-forest">Import Dữ Liệu Hàng Loạt</h2>
          <p className="text-gray-400 text-sm mt-1">Hỗ trợ định dạng .CSV và .XLSX (Excel)</p>
        </div>
        <button onClick={downloadTemplate} className="flex items-center gap-2 text-xs font-black text-brand-gold bg-brand-paper/30 px-4 py-2 rounded-full hover:bg-brand-paper transition-all">
          <Download className="w-4 h-4" /> TẢI FILE MẪU CHUẨN
        </button>
      </div>

      {/* Step 1: File Selection & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 p-10 border-2 border-dashed rounded-[32px] flex flex-col items-center justify-center transition-all ${selectedFile ? 'border-brand-gold bg-brand-paper/20' : 'border-gray-200 bg-gray-50'}`}>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept=".csv, .xlsx, .xls" />
          <FileUp className={`w-14 h-14 mb-4 ${selectedFile ? 'text-brand-gold' : 'text-gray-300'}`} />
          {selectedFile ? (
            <div className="text-center">
              <p className="font-black text-brand-forest text-lg">{selectedFile.name}</p>
              <p className="text-xs text-gray-400 font-medium">Dung lượng: {(selectedFile.size / 1024).toFixed(1)} KB</p>
              <button onClick={removeFile} className="mt-4 text-red-500 font-bold text-xs flex items-center gap-2 hover:underline mx-auto">
                <Trash2 className="w-3 h-3" /> XÓA FILE NÀY
              </button>
            </div>
          ) : (
            <button onClick={() => fileInputRef.current?.click()} className="px-8 py-3 bg-white border border-gray-200 rounded-2xl font-black text-sm shadow-sm hover:border-brand-gold transition-all text-brand-forest">
              CHỌN FILE DỮ LIỆU
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-2">Thao tác dữ liệu</label>
          <button 
            disabled={!selectedFile || isParsing || isImporting}
            onClick={readData}
            className="flex items-center justify-center gap-3 py-5 bg-brand-forest text-white rounded-[24px] font-black text-sm hover:bg-brand-ink disabled:opacity-30 transition-all shadow-xl shadow-brand-forest/10"
          >
            {isParsing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Eye className="w-5 h-5" />}
            1. ĐỌC DỮ LIỆU FILE
          </button>
          
          <button 
            disabled={rows.length === 0 || isImporting}
            onClick={startImport}
            className="flex items-center justify-center gap-3 py-5 bg-brand-gold text-white rounded-[24px] font-black text-sm hover:scale-[1.02] disabled:opacity-30 transition-all shadow-xl shadow-brand-gold/20"
          >
            {isImporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            2. BẮT ĐẦU IMPORT ({rows.filter(r => r.isValid).length} TIN)
          </button>

          <p className="text-[10px] text-gray-400 italic text-center px-4 mt-2">
            * Lưu ý: Hệ thống sẽ tự động cập nhật sản phẩm nếu trùng Mã SP.
          </p>
        </div>
      </div>

      {/* Progress Section */}
      {isImporting && (
        <div className="bg-brand-paper/30 p-6 rounded-3xl space-y-3">
           <div className="flex justify-between text-[11px] font-black uppercase text-brand-forest">
              <span>Đang đồng bộ với cơ sở dữ liệu...</span>
              <span>{progress}%</span>
           </div>
           <div className="w-full h-3 bg-white rounded-full overflow-hidden border border-brand-paper">
              <motion.div 
                initial={{ width: 0 }} 
                animate={{ width: `${progress}%` }} 
                className="h-full luxury-gradient"
              ></motion.div>
           </div>
        </div>
      )}

      {/* Preview Table Section */}
      <AnimatePresence>
        {rows.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
               <h3 className="text-xl font-serif text-brand-forest">Bản xem trước dữ liệu</h3>
               <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 border border-emerald-100">
                  <CheckCircle className="w-3 h-3" /> Đã phân tích {rows.length} sản phẩm
               </div>
            </div>
            
            <div className="border border-gray-100 rounded-[32px] overflow-hidden shadow-2xl bg-white">
              <div className="overflow-x-auto max-h-[500px]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-brand-paper/50 sticky top-0 z-10 font-black uppercase text-gray-500 tracking-wider">
                    <tr>
                      <th className="px-8 py-5">Mã SP</th>
                      <th className="px-8 py-5">Tiêu đề - Mô tả</th>
                      <th className="px-8 py-5">Giá trị</th>
                      <th className="px-8 py-5">Hợp lệ?</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-brand-forest">
                    {rows.map((row, idx) => (
                      <tr key={idx} className={!row.isValid ? 'bg-red-50/50' : 'hover:bg-brand-paper/10 transition-colors'}>
                        <td className="px-8 py-5">
                           <p className="font-black text-sm">{row.maSanPham || '?'}</p>
                           {row.isDuplicate && <span className="text-[9px] font-bold text-brand-gold uppercase block mt-1 tracking-widest">Đã có (Cập nhật)</span>}
                        </td>
                        <td className="px-8 py-5">
                           <p className="font-bold text-gray-800 mb-1 line-clamp-1">{row.tieuDe}</p>
                           <p className="text-[10px] text-gray-400 font-medium">{row.khuVuc} • {row.dienTich} m²</p>
                        </td>
                        <td className="px-8 py-5">
                           <p className="font-black text-brand-gold text-sm whitespace-nowrap">
                              {row.gia ? (row.gia >= 1000 ? (row.gia/1000).toFixed(1) + ' TỶ' : row.gia + ' TRIỆU') : 'N/A'}
                           </p>
                        </td>
                        <td className="px-8 py-5">
                          {row.isValid ? (
                            <div className="flex items-center gap-1.5 text-emerald-600 font-black uppercase text-[10px]">
                              <CheckCircle className="w-4 h-4" /> OK
                            </div>
                          ) : (
                            <div className="text-red-500">
                               <div className="flex items-center gap-1.5 font-black uppercase text-[10px] mb-1">
                                  <XCircle className="w-4 h-4" /> LỖI
                               </div>
                               <p className="text-[10px] italic font-medium">{row.errors?.[0]}</p>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logs Display */}
      {importStatus.logs.length > 0 && (
         <div className="p-8 bg-brand-ink text-brand-cream/60 rounded-[32px] font-mono text-[10px] max-h-60 overflow-y-auto space-y-1.5 shadow-2xl">
            <div className="flex gap-6 mb-4 pb-4 border-b border-white/10 font-bold uppercase tracking-widest">
               <span className="text-emerald-400">Thành công: {importStatus.success}</span>
               <span className="text-red-400">Lỗi: {importStatus.error}</span>
            </div>
            {importStatus.logs.map((log, i) => (
              <div key={i} className={`flex gap-2 ${log.includes('✅') ? 'text-emerald-400/80' : log.includes('❌') ? 'text-red-400/80' : ''}`}>
                <span className="opacity-40">[{i+1}]</span>
                <span>{log}</span>
              </div>
            ))}
         </div>
      )}
    </div>
  );
}
