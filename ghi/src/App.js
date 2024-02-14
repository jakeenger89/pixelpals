import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import AuthenticatedRoute from "./authentication";
import Account from "./account";
import AccountArt from "./accountart";
import SignUpForm from "./SignUpForm";
import LoginForm from "./LoginForm";
import CreatePixelArt from "./CreatePixelArt";
import PixelArtGallery from "./PixelArtGallery";
import PixelArt from "./PixelArt";
import "./App.css";
import Nav from "./Nav";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("yourAuthToken"))
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("yourAuthToken");
    if (storedToken) {
      // You may want to validate the token on the server side as well
      setIsAuthenticated(true);
    }
  }, []);

  const domain = /https:\/\/[^/]+/;
  const basename = process.env.PUBLIC_URL.replace(domain, "");
  return (
    <BrowserRouter basename={basename}>
      <Nav isAuthenticated={isAuthenticated} />
      <div className="container">
        <Routes>
          <Route
            index
            path="/"
            element={isAuthenticated ? <Account /> : <LoginForm />}
          />
          <Route
          index
          path="/"
          element={isAuthenticated ? <Account /> : <LoginForm />}
          />
          <Route path="/createpixelart" element={<CreatePixelArt />}
          />
          <Route path="account/:account_id" element={<Account />} />
          <Route path="/pixelartgallery" element={<PixelArtGallery />} />
           <Route path="/pixelart/:art_id" element={<PixelArt />} />
           <Route path="/accountart" element={<AccountArt />} />
          <Route
            index
            path="account/*"
            element={
              <Account
                isAuthenticated={isAuthenticated}
                setIsAuthenticated={setIsAuthenticated}
              />
            }
          />
          <Route index path="signupform" element={<SignUpForm />} />
          <Route
            index
            path="loginform"
            element={<LoginForm setIsAuthenticated={setIsAuthenticated} />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;