import { NavLink, useNavigate } from "react-router-dom";

function Nav({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("yourAuthToken");
    if (onLogout) {
      onLogout();
    }
    navigate("/loginform");
    window.location.reload()
  };
  return (
    <nav className="nav">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          <img src="" alt="Logo" className="navbar-logo"/>
        </NavLink>
        <NavLink className={"navbar-brand"} to="/pixelartgallery">
          Pixel Art Gallery
        </NavLink>
        {!isAuthenticated && (
          <NavLink className="navbar-brand" to="/signupform">
            Sign Up
          </NavLink>
        )}
        {isAuthenticated && (
            <NavLink className={"navbar-brand"} to="/createpixelart">
            Create Art
            </NavLink>
        )}
        {isAuthenticated && (
          <NavLink className={"navbar-brand"} to="/account">
            My Profile
          </NavLink>
        )}
        {!isAuthenticated && (
          <NavLink className="navbar-brand" to="/loginform">
            Login
          </NavLink>
        )}
        {isAuthenticated && (
          <button className="navbar-brand logout-button" onClick={handleLogout}>
          Logout
        </button>
        )}
      </div>
    </nav>
  );
}

export default Nav;
