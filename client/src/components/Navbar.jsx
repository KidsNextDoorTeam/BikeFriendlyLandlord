import React, { useContext, useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { Button } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import MapIcon from '@mui/icons-material/Map';
import Avatar from '@mui/material/Avatar';

import { useAuth } from '../hooks/authContext';
import { Authenticate } from '../pages/Authenticate';
import { navBarAvatar } from '../common/styling';
// import Chat from "./chatbot/chat.jsx"

export function Navbar() {
  const auth = useAuth();
  const {user, setUser} = auth;
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
        navigate('/');
        // Clear user after navigate to prevent login alert from flashing after redirect
        setUser(null);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function toggleAuthDisplay(e) {
    // FIXME: Should this just be a fixed position. Doesn't account for screen resizes
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

  const defaultStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  const setActiveStyle = ({ isActive }) => ({
    ...defaultStyle,
    color: (isActive ? 'tomato' : undefined),
  });


  return (
    <div id='navBar'>
      <div className='navBarLeft'>
        <div id='logo'>BFL</div>
      </div>
      <div className='navBarCenter'>
        <ul className='navBarListItems'>
          <li className='navBarListItem'>
            <NavLink
              // endIcon={}
              to='/'
              style={setActiveStyle}
            >
              <HomeIcon sx={{ mx: 1 }} /> Home
            </NavLink>
          </li>
          <li className='navBarListItem'>
            <NavLink
              to='/search'
              style={setActiveStyle}
            >
              <SearchIcon sx={{ mx: 1 }} /> Search
            </NavLink>
          </li>
          <li className='navBarListItem'>
            <NavLink
              to='/map'
              style={setActiveStyle}
            >
              <MapIcon sx={{ mx: 1 }} /> Map
            </NavLink>
          </li>
          {/* <Chat /> */}
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
            variant='text'
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
              variant='text'
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
