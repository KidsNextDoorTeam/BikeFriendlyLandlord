export function stringAvatar(name) {
  return {
    sx: {
      fontSize:'60px', 
      width: 200, 
      height: 200, 
      minWidth:20,
      minHeight:20, 
      marginTop: '20px', 
      marginBottom: '20px' 
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}

export function navBarAvatar(name) {
  return {
    sx: {
      fontSize:'15px', 
      width: 35, 
      height:35,  
      marginRight: '15px'
    },
    children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
  };
}