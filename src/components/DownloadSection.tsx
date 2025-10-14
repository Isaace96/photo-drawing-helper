import React from 'react';
import { TonalRanges } from '../types';
import '../styles/DownloadSection.css';

interface DownloadSectionProps {
  processedImages: TonalRanges;
}

const DownloadSection: React.FC<DownloadSectionProps> = ({ processedImages }) => {
  const handleDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = () => {
    Object.values(processedImages).forEach(image => {
      if (image) {
        setTimeout(() => {
          handleDownload(image.blob, image.name);
        }, 100); // Small delay between downloads
      }
    });
  };

  const availableImages = Object.entries(processedImages).filter(([_, image]) => image !== null);

  if (availableImages.length === 0) {
    return null;
  }

  return (
    <div className="download-section">
      <h2>Processed Images</h2>
      <p>Your image has been separated into tonal ranges. Download individual images or all at once.</p>
      
      <div className="download-grid">
        {availableImages.map(([rangeName, image]) => {
          if (!image) return null;
          
          return (
            <div key={rangeName} className="download-item">
              <div className="image-preview">
                <img src={image.dataUrl} alt={`${rangeName} tones`} />
                <div className="image-overlay">
                  <button
                    onClick={() => handleDownload(image.blob, image.name)}
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
      return 'Bright areas and light tones';
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