import { ThresholdValues } from '../types';

/**
 * Calculate luminosity (brightness) of a pixel using the standard formula
 */
export const calculateLuminosity = (r: number, g: number, b: number): number => {
  return 0.299 * r + 0.587 * g + 0.114 * b;
};

/**
 * Load an image file into a canvas and return the ImageData
 */
export const loadImageToCanvas = (file: File): Promise<{ canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; imageData: ImageData }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resolve({ canvas, ctx, imageData });
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Analyze brightness values and calculate automatic thresholds
 */
export const calculateBrightnessThresholds = (imageData: ImageData): ThresholdValues => {
  const data = imageData.data;
  const brightnessValues: number[] = [];
  
  // Extract brightness values for all pixels
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const brightness = calculateLuminosity(r, g, b);
    brightnessValues.push(brightness);
  }
  
  // Sort brightness values
  brightnessValues.sort((a, b) => a - b);
  
  // Calculate percentile-based thresholds
  const total = brightnessValues.length;
  const shadowsMax = brightnessValues[Math.floor(total * 0.25)]; // 25th percentile
  const midtonesMin = shadowsMax;
  const midtonesMax = brightnessValues[Math.floor(total * 0.75)]; // 75th percentile
  const highlightsMin = midtonesMax;
  
  return {
    shadowsMax,
    midtonesMin,
    midtonesMax,
    highlightsMin
  };
};

/**
 * Create a grayscale image for a specific tonal range
 */
export const createTonalImage = (
  originalImageData: ImageData,
  thresholds: ThresholdValues,
  tonalRange: 'highlights' | 'midtones' | 'shadows' | 'darks'
): ImageData => {
  const { width, height, data } = originalImageData;
  const newImageData = new ImageData(width, height);
  const newData = newImageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    
    const brightness = calculateLuminosity(r, g, b);
    let shouldInclude = false;
    
    switch (tonalRange) {
      case 'darks':
        shouldInclude = brightness < thresholds.shadowsMax * 0.5;
        break;
      case 'shadows':
        shouldInclude = brightness >= thresholds.shadowsMax * 0.5 && brightness < thresholds.midtonesMin;
        break;
      case 'midtones':
        shouldInclude = brightness >= thresholds.midtonesMin && brightness < thresholds.midtonesMax;
        break;
      case 'highlights':
        shouldInclude = brightness >= thresholds.highlightsMin;
        break;
    }
    
    if (shouldInclude) {
      // Convert to grayscale and keep the pixel
      const gray = Math.round(brightness);
      newData[i] = gray;     // R
      newData[i + 1] = gray; // G
      newData[i + 2] = gray; // B
      newData[i + 3] = a;    // A
    } else {
      // Make pixel transparent
      newData[i] = 255;     // R - white background
      newData[i + 1] = 255; // G
      newData[i + 2] = 255; // B
      newData[i + 3] = 255; // A - fully opaque white
    }
  }
  
  return newImageData;
};

/**
 * Convert ImageData to a JPG blob
 */
export const imageDataToJpgBlob = (imageData: ImageData): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }
    
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);
    
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to create blob'));
      }
    }, 'image/jpeg', 0.9);
  });
};

/**
 * Create a data URL from ImageData
 */
export const imageDataToDataUrl = (imageData: ImageData): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }
  
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);
  
  return canvas.toDataURL('image/jpeg', 0.9);
};