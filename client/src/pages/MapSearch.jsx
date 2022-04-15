import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import HomeCard from '../components/HomeCard.jsx';

import '../index.css';

export default function MapSearch(props) {
  // 'pins' is an array of pins to post on the map based on address from the database
  const [pins, setPins] = useState([]);

  useEffect(async () => {
    let mounted = true;
    try {

      const response = await axios.get('/properties');
      if (response.status >= 200 && response.status < 300) {
        if (mounted) {
          /**  iterate through the returned array of landlords with addresses
           *   use the google maps geocoding api to convert address to gpl coordinates
           */
          const pinsToSet = response.data.properties.map((property, i) => (
            <Marker key={i} position={[property.latitude || 1, property.longitude || 1]}>
              <Popup autoPan={true} closeButton={false}>
                <HomeCard landlord={{
                  first_name: property.landlord_first_name,
                  last_name: property.landlord_last_name,
                  profile_pic: property.landlord_profile_pic,
                  ...property

                }} />
              </Popup>
            </Marker>
          ));
          setPins(pinsToSet);
        }

      }
    } catch (error) {
      console.error('error getting all landlords ->', error);
    }

    return () => () => mounted = false;

  }, []);

  /** Display the map positioned over the USA by default */
  return (
    <div id="map">
      <MapContainer center={[37.09024, -95.712891]} zoom={4}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {pins}
      </MapContainer>
    </div>
  );
}
