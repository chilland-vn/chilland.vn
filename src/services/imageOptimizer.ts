
/**
 * Image Optimizer Service for Chilland.vn
 * Handles client-side resizing and compression to speed up uploads.
 */

export interface OptimizedImage {
  blob: Blob;
  width: number;
  height: number;
  originalSize: number;
  optimizedSize: number;
  format: string;
}

export async function optimizeImage(
  file: File,
  maxWidth = 1800,
  quality = 0.82
): Promise<OptimizedImage | null> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP if supported, otherwise JPEG
        const format = 'image/webp';
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve({
                blob,
                width,
                height,
                originalSize: file.size,
                optimizedSize: blob.size,
                format
              });
            } else {
              // Fallback to JPEG if WebP fails
              canvas.toBlob(
                (jpegBlob) => {
                  if (jpegBlob) {
                    resolve({
                      blob: jpegBlob,
                      width,
                      height,
                      originalSize: file.size,
                      optimizedSize: jpegBlob.size,
                      format: 'image/jpeg'
                    });
                  } else {
                    resolve(null);
                  }
                },
                'image/jpeg',
                quality
              );
            }
          },
          format,
          quality
        );
      };
      img.onerror = () => resolve(null);
    };
    reader.onerror = () => resolve(null);
  });
}

/**
 * Format bytes to readable size
 */
export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
