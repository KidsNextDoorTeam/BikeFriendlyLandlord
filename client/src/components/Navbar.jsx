import { Button } from '@mui/material';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import MapIcon from '@material-ui/icons/Map';
import React, { useState } from 'react';
import '../index.css';
import { NavLink, Link } from 'react-router-dom';
import { Authenticate } from '../pages/Authenticate.jsx';
import Avatar from '@mui/material/Avatar';
import { navBarAvatar } from '../common/styling.js';
import Chat from "./chatbot/chat.jsx"


export function Navbar(props) {
  const {
    isLoggedIn,
    authDisplay,
    setAuthDisplay,
    setIsLoggedIn,
    setUserData,
    userData,
  } = props;

  const [authPosition, setAuthPosition] = useState({
    top: '',
    left: '',
  });

  function logout(event) {
    event.preventDefault();
    fetch(`/auth/logout`, {
      method: 'POST',
      // Adding headers to the request
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    })
      .then((res) => {
        if (res.status === 200) {
          // if successfully logged out, reset login state to false
          setIsLoggedIn(false);
          setAuthDisplay(false);
          setUserData({});
        } else {
          console.log('logout status not 200 -->', res);
        }
      })
      .then(() => window.location.replace('/'))
      .catch((err) => {
        console.log('Error from logout --> ', err);
      });
  }

  function toggleAuthDisplay(e) {
    const top = e.pageY + 30;
    const left = e.pageX - 250;
    if (authDisplay === true) setAuthDisplay(false);
    else {
      setAuthDisplay(true);
      setAuthPosition({
        top: `${top}px`,
        left: `${left}px`,
      });
    }
  }

  let activeStyle = {
    color: 'tomato',
  };

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
              style={({ isActive }) => (isActive ? activeStyle : undefined)}>
              Home <HomeIcon />
            </NavLink>
          </li>
          <li className='navBarListItem'>
            <NavLink
              to='/search'
              style={({ isActive }) => (isActive ? activeStyle : undefined)}>
              Search <SearchIcon />
            </NavLink>
          </li>
          <li className='navBarListItem'>
            <NavLink
              to='/map'
              style={({ isActive }) => (isActive ? activeStyle : undefined)}>
              Map <MapIcon />
            </NavLink>
          </li>
        <Chat />
        </ul>
      </div>
      <div className='navBarRight'>
        {!isLoggedIn && (
          <Button
            sx={{
              fontFamily: 'Nunito',
              color: '#666',
              '&:hover': { backgroundColor: 'rgba(253, 143, 124, 0.577)' },
            }}
            variant='text'
            onClick={(e) => {
              toggleAuthDisplay(e);
              // if (authDisplay === true) setAuthDisplay(false);
              // else setAuthDisplay(true);
            }}>
            Login/Signup
          </Button>
        )}
        {isLoggedIn && (
          <div style={{display:'flex', alignItems: 'center'}}>
            {userData.profile_pic ? <Avatar
              alt="User picture"
              src={`/images/${userData.profile_pic}`}
              sx={{ width: 35, height:35, marginRight: '15px' }}
            /> : <Avatar alt="User picture" {...navBarAvatar(`${userData.first_name} ${userData.last_name}`)}/> }
            <Link to={`/profile/${userData.username}`}>My Account</Link>
            <Button
              variant='text'
              sx={{
                fontFamily: 'Nunito',
                color: '#666',
                '&:hover': { backgroundColor: 'rgba(253, 143, 124, 0.577)' },
              }}
              onClick={(e) => logout(e)}>
              Log Out
            </Button>
          </div>
        )}
        {authDisplay && (
          <Authenticate
          setAuthDisplay={setAuthDisplay}
          setIsLoggedIn={setIsLoggedIn}
          setUserData={setUserData}
          position={authPosition}
          />
          )}
      </div>
    </div>
  );
}
