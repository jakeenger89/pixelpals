import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './PixelArtGallery.css'; // Update the CSS import

const NewPixelArtGallery = () => {
  const [selectedSize, setSelectedSize] = useState('16x16');
  const [pixelArt, setPixelArt] = useState([]);
  const [account_id, setAccountId] = useState(null);
  const [likes, setLikes] = useState({});

  useEffect(() => {
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

    fetchPixelArt();
    fetchLikes();  // Add this line to fetch likes data
  }, [selectedSize]);

  useEffect(() => {
    const storedToken = localStorage.getItem('yourAuthToken');
    if (storedToken) {
      const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
      const { account: { account_id } } = decodedToken;
      setAccountId(account_id);
    }
  }, []);

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
      } else {
        console.error('Failed to unlike the pixel art');
      }
    } catch (error) {
      console.error('Error unliking pixel art:', error);
    }
  };

  const renderPixelGrid = (pixelData) => {
    const filteredPixelArt = pixelData.filter((art) => art.size === selectedSize);
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
            {account_id && (
              <>
                <button className="btn-like" onClick={() => handleLike(art.art_id)}>
                  Like
                </button>
                <button className="btn-unlike" onClick={() => handleUnlike(art.art_id)}>
                  Unlike
                </button>
                <p>Likes: {likes[art.art_id] || 0}</p>
              </>
            )}
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