// src/components/Controls.jsx
import React from 'react';
import './Controls.css';

// Configuration for individual filters (used for sliders)
const FILTERS_CONFIG = [
    { name: 'Brightness', cssName: 'brightness', defaultValue: 1, min: 0, max: 3, step: 0.05 },
    { name: 'Contrast', cssName: 'contrast', defaultValue: 1, min: 0, max: 3, step: 0.05 },
    { name: 'Saturate', cssName: 'saturate', defaultValue: 1, min: 0, max: 3, step: 0.05 },
    { name: 'Grayscale', cssName: 'grayscale', defaultValue: 0, min: 0, max: 1, step: 0.01 },
    { name: 'Sepia', cssName: 'sepia', defaultValue: 0, min: 0, max: 1, step: 0.01 },
    { name: 'Hue Rotate', cssName: 'hue-rotate', defaultValue: 0, min: 0, max: 360, step: 1, unit: 'deg' },
    { name: 'Blur', cssName: 'blur', defaultValue: 0, min: 0, max: 15, step: 0.1, unit: 'px' },
    { name: 'Invert', cssName: 'invert', defaultValue: 0, min: 0, max: 1, step: 0.01 },
];

// Define Preset Filters
const PRESETS = [
    {
        name: "Vintage",
        settings: { 'sepia': '0.65', 'saturate': '1.3', 'contrast': '0.9', 'brightness': '1.05' }
    },
    {
        name: "Cool",
        settings: { 'contrast': '1.1', 'brightness': '1.1', 'hue-rotate': '-15deg' }
    },
    {
        name: "Warm",
        settings: { 'saturate': '1.2', 'sepia': '0.15', 'brightness': '1.05' }
    },
    {
        name: "Grayscale+",
        settings: { 'grayscale': '1', 'contrast': '1.2', 'brightness': '0.95' }
    },
     {
        name: "Dramatic",
        settings: { 'contrast': '1.4', 'saturate': '1.2', 'brightness': '0.9' }
    },
     {
        name: "Summer",
        settings: { 'saturate': '1.4', 'contrast': '1.1', 'brightness': '1.1', 'sepia': '0.1'}
    },
    {
        name: "Faded",
        settings: { 'contrast': '0.8', 'brightness': '1.1', 'saturate': '0.8'}
    }
];


function Controls({
    // --- Control View Props ---
    controlsView,
    toggleControlsView,
    applyPreset,
    // --- Core Functionality Props ---
    onImageUpload,
    onApplyFilter,
    onResetFilters,
    onClearImage,
    onUndo,
    onRedo,
    onSaveImage,
    // --- State Props ---
    hasImage,
    currentFilters
}) {

    // --- Slider Input Handler ---
    const handleSliderChange = (event, filter) => {
        const value = event.target.value;
        const valueString = `${value}${filter.unit || ''}`;
        onApplyFilter(filter.cssName, valueString);
    };

    // --- Get Current Slider Value (Numeric) ---
    const getSliderValue = (filter) => {
        const cssValue = currentFilters[filter.cssName];
        if (cssValue === undefined) {
            return filter.defaultValue;
        }
        // Parse float, fallback to default value if parsing fails or value is invalid
        const parsed = parseFloat(cssValue);
        return isNaN(parsed) ? filter.defaultValue : parsed;
    };

    // --- Format Slider Value for Display ---
     const formatSliderValue = (filter) => {
        const value = getSliderValue(filter);
        let precision = 0;
        if (filter.step < 0.01) precision = 3;
        else if (filter.step < 0.1) precision = 2;
        else if (filter.step < 1) precision = 1;
        return `${value.toFixed(precision)}${filter.unit || ''}`;
    }

    // --- Preset Button Click Handler ---
    const handlePresetClick = (preset) => {
        applyPreset(preset.settings);
    };


    return (
        <aside className="controls-sidebar">
            <div className="controls-sticky-content"> {/* Wrapper for potential sticky behavior */}
                <h2 className="controls-title">Controls</h2>

                {/* Upload Section */}
                <div className="control-group upload-group">
                    <label htmlFor="image-upload" className="file-upload-label">
                        {hasImage ? 'Change Image' : 'Upload Image'}
                    </label>
                    <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={onImageUpload}
                        style={{ display: 'none' }}
                    />
                    {!hasImage && (
                        <p className="no-image-notice">Upload an image to start filtering.</p>
                    )}
                </div>

                {/* Sections shown only when an image is present */}
                {hasImage && (
                    <>
                        {/* Filters Section (Sliders or Presets) */}
                        <div className="control-group filters-group">
                            <div className="filters-header">
                                <h3>Filters</h3>
                                <button onClick={toggleControlsView} className="view-toggle-button" aria-label={`Switch to ${controlsView === 'sliders' ? 'Presets' : 'Sliders'} view`}>
                                    {controlsView === 'sliders' ? 'Go to Preset Filters' : 'Access Sliders Control'}
                                </button>
                            </div>

                            {/* Conditional Rendering based on controlsView */}
                            {controlsView === 'sliders' ? (
                                <div className="sliders-container" role="group" aria-labelledby="sliders-heading">
                                    {/* <h4 id="sliders-heading" className="sr-only">Adjust Filters Manually</h4> */}
                                    {FILTERS_CONFIG.map((filter) => (
                                        <div key={filter.cssName} className="filter-control">
                                            <label htmlFor={`${filter.cssName}-slider`} className="filter-label">
                                                {filter.name}
                                                <span className="slider-value" aria-hidden="true">
                                                    {formatSliderValue(filter)}
                                                </span>
                                            </label>
                                            <input
                                                type="range"
                                                id={`${filter.cssName}-slider`}
                                                min={filter.min}
                                                max={filter.max}
                                                step={filter.step}
                                                value={getSliderValue(filter)}
                                                onChange={(e) => handleSliderChange(e, filter)}
                                                className="filter-slider"
                                                aria-label={`${filter.name} slider`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="presets-container" role="group" aria-labelledby="presets-heading">
                                    {/* <h4 id="presets-heading" className="sr-only">Apply Filter Presets</h4> */}
                                    {PRESETS.map((preset) => (
                                        <button
                                            key={preset.name}
                                            className="preset-button"
                                            onClick={() => handlePresetClick(preset)}
                                            title={`Apply ${preset.name} preset`}
                                        >
                                            {preset.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Utilities Section */}
                        <div className="control-group utilities-group">
                            <h3>Utilities</h3>
                            <button onClick={onResetFilters} disabled={!hasImage}>
                                Reset Filters
                            </button>
                            {/* <button onClick={onUndo} disabled={!hasImage || true} title="Undo (Not Implemented)"> Undo </button>
                            <button onClick={onRedo} disabled={!hasImage || true} title="Redo (Not Implemented)"> Redo </button> */}
                            <button onClick={onClearImage} disabled={!hasImage} className="button-danger">
                                Clear Image
                            </button>
                            <button onClick={onSaveImage} disabled={!hasImage} className="button-success">
                                Save Image
                            </button>
                        </div>
                    </>
                )}
            </div>
        </aside>
    );
}


export default React.memo(Controls);

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos