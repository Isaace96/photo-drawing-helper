export interface ProcessedImage {
  name: string;
  dataUrl: string;
  blob: Blob;
}

export interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  stage: string;
  error: string | null;
}

export interface TonalRanges {
  highlights: ProcessedImage | null;
  midtones: ProcessedImage | null;
  shadows: ProcessedImage | null;
  darks: ProcessedImage | null;
}

export interface ImageData {
  file: File;
  preview: string;
  width: number;
  height: number;
}

export interface ThresholdValues {
  shadowsMax: number;
  midtonesMin: number;
  midtonesMax: number;
  highlightsMin: number;
}

export const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB