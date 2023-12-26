import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";

const AccountForm = ({ setIsAuthenticated, setUserId }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    const data = { username: email, password };
    setLoginError('')

    try {
      const response = await fetch(`http://localhost:8000/token`, {
        method: "POST",
        body: new URLSearchParams(data),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      if (response.ok) {
        // Parse the response to get the authentication token
        const { access_token, account_id } = await response.json();

        // Store the authentication token in localStorage
        localStorage.setItem("yourAuthToken", access_token);
        console.log("Token stored:", access_token);

        // Update the authentication status in App component
        setIsAuthenticated(true);

        // Save authentication status in localStorage
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userId", account_id);

        // Use navigate to redirect without a full page reload
        navigate("/account");
        setUserId(account_id);

        // Optionally, you can clear the form fields or perform other actions
        setEmail("");
        setPassword("");
      } else {
        // Handle login failure
        setLoginError("Cannot find username & password")
        const timer = setTimeout(() => {
                setLoginError('');
            }, 5000)
            return () => clearTimeout(timer)
      }
    } catch (error) {
      // Handle fetch error
      setLoginError("An error occured while logging in")
    }
  }

  return (
    <MDBContainer fluid className="h-100" style={{ height: '100vh'}}>
      <MDBRow className="d-flex justify-content-center align-items-center h-100">
        <MDBCol md="10" lg="6" className="d-flex align-items-center justify-content-center">
          <img src="https://i.imgur.com/oGvU6bt.png" alt="Login" className="img-fluid" style={{ borderRadius: "50px", marginRight: "70px" }}/>
        </MDBCol>
        <MDBCol md="10" lg="6" className="d-flex flex-column align-items-center">
          <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4" style={{ color: 'white' }}>Login</p>
          {loginError && <div className="alert" role="alert" style={{ color: 'red' }} >{loginError}</div>}
          <div className="d-flex flex-row align-items-center mb-4">
            <MDBIcon fas icon="envelope me-3" size="lg" />
            <MDBInput id="form2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"/>
          </div>
          <div className="d-flex flex-row align-items-center mb-4">
            <MDBIcon fas icon="lock me-3" size="lg" />
            <MDBInput id="form3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
          </div>
          <MDBBtn className="mb-4" size="lg" onClick={handleSubmit} style={{ backgroundColor: 'aqua', color: 'black'}}>
            Login
          </MDBBtn>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default AccountForm;
