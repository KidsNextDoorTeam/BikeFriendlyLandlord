import React, { useContext, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Button } from '@mui/material';
import Avatar from '@mui/material/Avatar';

import { Authenticate } from '../pages/Authenticate';
import UserContext from '../hooks/userContext';
import { navBarAvatar } from '../common/styling';

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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {user.profile_pic ? <Avatar
              alt="User picture"
              src={`/images/${user.profile_pic}`}
              sx={{ width: 35, height: 35, marginRight: '15px' }}
            /> : <Avatar alt="User picture" {...navBarAvatar(`${user.first_name} ${user.last_name}`)} />}
            <Link to={`/profile/${user?.username}`}>My Account</Link>
            <Button
              variant="text"
              sx={{
                fontFamily: 'Nunito',
                color: '#666',
                '&:hover': { backgroundColor: 'rgba(253, 143, 124, 0.577)' },
              }}
              style={{
                paddingTop: '8px',
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
