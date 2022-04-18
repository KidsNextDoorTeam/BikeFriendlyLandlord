import React, { useContext, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Button } from '@mui/material';

import { Authenticate } from '../pages/Authenticate';
import UserContext from '../hooks/userContext';

export function Navbar() {
  const { user, setUser } = useContext(UserContext);
  const [authDisplay, setAuthDisplay] = useState(false);
  const navigate = useNavigate();

  const [authPosition, setAuthPosition] = useState({
    top: '',
    left: '',
  });

  async function logout(event) {
    event.preventDefault();
    try {
      const { status } = await axios.post('/auth/logout');
      if (status === 200) {
        setUser(null);
        navigate('/');
      }
    } catch (err) {
      console.error(err);
    }
  }

  function toggleAuthDisplay(e) {
    // FIXME: Should this just be a fixed position
    const top = e.pageY + 30;
    const left = e.pageX - 250;
    if (authDisplay) setAuthDisplay(false);
    else {
      setAuthDisplay(true);
      setAuthPosition({
        top: `${top}px`,
        left: `${left}px`,
      });
    }
  }

  const activeStyle = {
    color: 'tomato',
  };

  return (
    <div id="navBar">
      <div className="navBarLeft">
        <div id="logo">BFL</div>
      </div>
      <div className="navBarCenter">
        <ul className="navBarListItems">
          <li className="navBarListItem">
            <NavLink
              to="/"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}>
              Home
            </NavLink>
          </li>
          <li className="navBarListItem">
            <NavLink
              to="/search"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}>
              Search
            </NavLink>
          </li>
          <li className="navBarListItem">
            <NavLink
              to="/map"
              style={({ isActive }) => (isActive ? activeStyle : undefined)}>
              Map
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="navBarRight">
        {!user && (
          <Button
            sx={{
              fontFamily: 'Nunito',
              color: '#666',
              '&:hover': { backgroundColor: 'rgba(253, 143, 124, 0.577)' },
            }}
            variant="text"
            onClick={(e) => {
              toggleAuthDisplay(e);
            }}>
            Login/Signup
          </Button>
        )}
        {user && (
          <div>
            <Link to={`/profile/${user?.username}`}>My Account</Link>
            <Button
              variant="text"
              sx={{
                fontFamily: 'Nunito',
                color: '#666',
                '&:hover': { backgroundColor: 'rgba(253, 143, 124, 0.577)' },
              }}
              onClick={logout}>
              Log Out
            </Button>
          </div>
        )}
        {authDisplay && (
          <Authenticate
            setAuthDisplay={setAuthDisplay}
            position={authPosition}
          />
        )}
      </div>
    </div>
  );
}
