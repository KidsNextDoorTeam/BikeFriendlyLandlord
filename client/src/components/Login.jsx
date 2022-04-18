import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
// import { InputAdornment, IconButton } from "@material-ui/core";
// import Visibility from "@material-ui/icons/Visibility";
// import VisibilityOff from "@material-ui/icons/VisibilityOff";
// import Typography from '@mui/material/Typography';

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
          id="outlined-basic"
          label="Username"
          variant="outlined"
          onChange={(event) => setUsername(event.target.value)}
          value={username}
          sx={{ mb: 2 }}
        />
        <TextField
          id="outlined-basic"
          label="Password"
          variant="outlined"
          type="password"
          error={loginError}
          helperText={loginErrorMessage}
          onChange={(event) => setPassword(event.target.value)}
          value={password}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" type="submit" sx={{ mb: 2 }}>
          Login
        </Button>
        <div className="linkButton" onClick={() => setDisplayLogin(false)}>
          Need an account? Signup
        </div>
        <button className="exitButton" onClick={() => setAuthDisplay(false)}>
          Continue without logging in
        </button>
      </Box>
    </>
  );
}
