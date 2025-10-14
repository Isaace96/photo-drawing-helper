import React, { useCallback, useState } from 'react';
import { ImageData, SUPPORTED_FORMATS, MAX_FILE_SIZE } from '../types';
import '../styles/ImageUploader.css';

interface ImageUploaderProps {
  onImageUpload: (imageData: ImageData) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): string | null => {
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      return `Unsupported file format. Please upload: ${SUPPORTED_FORMATS.join(', ')}`;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return `File too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`;
    }
    
    return null;
  };

  const processFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const imageData: ImageData = {
          file,
          preview: e.target?.result as string,
          width: img.width,
          height: img.height
        };
        onImageUpload(imageData);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [onImageUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  }, [processFile]);

  return (
    <div className="image-uploader">
      <div
        className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="upload-content">
          <div className="upload-icon">📁</div>
          <h3>Upload Your Image</h3>
          <p>Drag and drop an image here, or click to select</p>
          <p className="supported-formats">
            Supported formats: JPG, PNG, GIF, WebP (max {MAX_FILE_SIZE / (1024 * 1024)}MB)
          </p>
          <input
            type="file"
            accept={SUPPORTED_FORMATS.join(',')}
            onChange={handleFileInput}
            className="file-input"
            id="file-input"
          />
          <label htmlFor="file-input" className="upload-button">
            Choose File
          </label>
        </div>
      </div>
      
      {error && (
        <div className="upload-error">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;