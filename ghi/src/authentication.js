import React from 'react';
import { Navigate } from 'react-router-dom';

const AuthenticatedRoute = ({ element, isAuthenticated }) => {
  return isAuthenticated ? element : <Navigate to="/loginform" />;
};

export default AuthenticatedRoute;