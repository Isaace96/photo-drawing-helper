// Simple and reliable mobile download utilities
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const canUseNativeShare = (): boolean => {
  return 'navigator' in window && 'share' in navigator && 'canShare' in navigator;
};

export const shareBlob = async (blob: Blob, filename: string): Promise<boolean> => {
  if (!canUseNativeShare()) {
    return false;
  }
  
  try {
    const file = new File([blob], filename, { type: blob.type });
    
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: 'Photo Drawing Helper',
        text: `Processed image: ${filename}`,
        files: [file]
      });
      return true;
    }
  } catch (error) {
    console.warn('Native share failed:', error);
  }
  
  return false;
};

export const downloadBlob = (blob: Blob, filename: string): void => {
  // Try multiple download methods for better mobile compatibility
  
  // Method 1: Standard download link (works on most devices)
  try {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  } catch (error) {
    console.warn('Standard download failed, trying fallback');
  }
  
  // Method 2: For mobile browsers that don't support download attribute
  if (isMobileDevice()) {
    try {
      const reader = new FileReader();
      reader.onload = function() {
        const dataUrl = reader.result as string;
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        link.target = '_blank';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };
      reader.readAsDataURL(blob);
      return;
    } catch (error) {
      console.warn('Data URL download failed');
    }
  }
  
  // Method 3: Last resort - open in new window
  try {
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  } catch (error) {
    console.error('All download methods failed');
    alert('Download failed. Please try using a different browser or device.');
  }
};