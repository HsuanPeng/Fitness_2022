import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';

import Locate from './Locate';
import Search from './Search';

import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';

import '@reach/combobox/styles.css';
import mapStyles from './mapStyles';

import logo from '../../images/Logo_black.png';

const libraries = ['places'];

const mapContainerStyle = {
  height: '80vh',
  width: '80vw',
};

const center = {
  lat: 25.03411303772624,
  lng: 121.56247802392849,
};

const options = {
  styles: mapStyles,
};

export default function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries,
  });

  const [selected, setSelected] = useState(null);

  const [gyms, setGyms] = useState([]);

  const [myPosition, setMyPosition] = useState();

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(16);
    nearbyGymsMap({ lat, lng });
    setMyPosition({ lat, lng });
  }, []);

  async function nearbyGymsMap({ lat, lng }) {
    const res = await fetch(
      `https://us-central1-fitness2-d4aaf.cloudfunctions.net/getGoogleNearbySearch?lat=${lat}&lng=${lng}`
    );
    const json = await res.json();
    console.log(json);
    setGyms(json.results);
  }

  if (loadError) return 'Error';
  if (!isLoaded) return 'Loading...';

  return (
    <>
      <ButtonOutside>
        <Locate panTo={panTo} />
        <Search panTo={panTo} />
      </ButtonOutside>
      <GoogleMapOutside>
        <GoogleMap
          id="map"
          mapContainerStyle={mapContainerStyle}
          zoom={16}
          center={center}
          onLoad={onMapLoad}
          options={options}
        >
          <Marker position={myPosition} />
          {gyms.map((marker) => (
            <Marker
              key={marker.place_id}
              position={{ lat: marker.geometry.location.lat, lng: marker.geometry.location.lng }}
              onClick={() => {
                setSelected(marker);
              }}
              icon={{
                url: logo,
                origin: new window.google.maps.Point(0, 0),
                anchor: new window.google.maps.Point(20, 20),
                scaledSize: new window.google.maps.Size(90, 40),
              }}
            />
          ))}
          {selected && (
            <InfoWindow
              position={{
                lat: selected.geometry.location.lat + 0.0003,
                lng: selected.geometry.location.lng + 0.0004,
              }}
              onCloseClick={() => {
                setSelected(null);
              }}
            >
              <InfoOutside>
                <InfoHeader>{selected.name}</InfoHeader>
                <InfoRating>
                  ⭐ {selected.rating} 📍 {selected.vicinity}
                </InfoRating>
                {selected.business_status === 'CLOSED_TEMPORARILY' ? (
                  <InfoOpening>Closed Temporarily</InfoOpening>
                ) : selected.opening_hours && selected.opening_hours.open_now ? (
                  <InfoOpening>🏠 Now Open</InfoOpening>
                ) : (
                  <InfoOpening>🏠 Now Closed</InfoOpening>
                )}
              </InfoOutside>
            </InfoWindow>
          )}
        </GoogleMap>
      </GoogleMapOutside>
    </>
  );
}

const ButtonOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 800px;
  margin: 40px auto;
  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

const InfoOutside = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`;

const InfoHeader = styled.div`
  font-size: 23px;
  color: #74c6cc;
  font-weight: 800;
  margin: 5px 0px;
  @media screen and (max-width: 1279px) {
    font-size: 20px;
  }
`;

const InfoRating = styled.div`
  font-size: 18px;
  margin: 5px 10px 5px 0px;
  @media screen and (max-width: 1279px) {
    font-size: 14px;
  }
`;

const InfoOpening = styled.div`
  font-size: 18px;
  margin: 5px 0px;
  font-weight: 600;
  @media screen and (max-width: 1279px) {
    font-size: 14px;
  }
`;

const GoogleMapOutside = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 80px;
`;
