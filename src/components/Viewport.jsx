// src/components/Viewport.jsx
import React from 'react';
import './Viewport.css';

// imageRef is optional for saving now
function Viewport({ imageUrl, filters, imageRef }) {
    const filterStyle = React.useMemo(() => {
        return Object.entries(filters || {})
            .map(([filter, value]) => `${filter}(${value})`)
            .join(' ');
    }, [filters]);

    return (
        <main className="viewport-main">
            {imageUrl ? (
                <div className="image-container"> {/* Container centers image */}
                    <img
                        ref={imageRef} // Optional ref
                        src={imageUrl}
                        alt="Filtered content"
                        className="displayed-image"
                        style={{ filter: filterStyle }} // Filter applied for display
                        draggable="false"
                    />
                </div>
            ) : (
                <div className="placeholder">
                    <p>Your filtered image will appear here.</p>
                    <span>Upload an image using the controls panel.</span>
                </div>
            )}
        </main>
    );
}

export default React.memo(Viewport, (prevProps, nextProps) => {
    return prevProps.imageUrl === nextProps.imageUrl && prevProps.filters === nextProps.filters;
});

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos