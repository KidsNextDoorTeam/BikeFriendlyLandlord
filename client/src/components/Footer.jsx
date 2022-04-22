import React from 'react';


export default function Footer() {
  return (
    <footer id='footer' sx={{
      height: 40,
      backgroundColor: 'grey',
      color: 'white',
      fontSize: 40,
      fontFamily: 'Nunito',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      &copy; {new Date().getFullYear()} Bike Friendly Landlord
    </footer>
  );
}
