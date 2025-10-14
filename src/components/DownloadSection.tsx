import React from 'react';
import { TonalRanges } from '../types';
import { downloadBlob, isMobileDevice, shareBlob, canUseNativeShare } from '../utils/mobileDownload';
import '../styles/DownloadSection.css';

interface DownloadSectionProps {
  processedImages: TonalRanges;
  onIndividualDownload?: (type: 'highlights' | 'midtones' | 'shadows' | 'darks') => void;
  onBulkDownload?: (count: number) => void;
}

const DownloadSection: React.FC<DownloadSectionProps> = ({ 
  processedImages, 
  onIndividualDownload,
  onBulkDownload 
}) => {
  const handleDownload = async (blob: Blob, filename: string, type?: 'highlights' | 'midtones' | 'shadows' | 'darks') => {
    try {
      // Try native share first on mobile devices
      if (isMobileDevice() && canUseNativeShare()) {
        const shared = await shareBlob(blob, filename);
        if (shared) {
          // Track download even for shares
          if (type && onIndividualDownload) {
            onIndividualDownload(type);
          }
          return;
        }
      }
      
      // Fall back to regular download
      downloadBlob(blob, filename);
      
      // Show simple instruction for mobile
      if (isMobileDevice()) {
        setTimeout(() => {
          alert('💡 Tip: If download doesn\'t work, try long-pressing the image and selecting "Save Image" or "Download"');
        }, 1500);
      }
      
      // Track individual download
      if (type && onIndividualDownload) {
        onIndividualDownload(type);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Try long-pressing the image and selecting "Save Image"');
    }
  };

  const handleDownloadAll = async () => {
    const availableImages = Object.values(processedImages).filter(image => image);
    const imageCount = availableImages.length;
    
    if (isMobileDevice()) {
      // Simple confirmation for mobile
      const proceed = window.confirm(`Download ${imageCount} images? They will download one by one.`);
      if (!proceed) return;
    }
    
    // Download all images with small delays
    for (let i = 0; i < availableImages.length; i++) {
      const image = availableImages[i];
      if (image) {
        setTimeout(async () => {
          await handleDownload(image.blob, image.name);
        }, i * 800); // 800ms delay between downloads
      }
    }
    
    // Track bulk download
    if (onBulkDownload && imageCount > 0) {
      onBulkDownload(imageCount);
    }
  };

  const availableImages = Object.entries(processedImages).filter(([_, image]) => image !== null);

  if (availableImages.length === 0) {
    return null;
  }

  return (
    <div className="download-section">
      <h2>Processed Images</h2>
      <p>Your image has been separated into tonal ranges. Highlights show as white on black for easy reference.</p>
      
      <div className="download-grid">
        {availableImages.map(([rangeName, image]) => {
          if (!image) return null;
          
          return (
            <div key={rangeName} className="download-item">
              <div className="image-preview">
                <img src={image.dataUrl} alt={`${rangeName} tones`} />
                <div className="image-overlay">
                  <button
                    onClick={() => handleDownload(image.blob, image.name, rangeName as 'highlights' | 'midtones' | 'shadows' | 'darks')}
                    className="download-button"
                  >
                    📥 Download
                  </button>
                </div>
              </div>
              <div className="image-info">
                <h3>{rangeName.charAt(0).toUpperCase() + rangeName.slice(1)}</h3>
                <p className="image-description">
                  {getImageDescription(rangeName)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="download-all-section">
        <button
          onClick={handleDownloadAll}
          className="download-all-button"
        >
          📦 Download All Images
        </button>
        {isMobileDevice() && (
          <p className="mobile-tip">
            💡 <strong>Mobile Tip:</strong> If downloads don't work, long-press any image above and select "Save Image" or "Download"
          </p>
        )}
      </div>
    </div>
  );
};

const getImageDescription = (rangeName: string): string => {
  switch (rangeName) {
    case 'highlights':
      return 'Bright areas shown as white on black';
    case 'midtones':
      return 'Medium brightness values';
    case 'shadows':
      return 'Darker areas with detail';
    case 'darks':
      return 'Deepest shadows and blacks';
    default:
      return '';
  }
};

export default DownloadSection;