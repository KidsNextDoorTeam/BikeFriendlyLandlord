import React, { useState, useEffect, useRef, useContext } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FormControl, MenuItem, Select, InputLabel, Tab, Tabs } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import { Stack } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import EmailIcon from '@mui/icons-material/Email';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ChatIcon from '@mui/icons-material/Chat';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';

import tomatopalette from '../components/tomatopalette.jsx';
import { Review } from '../components/Review.jsx';
import { LandlordInfoCard } from '../components/LandlordInfoCard.jsx';

import '../index.css';
import Chat from "../components/chatbot/chat.jsx"
import { useAuth } from '../hooks/authContext';
import { PropertyCard } from '../components/PropertyCard';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [landlordData, setLandlordData] = useState({});
  const [reviewData, setReviewData] = useState([]);
  const [reviewFilter, setReviewFilter] = useState('helpful');
  const [chatClicked, setChatClicked] = useState(false);
  const {user} = useAuth();
  const [currentTab, setCurrentTab] = useState(0);

  const { landlord_id: landlordId } = useParams();
  const mounted = useRef(true);

  useEffect(async () => {
    try {
      const { status, data } = await axios.get(`/landlords/${landlordId}`);
      if (status >= 200 && status < 300) {
        if (mounted.current) {
          setLandlordData(data.landlord);
          setReviewData(data.landlord.reviews);
        }
      } else {
        console.error(data);
      }
    } catch (err) {
      console.error(err);
    }

    return () => () => mounted.current = false;
  }, []);


  const handleReview = (e) => {
    navigate(`/review/${landlordId}/`);
  };

  const handleFilter = (e) => {
    setReviewFilter(e.target.value);
    getReviews(e.target.value);
  };

  const getReviews = async (filter) => {
    let sortColumn, sortOrder;
    switch (filter) {
      case 'helpful': {
        sortColumn = 'overall_rating';
        sortOrder = 'DESC';
        break;
      }
      case 'critical': {
        sortColumn = 'overall_rating';
        sortOrder = 'ASC';
        break;
      }
      case 'recent': {
        sortColumn = 'created_at';
        sortOrder = 'DESC';
        break;
      }
      default:
        console.log(`ERROR: Unsupported sort filter: ${filter}`);
    }
    try {
      // TODO: Consider sorting the reviews in place here
      const { status, data } = await axios.get('/reviews', {
        params: {
          sort: sortColumn,
          order: sortOrder,
          landlordId: landlordId,
        }
      });

      if (status >= 200 && status < 300) {
        if (mounted.current) setReviewData(data.reviews);
      } else {
        console.error(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onReviewDelete = () => {
    getReviews();
  };

  const onReviewSave = () => {
    getReviews();
  };

  const handleTabChange = (e, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <ThemeProvider theme={tomatopalette}>
      <div id='profileBackground'
        sx={{ width: 'auto' }}>
        <Container className='MainContainer' >
          <Stack className='LandlordInfo' sx={{ pb: 5, pl: 5 }} direction='row' justifyContent='space-around'>
            <Stack>
              <Card sx={{ minWidth: 275 }}>
                <CardContent sx={{ml: '50px', fontSize: '20px'}}>
                  <div className='ProfilePicture'>
                    <img style={{ height: '150px' }} src={`/images/${landlordData.profile_pic}`} />
                  </div>
                  {landlordData.first_name} {landlordData.last_name}
                </CardContent>
              </Card>
              <Card>
                <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                  <nav aria-label='main mailbox folders'>
                    <List>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <EmailIcon />
                          </ListItemIcon>
                          <ListItemText primary={landlordData.email} />
                          <ListItemText />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            <LocalPhoneIcon />
                          </ListItemIcon>
                          <ListItemText primary='Phone Number' />
                        </ListItemButton>
                      </ListItem>
                    </List>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <ApartmentIcon />
                        </ListItemIcon>
                        <ListItemText primary="Office Location" />
                      </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemButton onClick={() => {setChatClicked(true)}}>
                        <ListItemIcon>
                          <ChatIcon />
                        </ListItemIcon>
                        <ListItemText primary="Chat" />
                      </ListItemButton>
                    </ListItem>
                  </nav>
                </Box>
              </Card>
            </Stack>
            <Stack>
              <LandlordInfoCard {...landlordData} />
            </Stack>
          </Stack>
          <Tabs
            textColor="inherit"
            variant="fullWidth"
            TabIndicatorProps={{
              style: {
                backgroundColor: '#df4f35ea'
              }
            }}
            value={currentTab}
            onChange={handleTabChange}
            sx={{mt:'35px'}}
          >
            <Tab label="About" />
            <Tab label="Reviews" />
            <Tab label="All Properties" />
          </Tabs>
          {currentTab === 0 &&
            <div style={{ alignItems: 'center', marginTop: '30px'}}>
              {landlordData.description}
            </div>
          }
          {currentTab === 1 && 
          <Container>
            <Stack spacing={2} direction='row' sx={{marginTop: '30px'}} >
              <Stack>
                {user && <Button variant='contained' onClick={handleReview}>Create Review</Button>}
              </Stack>
              <Stack>
                <FormControl sx={{ minWidth: 120 }} size='small' >
                  <InputLabel>Sort by</InputLabel>
                  <Select MenuProps={{ sx: { '&& .MuiPaper-root': { backgroundColor: 'lightgrey' }}}} value={reviewFilter} label='Sort by' onChange={handleFilter}>
                    <MenuItem value={'helpful'}>Most Helpful</MenuItem>
                    <MenuItem value={'critical'}>Most Critical</MenuItem>
                    <MenuItem value={'recent'}>Most Recent</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
            <Stack >
              <div>
                {reviewData.map((eachReview, i) => (
                  <Review
                  key={i}
                  {...eachReview}
                    userData={userData}
                    onSave={onReviewSave}
                    onDelete={onReviewDelete}
                  />
                ))}
              </div>
            </Stack> 
          </Container> }
          {currentTab === 2 &&
          <Stack sx={{marginTop:'20px'}}>
            <div>
              {landlordData.properties.map((eachProperty, i) => (
                <PropertyCard
                  key={i}
                  {...eachProperty}

                />
              ))}
            </div>
          </Stack> 

          }
        </Container> 
        {chatClicked ? <Chat setChatClicked={setChatClicked} landlordData={landlordData}/> : null}
      </div>
    </ThemeProvider>
  );
}