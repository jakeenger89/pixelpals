import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const Account = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [username] = useState('');
  const [account_id, setAccountId] = useState(null);
  const [currentUser, setCurrentUser] = useState('');

  const handleEditClick = () => {
    navigate('/edit-account', {
      state: {
        userData: {
          username,
        },
      },
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authToken = localStorage.getItem('yourAuthToken');

        if (authToken) {
          const decodedToken = JSON.parse(atob(authToken.split('.')[1]));
          const { account: { account_id } } = decodedToken;

          if (account_id) {
            setAccountId(account_id);

            const userDataResponse = await fetch(`http://localhost:8000/api/account/${account_id}`);
            if (userDataResponse.ok) {
              const userData = await userDataResponse.json();
              setCurrentUser(userData);
            } else {
              console.error('Failed to fetch user data');
            }
          } else {
            console.error('Account ID is null or undefined');
          }
        } else {
          console.error('Authentication token not found');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="profile">
      <div className="container">
        {/* Display user banner image if available */}
        {currentUser.banner_url && <img src={currentUser.banner_url} alt="banner" className="banner-image" />}

        {/* Display user full name if available */}
        {currentUser.first_name && currentUser.last_name && (
          <h4 className="name-text">{currentUser.first_name} {currentUser.last_name}</h4>
        )}

        {/* Display user profile image if available */}
        {currentUser.profile_picture_url && (
          <img src={currentUser.profile_picture_url} alt="Profile" className="profile-image" />
        )}

        {/* Edit Profile button */}
        <button onClick={handleEditClick} className="edit-profile-button">
          Edit Profile
        </button>
      </div>

      {/* Navigation Link to Pixel Art Gallery */}
      <div className="row">
        <div className="offset-8 col-4">
          <div className="shadow p-4 mt-4">
            <div className="welcome-link">
              <h1>Welcome {currentUser.username}, to Pixel Pals!</h1>
              <hr className="full-width-line" />
              <Link to="/accountart">{currentUser.username}'s Pixel Art Gallery</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;