import React from 'react';
import '../styles/ProgressBar.css';

interface ProgressBarProps {
  progress: number;
  stage: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, stage }) => {
  return (
    <div className="progress-container">
      <div className="progress-info">
        <h3>Processing Image...</h3>
        <p className="progress-stage">{stage}</p>
      </div>
      
      <div className="progress-bar-wrapper">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
        <span className="progress-percentage">
          {Math.round(progress)}%
        </span>
      </div>
      
      <div className="processing-stages">
        <div className={`stage ${progress >= 10 ? 'active' : ''} ${progress >= 25 ? 'completed' : ''}`}>
          Loading Image
        </div>
        <div className={`stage ${progress >= 25 ? 'active' : ''} ${progress >= 50 ? 'completed' : ''}`}>
          Analyzing Brightness
        </div>
        <div className={`stage ${progress >= 50 ? 'active' : ''} ${progress >= 75 ? 'completed' : ''}`}>
          Calculating Thresholds
        </div>
        <div className={`stage ${progress >= 75 ? 'active' : ''} ${progress >= 100 ? 'completed' : ''}`}>
          Generating Images
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;