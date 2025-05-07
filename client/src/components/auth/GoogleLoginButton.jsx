import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { checkAuth, googleLogin } from '@/store/auth-slice';

const GoogleLoginButton = () => {
  const dispatch = useDispatch();

  const handleSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;  // This is the ID token (JWT)

      dispatch(googleLogin(credential)).then(() => {
        dispatch(checkAuth());
      });
      
    } catch (err) {
      console.error('Google login error:', err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log('Google Login Failed')}
    />
  );
};

export default GoogleLoginButton;
