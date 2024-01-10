import React, { useState, useEffect } from 'react';
import './PixelArtGallery.css'; // Update the CSS import

const NewPixelArtGallery = () => {
  const [selectedSize, setSelectedSize] = useState('16x16');
  const [pixelArt, setPixelArt] = useState([]);

  useEffect(() => {
    // Fetch pixel art based on the selected size
    const fetchPixelArt = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/pixel_art?size=${selectedSize}`);
        if (response.ok) {
          const data = await response.json();
          setPixelArt(data);
        } else {
          console.error('Error fetching pixel art:', response);
        }
      } catch (error) {
        console.error('Error fetching pixel art:', error);
      }
    };

    fetchPixelArt();
  }, [selectedSize]);

  const renderPixelGrid = (pixelData) => {
    // Filter pixel art based on the selected size
    const filteredPixelArt = pixelData.filter((art) => art.size === selectedSize);

    return (
      <div className="new-pixel-art-gallery">
        {filteredPixelArt.map((art) => (
          <div key={art.art_id} className="new-pixel-art-item">
            <h3>{art.name}</h3>
            <p>Creation Date: {art.creation_date}</p>
            <div className="new-pixel-grid">
              {art.pixel_data.map((row, rowIndex) => (
                <div key={rowIndex} className="new-pixel-row">
                  {row.map((color, colIndex) => (
                    <div
                      key={colIndex}
                      className="new-pixel"
                      style={{ backgroundColor: color || '#FFFFFF' }}
                    ></div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2>New Pixel Art Gallery</h2>
      <label htmlFor="size">Select Size:</label>
      <select
        id="size"
        value={selectedSize}
        onChange={(e) => setSelectedSize(e.target.value)}
      >
        <option value="16x16">16x16</option>
        <option value="32x32">32x32</option>
        <option value="64x64">64x64</option>
      </select>

      {renderPixelGrid(pixelArt)}
    </div>
  );
};

export default NewPixelArtGallery;