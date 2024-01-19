import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PixelArtGallery.css';

const NewPixelArtGallery = () => {
  const [selectedSize, setSelectedSize] = useState('16x16');
  const [pixelArt, setPixelArt] = useState([]);
  const [account_id, setAccountId] = useState(null);
  const [likes, setLikes] = useState({});
  const [likeStatus, setLikeStatus] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

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

  const fetchLikes = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/likes');
      if (response.ok) {
        const likesData = await response.json();
        setLikes(likesData);
      } else {
        console.error('Error fetching likes:', response);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('yourAuthToken');
    if (storedToken) {
      const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
      const { account: { account_id } } = decodedToken;
      setAccountId(account_id);
    }

    fetchPixelArt();
  }, [selectedSize, account_id]);

  useEffect(() => {
    const fetchLikeStatusOnce = async () => {
      if (account_id && pixelArt.length > 0) {
        const statuses = {};
        await Promise.all(
          pixelArt.map(async (art) => {
            try {
              const response = await fetch(
                `http://localhost:8000/api/likes/check?account_id=${account_id}&art_id=${art.art_id}`
              );
              if (response.ok) {
                const likeStatusData = await response.json();
                statuses[art.art_id] = likeStatusData.hasLiked;
              } else {
                console.error('Error checking like status:', response);
                statuses[art.art_id] = false;
              }
            } catch (error) {
              console.error('Error checking like status:', error);
              statuses[art.art_id] = false;
            }
          })
        );
        setLikeStatus(statuses);
      }
    };

    fetchLikeStatusOnce(); // Fetch like status once during initial page load
  }, [account_id, pixelArt, likes]);

  const handleLike = async (artId) => {
    try {
      if (!account_id) {
        console.error('User not authenticated');
        return;
      }

      const response = await fetch(`http://localhost:8000/api/art/${artId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          account_id: account_id,
          art_id: artId,
        }),
      });

      if (response.ok) {
        setLikes((prevLikes) => ({ ...prevLikes, [artId]: (prevLikes[artId] || 0) + 1 }));
        setLikeStatus((prevStatus) => ({ ...prevStatus, [artId]: true }));
      } else {
        console.error('Failed to like the pixel art');
      }
    } catch (error) {
      console.error('Error liking pixel art:', error);
    }
  };

  const handleUnlike = async (artId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/art/${artId}/dislike`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account_id: account_id,
          art_id: artId,
        }),
      });

      if (response.ok) {
        setLikes((prevLikes) => ({ ...prevLikes, [artId]: Math.max((prevLikes[artId] || 0) - 1, 0) }));
        setLikeStatus((prevStatus) => ({ ...prevStatus, [artId]: false }));
      } else {
        console.error('Failed to unlike the pixel art');
      }
    } catch (error) {
      console.error('Error unliking pixel art:', error);
    }
  };

  const renderPixelGrid = () => {
    const gridClassName = `new-pixel-grid${selectedSize === '32x32' ? '-32' : selectedSize === '64x64' ? '-64' : ''}`;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return (
      <div className="new-pixel-art-gallery">
        {pixelArt
          .filter((art) => art.size === selectedSize)
          .slice(startIndex, endIndex)
          .map((art) => (
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
              {account_id && (
                <div>
                  {likeStatus[art.art_id] !== undefined && likeStatus[art.art_id] ? (
                    <button className="btn-unlike" onClick={() => handleUnlike(art.art_id)}>
                      Unlike
                    </button>
                  ) : (
                    <button className="btn-like" onClick={() => handleLike(art.art_id)}>
                      Like
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        {/* Pagination controls */}
        <div>
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            Previous Page
          </button>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={endIndex >= pixelArt.length}
          >
            Next Page
          </button>
        </div>
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

      {renderPixelGrid()}
    </div>
  );
};

export default NewPixelArtGallery;