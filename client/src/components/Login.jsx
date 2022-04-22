import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';

export default function Login(props) {
  const { handleSubmit, setAuthDisplay, setDisplayLogin, loginError, loginErrorMessage } = props;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const formStyle = {
    // marginTop: 8,
    backgroundColor: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  return (
    <>
      <Box
        sx={formStyle}
        component="form"
        onSubmit={(e) =>
          handleSubmit(e, { username: username, password: password }, true)
        }
        noValidate>
        <h3>Login</h3>
        <TextField
          id='username'
          label='Username'
          variant='outlined'
          onChange={(event) => setUsername(event.target.value)}
          value={username}
          sx={{ mb: 2 }}
        />
        <TextField
          id='password'
          label='Password'
          variant='outlined'
          type='password'
          error={loginError}
          helperText={loginErrorMessage}
          onChange={(event) => setPassword(event.target.value)}
          value={password}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" type="submit" sx={{ mb: 2 }}>
          Login
        </Button>
        <Link className='linkButton'
          sx={{
            color: 'blueviolet',
            textDecoration: 'underline',
            mb: 1,
          }}
          onClick={() => setDisplayLogin(false)}>
          Need an account? Signup
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
