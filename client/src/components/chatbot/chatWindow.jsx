import ReactDOM from 'react-dom';
import React, { Component } from 'react';

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Fab from '@mui/material/Fab';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { ListItemIcon, Collapse } from '@mui/material';
import Grid from '@mui/material/Grid';

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

const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
});

export default function ChatWindow (props){
    return(
    <Paper sx={{ overflow:'auto',width: "80vw",height: "80vh",maxWidth: "300px",maxHeight: "500px",display: "flex", flexDirection: "column", position: "fixed",top: 'auto', bottom: 0}}>
        <Grid container spacing={1} sx={{ flexDirection: 'row' }}>
          <Grid item xs={2}>
            <Button sx={{minWidth: '30px',minHeight: '20px',maxHeight:'20px',maxWidth: '30px',margin: '17px'}} variant="contained" onClick={() => {props.onMinimized(props.chatCollapsed)}}>-</Button>
          </Grid>
          <Grid item xs={2}>
            <Button sx={{minWidth: '30px',minHeight: '20px',maxHeight:'20px',maxWidth: '30px',margin: '17px'}} variant="contained" onClick={() => {props.onClosed(); props.setChatClicked(false)}}>X</Button>
          </Grid>
          <Grid item xs={8}>
            <Typography variant="h8" gutterBottom component="div" sx={{ p: 2, pb: 0 }}>
              {props.user.first_name}'s Chat Window
            </Typography>
          </Grid>
        </Grid>
          <List sx={{ mb: 2, display: 'flex', flexDirection: 'column', paddingBottom: 5}}>
            {props.messages.map(message => (
                  <Card sx={{margin: '12px 3px 0 3px', alignSelf: props.user.username === message.user ? 'flex-end' : 'flex-start' }} key={message.msg}>
                    <ListItemIcon sx={{float: props.user.username === message.user ? 'right' : 'left' }}>
                      <Avatar alt="RandomPic" src= {message.profilePic.match(/[null]$/) ? "https://source.unsplash.com/random" : message.profilePic} />
                    </ListItemIcon>
                    <CardContent>
                      <Typography variant="body2" color="text.secondary">
                        {message.firstName+": "}{message.msg}
                      </Typography>
                     </CardContent>
                </Card> 
            ))
          }
          </List>
          <Box mt={3} position="fixed" sx={{ top: 'auto', bottom: 0 }}>
            <SpecialTextField
              label="Type a message"
              variant="filled"
              value={props.initialMessage}
              onChange={e => props.onNameEnter(e.target.value)}
            />
            <Button sx={{height:'40px',padding:'11px'}} variant="contained" onClick={() => {props.onButtonClicked(props.initialMessage)}}>Send</Button>
          </Box>
           {/* <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
            <Toolbar>
              <IconButton color="inherit" aria-label="open drawer">
                <MenuIcon />
              </IconButton>
              <StyledFab color="secondary" aria-label="add">
                <AddIcon />
              </StyledFab>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton color="inherit">
                <SearchIcon />
              </IconButton>
              <IconButton color="inherit">
                <MoreIcon />
              </IconButton>
            </Toolbar>
          </AppBar>  */}
          </Paper>
    )
}