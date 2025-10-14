// Performance optimization utilities for production
export const optimizeImage = (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      const { width, height } = img;
      const aspectRatio = width / height;
      
      let newWidth = width;
      let newHeight = height;
      
      if (width > maxWidth) {
        newWidth = maxWidth;
        newHeight = maxWidth / aspectRatio;
      }
      
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      if (ctx) {
        // Draw optimized image
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        
        // Convert back to file
        canvas.toBlob((blob) => {
          if (blob) {
            const optimizedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            resolve(optimizedFile);
          } else {
            resolve(file); // Fallback to original
          }
        }, 'image/jpeg', quality);
      } else {
        resolve(file); // Fallback to original
      }
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Memory cleanup utility
export const cleanupCanvas = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  canvas.width = 0;
  canvas.height = 0;
};

// Batch processing with progress for large images
export const batchProcess = async <T>(
  items: T[],
  processor: (item: T, index: number) => Promise<any>,
  onProgress: (progress: number) => void,
  batchSize: number = 1
): Promise<any[]> => {
  const results: any[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchPromises = batch.map((item, batchIndex) => 
      processor(item, i + batchIndex)
    );
    
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    
    const progress = Math.min(100, ((i + batchSize) / items.length) * 100);
    onProgress(progress);
    
    // Allow UI to update between batches
    await new Promise(resolve => setTimeout(resolve, 10));
  }
  
  return results;
};