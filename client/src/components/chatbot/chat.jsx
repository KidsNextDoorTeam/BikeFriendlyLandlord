import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";

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

import ChatWindow from './chatWindow.jsx'
import ChatLogin from './chatLogin.jsx'
import Minimized from './minimized.jsx'

const client = new W3CWebSocket('ws://localhost:3001');



export default class Chat extends Component {
  constructor(props) {
  super(props);
  this.state = {
    userName: '',
    isLoggedIn: false,
    initialMessage: '',
    messages: [],
    chatCollapsed: false,
    chatClosed: false,
  }
  this.onButtonClicked = this.onButtonClicked.bind(this);
  this.onNameEnter = this.onNameEnter.bind(this);
  this.onChatLogin = this.onChatLogin.bind(this);
  this.onMinimized = this.onMinimized.bind(this);
  this.onClosed = this.onClosed.bind(this);
}
  
  onButtonClicked = (value) => {
    client.send(JSON.stringify({
      type: "message",
      msg: value,
      user: this.props.user.username,
      firstName: this.props.user.first_name,
      profilePic: `/images/${this.props.user.profile_pic}`
    }));
    this.setState({ initialMessage: '' })
  }

  onNameEnter = (value) => {
    this.setState({ initialMessage: value })
  }

  onChatLogin = (user) => {
    this.setState({ isLoggedIn: true, userName: user, chatClosed: false});
  }

  onMinimized = (value) => {
    this.setState({chatCollapsed: value ? false : true, chatClosed: false})
  }
  
  onClosed = () => {
    this.setState({chatClosed: true})
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
              user: dataFromServer.user,
              firstName: dataFromServer.firstName,
              profilePic: dataFromServer.profilePic
            }]
          })
        );
      }
    };
  }
  
  render(){
    const darkTheme = createTheme({ palette: { mode: 'dark' } });
    return (
      <div>
      <React.Fragment >
        <CssBaseline />
        <ThemeProvider theme={darkTheme}>
        <Box sx={{width: "100vw",height: "100vh",position:'absolute',display: "flex",justifyContent: "right"}}>
          {!this.state.chatCollapsed & !this.state.chatClosed ?
            <ChatWindow 
              userName={this.state.userName}
              isLoggedIn={this.state.isLoggedIn}
              initialMessage={this.state.initialMessage}
              messages={this.state.messages}
              setChatClicked={this.props.setChatClicked}
              onButtonClicked={this.onButtonClicked}
              onNameEnter={this.onNameEnter}
              onClosed={this.onClosed}
              onMinimized={this.onMinimized}
              src={this.props.src}
              user={this.props.user}/>
          : this.state.chatCollapsed & !this.state.chatClosed ?
          <Minimized
            chatCollapsed={this.state.chatCollapsed}
            onMinimized={this.onMinimized}
            landlordData={this.props.landlordData}/>
          :
          // this component is obsolete with working auth
          <ChatLogin
            onChatLogin={this.onChatLogin}/>
        }
        </Box>
          </ThemeProvider>
        </React.Fragment>
      </div>
    );
  }
}