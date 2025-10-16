import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import PhotoTool from './components/PhotoTool';
import Gallery from './components/Gallery';

function App() {
  // Set basename for both development and production
  const basename = process.env.NODE_ENV === 'production' ? '/photo-drawing-helper' : '/photo-drawing-helper';
  
  return (
    <Router basename={basename}>
      <div className="App">
        <Routes>
          <Route path="/" element={<PhotoTool />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
