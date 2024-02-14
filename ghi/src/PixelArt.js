import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PixelArt.css';

const PixelArt = () => {
  const { art_id } = useParams();
  const [pixelArt, setPixelArt] = useState(null);
  const [username, setUsername] = useState(null);
  const [hoverColor, setHoverColor] = useState(null);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const [likes, setLikes] = useState(null);
  const [likeStatus, setLikeStatus] = useState(null);

  useEffect(() => {
    const fetchPixelArt = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/pixel_art/${art_id}`);
        if (response.ok) {
          const data = await response.json();
          setPixelArt(data);

          const userResponse = await fetch(`http://localhost:8000/api/account/${data.account_id}`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUsername(userData.username);

            const storedToken = localStorage.getItem("yourAuthToken");
            const userIsLoggedIn = Boolean(storedToken);

            if (storedToken) {
              const decodedToken = atob(storedToken.split('.')[1]);
              const parsedToken = JSON.parse(decodedToken);
            }

            if ('account_id' in userData) {
              if (userIsLoggedIn && userData.account_id === data.account_id) {
                setIsLoggedInUser(true);
              }
            } else {
              console.error("User Data does not contain 'id' property");
            }
          } else {
            console.error('Error fetching user data:', userResponse);
          }
        } else {
          console.error('Error fetching pixel art:', response);
        }
      } catch (error) {
        console.error('Error fetching pixel art:', error);
      }
    };

    fetchPixelArt();
  }, [art_id]);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/likes');
        if (response.ok) {
          const likesData = await response.json();
          setLikes(likesData[art_id] || 0);
        } else {
          console.error('Error fetching likes:', response);
        }
      } catch (error) {
        console.error('Error fetching likes:', error);
      }
    };

    fetchLikes();
  }, [art_id]);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const storedToken = localStorage.getItem("yourAuthToken");
        if (storedToken) {
          const decodedToken = atob(storedToken.split('.')[1]);
          const parsedToken = JSON.parse(decodedToken);
          const account_id = parsedToken.account.account_id;
          const response = await fetch(`http://localhost:8000/api/likes/check?account_id=${account_id}&art_id=${art_id}`);
          if (response.ok) {
            const likeStatusData = await response.json();
            setLikeStatus(likeStatusData.hasLiked);
          } else {
            console.error('Error fetching like status:', response);
          }
        }
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchLikeStatus();
  }, [art_id]);

  const handleLike = async () => {
    try {
      const storedToken = localStorage.getItem("yourAuthToken");
      if (storedToken) {
        const decodedToken = atob(storedToken.split('.')[1]);
        const parsedToken = JSON.parse(decodedToken);
        const account_id = parsedToken.account.account_id;
        const response = await fetch(`http://localhost:8000/api/art/${art_id}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            account_id: account_id,
            art_id: art_id,
          }),
        });

        if (response.ok) {
          setLikes((prevLikes) => prevLikes + 1);
          setLikeStatus(true);
        } else {
          console.error('Failed to like the pixel art');
        }
      }
    } catch (error) {
      console.error('Error liking pixel art:', error);
    }
  };

  const handleUnlike = async () => {
    try {
      const storedToken = localStorage.getItem("yourAuthToken");
      if (storedToken) {
        const decodedToken = atob(storedToken.split('.')[1]);
        const parsedToken = JSON.parse(decodedToken);
        const account_id = parsedToken.account.account_id;
        const response = await fetch(`http://localhost:8000/api/art/${art_id}/dislike`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            account_id: account_id,
            art_id: art_id,
          }),
        });

        if (response.ok) {
          setLikes((prevLikes) => Math.max(prevLikes - 1, 0));
          setLikeStatus(false);
        } else {
          console.error('Failed to unlike the pixel art');
        }
      }
    } catch (error) {
      console.error('Error unliking pixel art:', error);
    }
  };

  const renderLikeButton = () => {
    if (likeStatus === null) {
      return null;
    }
    if (likeStatus) {
      return <button className="btn-unlike" onClick={handleUnlike}>Unlike</button>;
    } else {
      return <button className="btn-like" onClick={handleLike}>Like</button>;
    }
  };

  const handlePixelHover = (color) => {
    setHoverColor(color);
  };

  const handlePixelLeave = () => {
    setHoverColor(null);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/pixel_art/${art_id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Pixel art deleted successfully');
        window.location.href = '/accountart';
      } else {
        console.error('Failed to delete pixel art:', response);
      }
    } catch (error) {
      console.error('Error deleting pixel art:', error);
    }
  };

  const renderPixelGrid = () => {
    if (!pixelArt) {
      return null;
    }
    const gridSize = pixelArt.size === '32x32' ? 'pixel-grid-32' : pixelArt.size === '64x64' ? 'pixel-grid-64' : 'pixel-grid';

    return (
      <div className={gridSize}>
        {pixelArt.pixel_data.map((row, rowIndex) => (
          <div key={rowIndex} className="pixel-row">
            {row.map((color, colIndex) => (
              <div
                key={colIndex}
                className="pixel"
                style={{ backgroundColor: color || '#FFFFFF' }}
                onMouseEnter={() => handlePixelHover(color)}
                onMouseLeave={handlePixelLeave}
              ></div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h2 className="pixel-art-details">{pixelArt ? pixelArt.name : 'Loading...'}</h2>
      <p className="pixel-art-details">Creation Date: {pixelArt ? new Date(pixelArt.creation_date).toLocaleDateString() : ''}</p>
      <div className="pixel-grid-container">
        {renderPixelGrid()}
      </div>
      <div className="like-container">
        <p className="pixel-art-details">Created by: {username}</p>
        {renderLikeButton()}
      </div>
      <p className="pixel-art-details">Total Likes: {likes}</p>
      {isLoggedInUser && (
        <button onClick={handleDelete}>Delete Art</button>
      )}
      {hoverColor && (
        <p className="pixel-art-details">Hovered Color: {hoverColor}</p>
      )}
    </div>
  );
};

export default PixelArt;