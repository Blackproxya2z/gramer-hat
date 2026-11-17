/**
 * Image Processor for Gramer Hat E-Commerce
 * Automatically resizes, frames to 1:1 square (800x800),
 * and converts PNG or any mobile format into optimized JPEG.
 */

export interface ProcessedImageResult {
  dataUrl: string;
  originalName: string;
  originalFormat: string;
  convertedFormat: 'image/jpeg';
  originalSizeKB: number;
  optimizedSizeKB: number;
  width: number;
  height: number;
}

export function processProductImage(
  file: File,
  targetSize = 800,
  quality = 0.85
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    const originalFormat = file.type;
    const originalSizeKB = Math.round(file.size / 1024);
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        // Create offscreen canvas for square 1:1 framing
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('Failed to get 2D canvas context.'));
          return;
        }

        // Fill background with clean white (important when converting transparent PNG to JPEG)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetSize, targetSize);

        // Smart Center-Crop (object-fit: cover) to make a perfect square frame
        const hRatio = targetSize / img.width;
        const vRatio = targetSize / img.height;
        const ratio = Math.max(hRatio, vRatio);

        const renderedWidth = img.width * ratio;
        const renderedHeight = img.height * ratio;
        const shiftX = (targetSize - renderedWidth) / 2;
        const shiftY = (targetSize - renderedHeight) / 2;

        // Draw the image centered and cropped into the 800x800 frame
        ctx.drawImage(img, shiftX, shiftY, renderedWidth, renderedHeight);

        // Convert to high-quality JPEG format (even if original was PNG, WebP, etc.)
        const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        // Calculate optimized size in KB
        const base64Length = jpegDataUrl.length - (jpegDataUrl.indexOf(',') + 1);
        const optimizedSizeKB = Math.round((base64Length * 3) / 4 / 1024);

        resolve({
          dataUrl: jpegDataUrl,
          originalName: file.name,
          originalFormat,
          convertedFormat: 'image/jpeg',
          originalSizeKB,
          optimizedSizeKB,
          width: targetSize,
          height: targetSize,
        });
      };

      img.onerror = () => {
        reject(new Error('Failed to load image for processing.'));
      };

      if (typeof readerEvent.target?.result === 'string') {
        img.src = readerEvent.target.result;
      } else {
        reject(new Error('Failed to read image data.'));
      }
    };

    reader.onerror = () => reject(new Error('File reading error.'));
    reader.readAsDataURL(file);
  });
}
