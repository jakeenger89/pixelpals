import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const AccountArt = () => {
  const [userArt, setUserArt] = useState([]);

  useEffect(() => {
    const fetchUserArt = async () => {
      try {
        const authToken = localStorage.getItem('yourAuthToken');
        if (!authToken) {
          console.error('Authentication token not found');
          return;
        }

        const decodedToken = JSON.parse(atob(authToken.split('.')[1]));
        const { account: { account_id } } = decodedToken;

        const userArtResponse = await fetch(`http://localhost:8000/api/userart/${account_id}`);
        if (userArtResponse.ok) {
          const userArtData = await userArtResponse.json();
          setUserArt(userArtData);
        } else {
          console.error('Failed to fetch user art');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUserArt();
  }, []);

  return (
    <div>
      <h2>Your Pixel Art Gallery</h2>
      <div className="new-pixel-art-gallery">
        {userArt.map((art, index) => (
          <div key={index} className="new-pixel-art-item">
            {/* Create a Link for each art's name */}
            <Link to={`/pixelart/${art.art_id}`}>
              <h3>{art.name}</h3>
            </Link>
            <p>Creation Date: {new Date(art.creation_date).toLocaleDateString()}</p>
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
    </div>
  );
};

export default AccountArt;