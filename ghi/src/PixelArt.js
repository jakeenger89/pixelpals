import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './PixelArt.css';

const PixelArt = () => {
  const { art_id } = useParams();
  const [pixelArt, setPixelArt] = useState(null);
  const [username, setUsername] = useState(null);
  const [hoverColor, setHoverColor] = useState(null);
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);

  useEffect(() => {
    const fetchPixelArt = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/pixel_art/${art_id}`);
        if (response.ok) {
          const data = await response.json();
          setPixelArt(data);

          // Fetch and set the username separately
          const userResponse = await fetch(`http://localhost:8000/api/account/${data.account_id}`);
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUsername(userData.username);

            // Check if the current user is the owner of the pixel art
            const storedToken = localStorage.getItem("yourAuthToken");
            console.log("Stored Token:", storedToken);
            const userIsLoggedIn = Boolean(storedToken);

            if (storedToken) {
                const decodedToken = atob(storedToken.split('.')[1]); // Decode the token
                const parsedToken = JSON.parse(decodedToken);
                console.log("Decoded Token:", parsedToken);
            }

            console.log("User is logged in:", userIsLoggedIn);
            console.log("Pixel art owner ID:", data.account_id);

            // Log the entire userData object
            console.log("User Data:", userData);

            // Check if userData has the 'id' property
            if ('account_id' in userData) {
              console.log("Logged-in user ID:", userData.account_id);

              if (userIsLoggedIn && userData.account_id === data.account_id) {
                setIsLoggedInUser(true);
                console.log("User is the owner of the pixel art");
              } else {
                console.log("User is NOT the owner of the pixel art");
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
        // Optionally, you can handle success, e.g., redirect to another page or show a message
        console.log('Pixel art deleted successfully');
      } else {
        // Handle the case where the deletion was not successful
        console.error('Failed to delete pixel art:', response);
      }
    } catch (error) {
      console.error('Error deleting pixel art:', error);
    }
  };

  const renderPixelGrid = () => {
    // Determine the grid size based on the selected size
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

  if (!pixelArt) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2 className="pixel-art-details">{pixelArt.name}</h2>
      <p className="pixel-art-details">Creation Date: {new Date(pixelArt.creation_date).toLocaleDateString()}</p>
      <div className="">
        {renderPixelGrid()}
      </div>
      <p className="pixel-art-details">Created by: {username}</p>
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