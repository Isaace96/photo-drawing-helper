import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Gallery.css';

interface GalleryItem {
  id: string;
  title: string;
  description: string;
  artist: string;
  originalImage: string;
  highlights: string;
  midtones: string;
  shadows: string;
  darks: string;
  finalDrawing: string;
  tags: string[];
}

const Gallery: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'original' | 'highlights' | 'midtones' | 'shadows' | 'darks' | 'final'>('original');

  useEffect(() => {
    const fetchGalleryData = async () => {
      try {
        // Handle both development and production paths
        const basePath = '/photo-drawing-helper';
        const fetchUrl = `${basePath}/gallery/gallery-data.json`;
        console.log('Fetching gallery data from:', fetchUrl);
        
        const response = await fetch(fetchUrl);
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Gallery data loaded:', data);
        console.log('Number of items:', data.length);
        setGalleryItems(data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load gallery data:', error);
        setLoading(false);
      }
    };

    fetchGalleryData();
  }, []);

  const handleItemClick = (item: GalleryItem) => {
    setSelectedItem(item);
    setSelectedView('original');
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const getImageForView = (item: GalleryItem) => {
    const basePath = '/photo-drawing-helper';
    let imagePath: string;
    
    switch (selectedView) {
      case 'highlights': imagePath = item.highlights; break;
      case 'midtones': imagePath = item.midtones; break;
      case 'shadows': imagePath = item.shadows; break;
      case 'darks': imagePath = item.darks; break;
      case 'final': imagePath = item.finalDrawing; break;
      default: imagePath = item.originalImage; break;
    }
    
    return `${basePath}${imagePath}`;
  };

  const getImagePath = (imagePath: string) => {
    const basePath = '/photo-drawing-helper';
    return `${basePath}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="gallery-page">
        <div className="gallery-header">
          <h1>Drawing Gallery</h1>
          <Link to="/" className="back-link">← Back to Tool</Link>
        </div>
        <div className="loading">Loading gallery...</div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <h1>🎨 Drawing Gallery</h1>
        <p>Artwork created using the Photo Drawing Helper tool</p>
        <Link to="/" className="back-link">← Back to Tool</Link>
      </div>

      <div className="gallery-grid">
        {galleryItems.map((item) => (
          <div 
            key={item.id} 
            className="gallery-item"
            onClick={() => handleItemClick(item)}
          >
            <div className="gallery-image-container">
              <img 
                src={getImagePath(item.finalDrawing)} 
                alt={item.title}
                className="gallery-image"
                loading="lazy"
              />
              <div className="gallery-overlay">
                <h3>{item.title}</h3>
                <p>by {item.artist}</p>
                <div className="gallery-tags">
                  {item.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {galleryItems.length === 0 && (
        <div className="empty-gallery">
          <h3>Gallery Coming Soon!</h3>
          <p>We're collecting amazing artwork created with this tool.</p>
          <p>Upload your drawings and they might be featured here!</p>
        </div>
      )}

      {selectedItem && (
        <div className="gallery-modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closeModal}>×</button>
            
            <div className="modal-header">
              <h2>{selectedItem.title}</h2>
              <p>by {selectedItem.artist}</p>
            </div>

            <div className="modal-body">
              <div className="image-viewer">
                <img 
                  src={getImageForView(selectedItem)} 
                  alt={`${selectedItem.title} - ${selectedView}`}
                  className="modal-image"
                />
              </div>

              <div className="view-controls">
                <button 
                  className={`view-button ${selectedView === 'original' ? 'active' : ''}`}
                  onClick={() => setSelectedView('original')}
                >
                  Original Photo
                </button>
                <button 
                  className={`view-button ${selectedView === 'highlights' ? 'active' : ''}`}
                  onClick={() => setSelectedView('highlights')}
                >
                  Highlights
                </button>
                <button 
                  className={`view-button ${selectedView === 'midtones' ? 'active' : ''}`}
                  onClick={() => setSelectedView('midtones')}
                >
                  Midtones
                </button>
                <button 
                  className={`view-button ${selectedView === 'shadows' ? 'active' : ''}`}
                  onClick={() => setSelectedView('shadows')}
                >
                  Shadows
                </button>
                <button 
                  className={`view-button ${selectedView === 'darks' ? 'active' : ''}`}
                  onClick={() => setSelectedView('darks')}
                >
                  Darks
                </button>
                <button 
                  className={`view-button ${selectedView === 'final' ? 'active' : ''}`}
                  onClick={() => setSelectedView('final')}
                >
                  Final Drawing
                </button>
              </div>

              <div className="modal-footer">
                <p className="description">{selectedItem.description}</p>
                <div className="modal-tags">
                  {selectedItem.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;