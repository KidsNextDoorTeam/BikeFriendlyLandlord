import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Login } from './Login.jsx';
import { Signup } from './Signup.jsx';


export function Authenticate(props) {
  const { setAuthDisplay, setIsLoggedIn } = props;

  function handleSubmit(source, data) {
    event.preventDefault();
    fetch(`/auth/${source}`, {
      method: 'POST',
      body: JSON.stringify(data),
      // Adding headers to the request
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => {
        if (res.status === 200) {
          setIsLoggedIn(true);
          setAuthDisplay(false);
        } else {
          console.log('status not 200 in handle submit --> ', res);
        }
      })
      .catch((err) => {
        console.log('Error from hadleSubmit --> ', err);
      });
  }

  return (
    <div id="loginSignup">
      <Routes>
        <Route
          path="/"
          element={
            <Login
              handleSubmit={handleSubmit}
              setAuthDisplay={setAuthDisplay}
            />
          }
        />
        <Route
          path="signup"
          element={
            <Signup
              handleSubmit={handleSubmit}
              setAuthDisplay={setAuthDisplay}
            />
          }
        />
      </Routes>
    </div>
  );
}
