import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';

export default function Signup(props) {
  const { handleSubmit, setAuthDisplay, setDisplayLogin } = props;

  // const [isLandlord, setIsLandlord] = useState(false);
  const [formData, setFormData] = useState({
    // isLandlord: isLandlord,
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    email: '',
  });

  const formStyle = {
    // marginTop: 8,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const inputButtonStyle = {
    marginBottom: '10px',
  };

  return (
    <>
      <Box
        sx={formStyle}
        component="form"
        onSubmit={(e) => handleSubmit(e, { ...formData }, false)}
        noValidate>
        <h3>Signup</h3>
        {/* <div>
          <Button variant='contained' onClick={() => setIsLandlord(false)}>
            Tenant
          </Button>
          <Button variant='contained' onClick={() => setIsLandlord(true)}>
            Landlord
          </Button>
        </div> */}
        <TextField
          sx={inputButtonStyle}
          id='outlined-basic'
          label='First Name'
          variant='outlined'
          onChange={(event) =>
            setFormData({ ...formData, firstname: event.target.value })
          }
        />
        <TextField
          sx={inputButtonStyle}
          id='outlined-basic'
          label='Last Name'
          variant='outlined'
          onChange={(event) =>
            setFormData({ ...formData, lastname: event.target.value })
          }
        />
        <TextField
          sx={inputButtonStyle}
          id='outlined-basic'
          label='username'
          variant='outlined'
          onChange={(event) =>
            setFormData({ ...formData, username: event.target.value })
          }
        />
        <TextField
          sx={inputButtonStyle}
          id='outlined-basic'
          label='Email'
          variant='outlined'
          onChange={(event) =>
            setFormData({ ...formData, email: event.target.value })
          }
        />
        <TextField
          sx={inputButtonStyle}
          id='outlined-basic'
          label='Password'
          type='password'
          variant='outlined'
          onChange={(event) =>
            setFormData({ ...formData, password: event.target.value })
          }
        />
        <Button variant='contained' type='submit' sx={inputButtonStyle}>
          Signup
        </Button>
        <Link className='linkButton'
          sx={{
            color: 'blueviolet',
            textDecoration: 'underline',
            mb: 1,
          }}
          onClick={() => setDisplayLogin(true)}>
          Already have an account? Login.
        </Link>
        <Button
          variant='contained'
          size='small'
          sx={{ textTransform: 'none' }}
          onClick={() => setAuthDisplay(false)}
        >
          Continue without logging in
        </Button>
      </Box>
    </>
  );
}
