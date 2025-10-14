// Mobile-friendly download utilities
export const isMobileDevice = (): boolean => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
         'ontouchstart' in window ||
         navigator.maxTouchPoints > 1;
};

export const isIOSDevice = (): boolean => {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  
  if (isMobileDevice()) {
    // Mobile approach: Open in new tab
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Make the link invisible
    link.style.position = 'fixed';
    link.style.top = '-10000px';
    link.style.left = '-10000px';
    link.style.opacity = '0';
    link.style.pointerEvents = 'none';
    
    document.body.appendChild(link);
    
    // Trigger download with both methods for better compatibility
    if (isIOSDevice()) {
      // iOS Safari specific handling
      const clickEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      link.dispatchEvent(clickEvent);
    } else {
      // Android and other mobile browsers
      link.click();
    }
    
    // Clean up
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    }, 1000);
    
  } else {
    // Desktop approach
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export const showMobileDownloadInstructions = (): void => {
  if (isIOSDevice()) {
    // iOS-specific instructions
    const message = `💡 iOS Download Tips:
    
1. If download doesn't start automatically, tap and hold the image
2. Select "Save to Photos" or "Download Image"
3. Or use "Share" → "Save to Files"

The image will be saved to your device!`;
    
    alert(message);
  } else if (isMobileDevice()) {
    // Android and other mobile devices
    const message = `💡 Mobile Download Tips:
    
1. The image will open in a new tab
2. Tap the download icon in your browser
3. Or tap and hold the image to save it

Check your Downloads folder or Photos app!`;
    
    alert(message);
  }
};

export const createMobileFriendlyDownload = (blob: Blob, filename: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      downloadBlob(blob, filename);
      
      // Show instructions after a brief delay
      if (isMobileDevice()) {
        setTimeout(() => {
          showMobileDownloadInstructions();
        }, 500);
      }
      
      resolve(true);
    } catch (error) {
      console.error('Download failed:', error);
      
      // Fallback: Try to open image in new tab
      if (isMobileDevice()) {
        try {
          const url = URL.createObjectURL(blob);
          window.open(url, '_blank');
          setTimeout(() => URL.revokeObjectURL(url), 5000);
          showMobileDownloadInstructions();
          resolve(true);
        } catch (fallbackError) {
          console.error('Fallback download failed:', fallbackError);
          resolve(false);
        }
      } else {
        resolve(false);
      }
    }
  });
};