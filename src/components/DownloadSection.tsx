import React from 'react';
import { TonalRanges } from '../types';
import { createMobileFriendlyDownload, isMobileDevice } from '../utils/mobileDownload';
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
      const success = await createMobileFriendlyDownload(blob, filename);
      
      if (!success) {
        // Fallback: show error message
        alert('Download failed. Please try again or check your browser settings.');
      }
      
      // Track individual download
      if (type && onIndividualDownload) {
        onIndividualDownload(type);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    }
  };

  const handleDownloadAll = () => {
    const availableImages = Object.values(processedImages).filter(image => image);
    const imageCount = availableImages.length;
    
    if (isMobileDevice()) {
      // On mobile, warn user about multiple downloads
      const confirmDownload = window.confirm(
        `Download ${imageCount} images?\n\nEach image will open in a new tab. Please save each one manually.\n\nTip: Use individual downloads for easier mobile experience.`
      );
      
      if (!confirmDownload) {
        return;
      }
      
      // Download with longer delays for mobile
      availableImages.forEach((image, index) => {
        if (image) {
          setTimeout(async () => {
            await handleDownload(image.blob, image.name);
          }, index * 2000); // 2 second delay for mobile
        }
      });
    } else {
      // Desktop: faster sequential downloads
      availableImages.forEach((image, index) => {
        if (image) {
          setTimeout(async () => {
            await handleDownload(image.blob, image.name);
          }, index * 200); // 200ms delay for desktop
        }
      });
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