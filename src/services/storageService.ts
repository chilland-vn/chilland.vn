import { storage, auth } from '../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

/**
 * SERVICE UPLOAD ẢNH LÊN FIREBASE STORAGE
 */

export const uploadImage = (
  file: File | Blob, 
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 6. Đảm bảo chỉ upload khi auth.currentUser != null
    const user = auth.currentUser;
    if (!user) {
      const errorMsg = "Không có quyền upload. Vui lòng đăng nhập đúng tài khoản";
      console.error("❌ Auth Error:", errorMsg);
      reject(new Error(errorMsg));
      return;
    }

    // 1. & 2. Tất cả ảnh phải upload vào đúng thư mục: properties/{timestamp}-{filename}
    const path = `properties/${Date.now()}-${fileName}`;
    
    // 4. Thêm log debug
    console.log("Uploading to:", path);
    console.log("User:", user.email);

    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(progress);
      },
      (error) => {
        // 5. Nếu upload lỗi, hiển thị lỗi tiếng Việt
        console.error("❌ Lỗi upload ảnh Storage:", error);
        reject(new Error("Không có quyền upload. Vui lòng đăng nhập đúng tài khoản"));
      },
      async () => {
        // 3. Sau khi upload thành công, lấy downloadURL
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (err) {
          console.error("❌ Lỗi lấy download URL:", err);
          reject(new Error("Không lấy được URL ảnh."));
        }
      }
    );
  });
};

export const uploadMultipleImages = async (
  items: { file: File | Blob, name: string }[], 
  onTotalProgress?: (current: number, total: number) => void
): Promise<string[]> => {
  // Thực hiện upload song song
  const uploadPromises = items.map(item => uploadImage(item.file, item.name));
  
  // Chờ tất cả hoàn thành
  const urls = await Promise.all(uploadPromises);
  
  if (onTotalProgress) onTotalProgress(items.length, items.length);
  return urls;
};
