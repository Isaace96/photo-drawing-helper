import React, { useEffect, useRef } from 'react';
import { ImageData, ProcessingState, TonalRanges, ProcessedImage } from '../types';
import {
  loadImageToCanvas,
  calculateBrightnessThresholds,
  createTonalImage,
  imageDataToJpgBlob,
  imageDataToDataUrl
} from '../utils/imageProcessor';

interface ImageProcessorProps {
  imageData: ImageData;
  onProcessingUpdate: (state: ProcessingState) => void;
  onProcessingComplete: (images: TonalRanges) => void;
}

const ImageProcessor: React.FC<ImageProcessorProps> = ({ 
  imageData, 
  onProcessingUpdate, 
  onProcessingComplete 
}) => {
  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (!imageData || isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    processImage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageData]); // processImage is defined inside this component and doesn't need to be a dependency

  const processImage = async () => {
    try {
      // Stage 1: Loading Image (0-25%)
      onProcessingUpdate({
        isProcessing: true,
        progress: 10,
        stage: 'Loading image...',
        error: null
      });

      const { imageData: imgData } = await loadImageToCanvas(imageData.file);
      
      // Stage 2: Analyzing Brightness (25-50%)
      onProcessingUpdate({
        isProcessing: true,
        progress: 25,
        stage: 'Analyzing brightness values...',
        error: null
      });

      // Simulate some processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 500));

      const thresholds = calculateBrightnessThresholds(imgData);
      
      // Stage 3: Calculating Thresholds (50-75%)
      onProcessingUpdate({
        isProcessing: true,
        progress: 50,
        stage: 'Calculating tonal thresholds...',
        error: null
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      // Stage 4: Generating Images (75-100%)
      onProcessingUpdate({
        isProcessing: true,
        progress: 75,
        stage: 'Generating tonal images...',
        error: null
      });

      // Create tonal images
      const tonalRanges = ['highlights', 'midtones', 'shadows', 'darks'] as const;
      const processedImages: Partial<TonalRanges> = {};

      for (let i = 0; i < tonalRanges.length; i++) {
        const range = tonalRanges[i];
        const progress = 75 + (i + 1) * (25 / tonalRanges.length);
        
        onProcessingUpdate({
          isProcessing: true,
          progress,
          stage: `Generating ${range} image...`,
          error: null
        });

        const tonalImageData = createTonalImage(imgData, thresholds, range);
        const blob = await imageDataToJpgBlob(tonalImageData);
        const dataUrl = imageDataToDataUrl(tonalImageData);

        const processedImage: ProcessedImage = {
          name: `${imageData.file.name.split('.')[0]}_${range}.jpg`,
          dataUrl,
          blob
        };

        processedImages[range] = processedImage;
        
        // Small delay for better UX
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Complete
      onProcessingUpdate({
        isProcessing: true,
        progress: 100,
        stage: 'Complete!',
        error: null
      });

      onProcessingComplete(processedImages as TonalRanges);
      
    } catch (error) {
      console.error('Image processing error:', error);
      onProcessingUpdate({
        isProcessing: false,
        progress: 0,
        stage: '',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      isProcessingRef.current = false;
    }
  };

  // This component doesn't render anything visible
  return null;
};

export default ImageProcessor;