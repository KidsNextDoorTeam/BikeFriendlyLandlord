import ReactDOM from 'react-dom';
import React, { Component } from 'react';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Collapse } from '@mui/material';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const SpecialButton = styled((props) => (
    <Button inputprops={{ disableUnderline: true }} {...props} />
  ))(({ theme }) => ({
    '& .MuiFilledInput-root': {
      border: '1px solid #e2e2e1',
      borderRadius: 1,
      backgroundColor: 'rgb(255, 255, 255)',
    },
  }));

export default function Minimized (props){
    return(
      <Box 
        sx={{
          '& > :not(style)': {
            height: 120,
            width: 250,
          },
        }}
      >
        <Box >
            <SpecialButton onClick={() => props.onMinimized(props.chatCollapsed)}>
            <Collapse in={props.collapsed} collapsedSize={40}>
                <Paper sx={{ m: 1, display: 'flex',position:"fixed", top: 'auto', bottom: 40}} elevation={4}>
                  <Typography variant="subtitle2" color="common.white" sx={{pr:'0', padding: '10px'}}>
                    Chat With: {props.landlordData.first_name} {props.landlordData.last_name}
                  </Typography>
                {/* <Box component="svg" sx={{ width: 100, height: 30 }}>
                </Box> */}
                </Paper>
            </Collapse>
            </SpecialButton>
        </Box>
      </Box>
    )
}