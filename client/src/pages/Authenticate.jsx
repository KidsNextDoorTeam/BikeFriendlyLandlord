import React, { useState, useContext } from 'react';
import axios from 'axios';

import Login from '../components/Login';
import Signup from '../components/Signup';
import { useAuth } from '../hooks/authContext';
import { useNavigate, useLocation } from 'react-router-dom';

export function Authenticate(props) {
  const { setAuthDisplay, position } = props;
  const [displayLogin, setDisplayLogin] = useState(true);
  const [loginError, setLoginError] = useState(false);
  const [loginErrorMessage, setLoginErrorMessage] = useState('');

  const auth = useAuth();
  const { setUser } = auth; 
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(event, data, isLogin = true) {
    event.preventDefault();
    try {
      const { status, data: user } = await axios.post(`/auth/${isLogin ? 'login' : 'signup'}`, {
        ...data,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      });

      if (status === 200) {
        setUser(user.user);
        setAuthDisplay(false);
        if (isLogin && location.state?.path) {
          navigate(location.state.path);
        }
      } else {
        console.error('status not 200 in handle submit --> ', data);
      }
    } catch (error) {
      if (error?.response?.status === 401 && isLogin) {
        setLoginError(true);
        // TODO: Can we get more specific
        setLoginErrorMessage('Username or password is not correct.');
      } else {
        console.error('Error from hadleSubmit --> ', error);
      }

    }
  }

  return (
    <div id="loginSignup" style={position}>
      {displayLogin && (
        <Login
          loginErrorMessage={loginErrorMessage}
          loginError={loginError}
          handleSubmit={handleSubmit}
          setAuthDisplay={setAuthDisplay}
          setDisplayLogin={setDisplayLogin}
        />
      )}
      {!displayLogin && (
        <Signup
          handleSubmit={handleSubmit}
          setAuthDisplay={setAuthDisplay}
          setDisplayLogin={setDisplayLogin}
        />
      )}
    </div>
  );
}
