import React, { useState } from 'react';
import './App.css';
import ImageUploader from './components/ImageUploader';
import ProgressBar from './components/ProgressBar';
import ImageProcessor from './components/ImageProcessor';
import DownloadSection from './components/DownloadSection';
import { ImageData, ProcessingState, TonalRanges } from './types';

function App() {
  const [uploadedImage, setUploadedImage] = useState<ImageData | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    stage: '',
    error: null
  });
  const [processedImages, setProcessedImages] = useState<TonalRanges>({
    highlights: null,
    midtones: null,
    shadows: null,
    darks: null
  });

  const handleImageUpload = (imageData: ImageData) => {
    setUploadedImage(imageData);
    setProcessedImages({
      highlights: null,
      midtones: null,
      shadows: null,
      darks: null
    });
  };

  const handleProcessingUpdate = (state: ProcessingState) => {
    setProcessingState(state);
  };

  const handleProcessingComplete = (images: TonalRanges) => {
    setProcessedImages(images);
    setProcessingState({
      isProcessing: false,
      progress: 100,
      stage: 'Complete',
      error: null
    });
  };

  const handleReset = () => {
    setUploadedImage(null);
    setProcessedImages({
      highlights: null,
      midtones: null,
      shadows: null,
      darks: null
    });
    setProcessingState({
      isProcessing: false,
      progress: 0,
      stage: '',
      error: null
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Photo Drawing Helper</h1>
        <p>Upload an image to extract highlights, midtones, shadows, and darks</p>
      </header>
      
      <main className="App-main">
        {!uploadedImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <>
            <div className="image-preview">
              <img src={uploadedImage.preview} alt="Uploaded" className="uploaded-image" />
              <button 
                onClick={handleReset} 
                className={`reset-button ${processingState.isProcessing ? 'disabled' : ''}`}
                disabled={processingState.isProcessing}
              >
                {processingState.isProcessing ? 'Processing...' : 'Upload New Image'}
              </button>
            </div>
            
            {processingState.isProcessing && (
              <ProgressBar 
                progress={processingState.progress}
                stage={processingState.stage}
              />
            )}
            
            <ImageProcessor
              imageData={uploadedImage}
              onProcessingUpdate={handleProcessingUpdate}
              onProcessingComplete={handleProcessingComplete}
            />
            
            {(processedImages.highlights || processedImages.midtones || 
              processedImages.shadows || processedImages.darks) && (
              <DownloadSection processedImages={processedImages} />
            )}
            
            {processingState.error && (
              <div className="error-message">
                Error: {processingState.error}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
