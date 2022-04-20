import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
// import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function Signup(props) {
  const { handleSubmit, setAuthDisplay, setDisplayLogin } = props;

  const [isLandlord, setIsLandlord] = useState(false);
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
  });
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordError, setPasswordError] = useState('');

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

  useEffect(() => {
    if (formData.confirmPassword.length === 0) return;
    if (formData.password !== formData.confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  }, [formData.password, formData.confirmPassword]);

  useEffect(() => {
    if (formData.password.length > 0 && formData.password.length < 8) {
      setPasswordError('Must be 8 characters');
    } else {
      setPasswordError('');
    }
  }, [formData.password]);

  function validateEmail(email) {
    const res = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return res.test(String(email).toLowerCase());
  }

  return (
    <>
      <Box
        sx={formStyle}
        component="form"
        onSubmit={(e) => handleSubmit(e, { ...formData, isLandlord }, false)}
        noValidate>
        <h3>Signup</h3>
        <TextField
          fullWidth
          sx={inputButtonStyle}
          id='first'
          label='First Name'
          variant='outlined'
          value={formData.firstname}

          onChange={(event) =>
            setFormData({ ...formData, firstname: event.target.value })
          }
        />
        <TextField
          fullWidth
          sx={inputButtonStyle}
          id='last'
          label='Last Name'
          variant='outlined'
          value={formData.lastname}
          onChange={(event) =>
            setFormData({ ...formData, lastname: event.target.value })
          }
        />
        <TextField
          fullWidth
          sx={inputButtonStyle}
          id='username'
          label='username'
          variant='outlined'
          value={formData.userName}
          onChange={(event) =>
            setFormData({ ...formData, username: event.target.value })
          }
        />
        <TextField
          fullWidth
          sx={inputButtonStyle}
          id='email'
          label='Email'
          type='email'
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
          variant='outlined'
          value={formData.email}
          onChange={(event) =>
            setFormData({ ...formData, email: event.target.value })
          }
        />
        <TextField
          fullWidth
          sx={inputButtonStyle}
          id='password'
          label='Password'
          type='password'
          variant='outlined'
          value={formData.password}
          error={passwordError !== ''}
          helperText={passwordError}
          onChange={(event) => {
            setFormData({ ...formData, password: event.target.value });
          }}
        />
        <TextField
          fullWidth
          sx={inputButtonStyle}
          id='confirm-password'
          label='Confirm Password'
          type='password'
          variant='outlined'
          value={formData.confirmPassword}
          error={confirmPasswordError !== ''}
          helperText={confirmPasswordError}
          onChange={(event) => {
            setFormData({ ...formData, confirmPassword: event.target.value });
          }}
        />
        <FormControl fullWidth>
          <InputLabel id="role-input-label">Role</InputLabel>
          <Select
            sx={inputButtonStyle}
            labelId="role-label"
            id="role"
            value={isLandlord}
            label="role"
            onChange={(event) =>
              setIsLandlord(event.target.value)
            }
          >
            <MenuItem value={true}>Landlord</MenuItem>
            <MenuItem value={false}>Tenant</MenuItem>
          </Select>
        </FormControl>
        <Button variant='contained' type='submit' sx={inputButtonStyle}>
          Signup
        </Button>
        <div className='linkButton' onClick={() => setDisplayLogin(true)}>
          Already have an account? Login.
        </div>
        <button className='exitButton' onClick={() => setAuthDisplay(false)}>
          Continue without logging in
        </button>
      </Box>
    </>
  );
}
