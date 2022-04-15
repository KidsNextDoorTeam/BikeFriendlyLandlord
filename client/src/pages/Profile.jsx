import * as React from 'react';
import { useState} from 'react';
import {Link, useNavigate, useParams } from "react-router-dom";
import { Review } from '../components/Review.jsx';
import { LandlordInfoCard } from '../components/LandlordInfoCard.jsx'
import { FormControl, MenuItem, Select, InputLabel } from '@mui/material';
import axios from 'axios'
import "../index.css"
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container'
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
import Button from '@mui/material/Button';
import {  ThemeProvider } from '@mui/material/styles';

import tomatopalette from "../components/tomatopalette.jsx"


export default function ProfilePage({userData, isLoggedIn}) {
    const navigate = useNavigate();
    const [landlordData,setLandlordData] = useState({})
    const [reviewData, setReviewData] = useState([])
    const [reviewFilter, setReviewFilter] = useState("helpful");

    const landlordId = useParams();
    React.useEffect(() => {
        axios.get(`http://localhost:3000/landlords/getById/${landlordId.landlord_id}`)
        .then (landlordObject => {
            console.log(landlordObject.data)
            setLandlordData(landlordObject.data)
        })
        axios.get(`http://localhost:3000/reviews/landlordReviews/${landlordId.landlord_id}`)
        .then (reviewArray => {
            // console.log(reviewArray)
            setReviewData(reviewArray.data)
        })
    }, [])
    
      
    //onclick for button
    const handleReview = (e) => {
        if (isLoggedIn) {
            navigate(`/review/${landlordId.landlord_id}/`)
        }
        else {
            alert('Please log in to submit a review')
        }
    }

    const handleFilter = (e) => {
        setReviewFilter(e.target.value);
        axios.post(`/reviews/landlordReviews/${landlordId.landlord_id}`,{
            reviewFilter: e.target.value,
          })
        .then (reviewArray => {
            setReviewData(reviewArray.data)
        })      
    }


    // console.log(landlordData)
    return (
        <ThemeProvider theme={tomatopalette}>
        <div id ='background'>
            <Container className="MainContainer" >
                <Stack className="LandlordInfo" sx={{pb:5, pl:5}} direction="row" justifyContent="space-around">
                    <Stack>
                        <Card sx={{ minWidth: 275 }}>
                            <CardContent>
                                <div className="ProfilePicture">
                                    <img style={{height:'100px'}} src={`http://localhost:3000/images/${landlordData.profile_pic}`}/>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                        <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                            <nav aria-label="main mailbox folders">
                                <List>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                    <ListItemIcon>
                                        <EmailIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Email" />
                                    <ListItemText />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                    <ListItemIcon>
                                        <LocalPhoneIcon />
                                    </ListItemIcon>
                                    <ListItemText primary="Phone Number" />
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
                            </nav>
                            </Box>
                        </Card>
                    </Stack>
                    <Stack>
                        <LandlordInfoCard {...landlordData}/>
                    </Stack>
                </Stack>
                <Container>
                    <Stack spacing={2} direction="row" >
                        <Typography variant="h3" gutterBottom component="div">
                        Reviews
                        </Typography>
                        <Stack sx={{ alignItems: 'center', p: 1, m: 1,}}>
                            <Button variant="contained" onClick = {handleReview}>Create Review</Button>
                        </Stack>
                        <Stack sx={{ alignItems: 'center', p: 1, m: 1,}}>
                       <FormControl sx={{ minWidth: 120 }} size="small" >
                        <InputLabel>Sort by</InputLabel>
                            <Select value={reviewFilter} label="Sort by"  onChange={handleFilter}>
                                <MenuItem value={"helpful"}>Most Helpful</MenuItem>
                                <MenuItem value={"critical"}>Most Critical</MenuItem>
                                <MenuItem value={"recent"}>Most Recent</MenuItem>
                            </Select>
                       </FormControl>
                       </Stack>
                    </Stack>
                </Container>
                <Container>
                    <Stack>
                        <div>
                            {reviewData.map((eachReview, i) => (
                                <Review key={i} {...eachReview} userData={userData}/>
                                ))}
                        </div>
                    </Stack>
                </Container>
        </Container>
        </div>
        </ThemeProvider>
    )
}