import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

  const getUsername = async (account_id) => {
    try {
      const userResponse = await fetch(`http://localhost:8000/api/account/${account_id}`);
      if (userResponse.ok) {
        const userData = await userResponse.json();
        return userData.username;
      } else {
        console.error('Error fetching user data:', userResponse);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

const renderPixelGrid = (pixelData) => {
  // Filter pixel art based on the selected size
  const filteredPixelArt = pixelData.filter((art) => art.size === selectedSize);
  // set the grid size and shape depending on selected size
  let gridClassName;

  if (selectedSize === '32x32') {
    gridClassName = 'new-pixel-grid-32';
  } else if (selectedSize === '64x64') {
    gridClassName = 'new-pixel-grid-64';
  } else {
    gridClassName = 'new-pixel-grid';
  }

  return (
    <div className="new-pixel-art-gallery">
      {filteredPixelArt.map((art) => (
        <div key={art.art_id} className="new-pixel-art-item">
          <Link to={`/pixelart/${art.art_id}`}>
            <h3>{art.name}</h3>
          </Link>
          <p>Creation Date: {new Date(art.creation_date).toLocaleDateString()}</p>
          <div className={gridClassName}>
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
          <UsernameFetcher account_id={art.account_id} />
        </div>
      ))}
    </div>
  );
};

  const UsernameFetcher = ({ account_id }) => {
    const [username, setUsername] = useState(null);

    useEffect(() => {
      const fetchUsername = async () => {
        const fetchedUsername = await getUsername(account_id);
        setUsername(fetchedUsername);
      };

      fetchUsername();
    }, [account_id]);

    return <p>Created by: {username}</p>;
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