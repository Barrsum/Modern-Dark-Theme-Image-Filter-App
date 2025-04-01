// src/App.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
// No html2canvas needed for saving anymore
import Header from './components/Header';
import Controls from './components/Controls';
import Viewport from './components/Viewport';
import Footer from './components/Footer';
import './AppLayout.css';
import './index.css';

function App() {
  // --- State Definitions ---
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });
  const [imageUrl, setImageUrl] = useState(null); // Original image Data URL
  const [filters, setFilters] = useState({}); // { filterName: valueString }
  const [controlsView, setControlsView] = useState('presets'); // Default to presets
  const imageRef = useRef(null); // Ref for potential other uses (not saving)

  // --- Theme Toggle ---
  const toggleTheme = useCallback(() => {
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  }, []);

  // --- Apply Theme Effect ---
  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  // --- Image Upload Handler ---
  const handleImageUpload = useCallback((event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result);
        setFilters({}); // Reset filters
        setControlsView('presets'); // Reset view to presets
      };
      reader.readAsDataURL(file);
    } else if (file) {
        alert("Please select a valid image file.");
    }
    event.target.value = null;
  }, []);

  // --- Apply Single Filter (for sliders) ---
  const applyFilter = useCallback((filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  }, []);

  // --- Apply Preset Filters ---
  const applyPreset = useCallback((presetFilters) => {
    setFilters(presetFilters);
  }, []);

  // --- Toggle Controls View ---
  const toggleControlsView = useCallback(() => {
    setControlsView(prevView => (prevView === 'sliders' ? 'presets' : 'sliders'));
  }, []);

  // --- Reset Filters ---
  const resetFilters = useCallback(() => {
    setFilters({});
  }, []);

  // --- Clear Image ---
  const clearImage = useCallback(() => {
    setImageUrl(null);
    setFilters({});
  }, []);

  // --- REVISED Save Image using Canvas API ---
  const handleSaveImage = useCallback(() => {
    if (!imageUrl) {
      alert("No image loaded to save.");
      return;
    }

    const originalImage = new Image();
    originalImage.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = originalImage.naturalWidth;
      canvas.height = originalImage.naturalHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        alert("Failed to get canvas context. Cannot save image.");
        return;
      }

      // Construct filter string from state
      const filterString = Object.entries(filters)
        .map(([key, value]) => `${key}(${value})`)
        .join(' ');

      // Apply filter to canvas context
      ctx.filter = filterString;

      // Draw image onto filtered context
      ctx.drawImage(originalImage, 0, 0, canvas.width, canvas.height);

      // Trigger download
      try {
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `filtered-image-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (error) {
        console.error("Canvas toDataURL error:", error);
        alert("Error saving image. The filter combination might be unsupported or the image too large.");
      }
    };
    originalImage.onerror = () => {
      alert("Failed to load image data for saving.");
    };
    // Important: Use the stored original image URL
    originalImage.src = imageUrl;

  }, [imageUrl, filters]); // Dependencies

  // --- Placeholder Handlers ---
  const handleUndo = () => alert("Undo functionality not implemented yet.");
  const handleRedo = () => alert("Redo functionality not implemented yet.");

  return (
    <div className="app-container">
      <Header theme={theme} toggleTheme={toggleTheme} />
      <div className="main-content-area">
        <Controls
          controlsView={controlsView}
          toggleControlsView={toggleControlsView}
          applyPreset={applyPreset}
          onImageUpload={handleImageUpload}
          onApplyFilter={applyFilter}
          onResetFilters={resetFilters}
          onClearImage={clearImage}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onSaveImage={handleSaveImage} // Pass the NEW save function
          currentFilters={filters}
          hasImage={!!imageUrl}
        />
        <Viewport
          imageUrl={imageUrl}
          filters={filters}
          imageRef={imageRef} // Still passed, but not used for saving
        />
      </div>
      <Footer />
    </div>
  );
}

export default App;

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos