import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import '../index.css';

const useStyles = makeStyles({
  root: {
    height: 40,
    backgroundColor: 'grey',
    color: 'white',
    fontSize: 40,
    fontFamily: 'Nunito',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
});


export default function Footer() {
  const classes = useStyles();
  return (
    <footer id='footer' className={classes.root}>
      &copy; {new Date().getFullYear()} Bike Friendly Landlord
    </footer>
  );
}
