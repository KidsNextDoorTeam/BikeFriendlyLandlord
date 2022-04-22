import ReactDOM from 'react-dom';
import React, { Component } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';


const SpecialTextField = styled((props) => (
    <TextField InputProps={{ disableUnderline: true }} {...props} />
  ))(({ theme }) => ({
    '& .MuiFilledInput-root': {
      border: '1px solid #e2e2e1',
      overflow: 'hidden',
      borderRadius: 1,
      backgroundColor: 'rgb(255, 255, 255)',
      color: 'grey',
      maxHeight: '40px'
    },
  }));

export default function ChatLogin (props) {
    let theUser = '';
    return(
        <Box position="fixed" color="primary" sx={{ top: 'auto', bottom: 40 }}>
          <SpecialTextField
            label="Your Name"
            variant="filled"
            style={{ marginTop: 11 }}
            onChange={e => theUser = e.target.value}
            />
          <Button sx={{height:'40px',margin:'11px'}} variant="contained"
          onClick={() => {props.onChatLogin(theUser)}}
        >Submit</Button>
          </Box>
    )
}