import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
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
import { ListItemIcon } from '@mui/material';


const StyledFab = styled(Fab)({
  position: 'absolute',
  zIndex: 1,
  top: -30,
  left: 0,
  right: 0,
  margin: '0 auto',
});

const client = new W3CWebSocket('ws://localhost:3001');

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

export default class Chat extends Component {
  
  state ={
    userName: '',
    isLoggedIn: false,
    initialMessage: '',
    messages: []
  }
  
  onButtonClicked = (value) => {
    client.send(JSON.stringify({
      type: "message",
      msg: value,
      user: this.state.userName
    }));
    this.setState({ initialMessage: '' })
  }
  componentDidMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log('got reply! ', dataFromServer);
      if (dataFromServer.type === "message") {
        this.setState((state) =>
          ({
            messages: [...state.messages,
              {
              msg: dataFromServer.msg,
              user: dataFromServer.user
            }]
          })
        );
      }
    };
  }
  
  render(){
    const darkTheme = createTheme({ palette: { mode: 'dark' } });
    let theUser = '';
    return (
      <div>
          {this.state.isLoggedIn ?
      <React.Fragment >
        <CssBaseline />
        <ThemeProvider theme={darkTheme}>
        <Box sx={{width: "100vw",height: "100vh",display: "flex",alignItems: "bottom",justifyContent: "center", overflowY: "scroll"}}>
          <Paper sx={{ width: "80vw",height: "80vh",maxWidth: "300px",maxHeight: "500px",display: "flex",flexDirection: "column", position: "relative" }}>
            <Typography variant="h8" gutterBottom component="div" sx={{ p: 2, pb: 0 }}>
              {this.state.userName}'s Chat Window
            </Typography>
            <List sx={{ mb: 2, display: 'flex', flexDirection: 'column', paddingBottom: 5, width: "calc( 100% - 20px )", height: "calc( 100% - 80px )"}}>
              {this.state.messages.map(message => (
                    <Card sx={{margin: '12px 3px 0 3px', alignSelf: this.state.userName === message.user ? 'flex-end' : 'flex-start' }} key={message.msg}>
                      <ListItemIcon>
                        <Avatar alt="Remy Sharp" src="https://material-ui.com/static/images/avatar/1.jpg" />
                      </ListItemIcon>
                      <CardContent>
                        <Typography variant="body2" color="text.secondary">
                          {message.user+": "}{message.msg}
                        </Typography>
                       </CardContent>
                  </Card> 
              ))
            }
            </List>
            <Box mt={3} position="absolute" bottom="0px">
              <SpecialTextField className='userText'
                label="Type a message"
                variant="filled"
                value={this.state.initialMessage}
                onChange={e => this.setState({initialMessage: e.target.value})}
              />
              <Button  variant="contained" onClick={() => {this.onButtonClicked(this.state.initialMessage)}}>Send</Button>
            </Box>
            </Paper>
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
          </AppBar> */}
        </Box>
          </ThemeProvider>
          </React.Fragment>
          :
          <Box sx={{display: 'grid'}}>
          <SpecialTextField
            label="Your Name"
            variant="filled"
            style={{ marginTop: 11 }}
            onChange={e => theUser = e.target.value}
          />
          <Button  variant="contained"
          onClick={() => {this.setState({ isLoggedIn: true, userName: theUser})}
          }
          >Submit</Button>
        </Box>
          }
      </div>
    );
  }
}