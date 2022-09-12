import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';

//maps
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';

//樣式
import '@reach/combobox/styles.css';
import mapStyles from './mapStyles';

//icon
import logo from './logo去背.png';

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
  //最一開始load地圖
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_API_KEY,
    libraries,
  });

  //點擊健身房
  const [selected, setSelected] = useState(null);

  //附近的健身房
  const [gyms, setGyms] = useState([]);

  //我得所在地
  const [myPosition, setMyPosition] = useState([]);

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  //點擊搜尋出來的地點後，地圖跑去那邊
  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(16);
    nearbyGymsMap({ lat, lng });
    setMyPosition({ lat, lng });
  }, []);

  //找出附近的健身房
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
    <div>
      <Locate panTo={panTo} />
      <Search panTo={panTo} />
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
                anchor: new window.google.maps.Point(15, 15),
                scaledSize: new window.google.maps.Size(70, 40),
              }}
            />
          ))}

          {selected ? (
            <InfoWindow
              position={{ lat: selected.geometry.location.lat + 0.0003, lng: selected.geometry.location.lng + 0.0004 }}
              onCloseClick={() => {
                setSelected(null);
              }}
            >
              <div>
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
              </div>
            </InfoWindow>
          ) : null}
        </GoogleMap>
      </GoogleMapOutside>
    </div>
  );
}

//找出我在哪
function Locate({ panTo }) {
  return (
    <LocateButton
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      找出我附近的健身房
    </LocateButton>
  );
}

//搜尋地點，預設在AWS附近
function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 25.038606651446255, lng: () => 121.53243547067326 },
      radius: 100 * 1000,
    },
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  //選擇搜尋出來的地點以後，清除下拉遠單
  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log('😱 Error: ', error);
    }
  };

  return (
    <div>
      <Combobox onSelect={handleSelect}>
        <ComboboxInput value={value} onChange={handleInput} disabled={!ready} placeholder="找出目標地附近的健身房" />
        <ComboboxPopover>
          <ComboboxList>
            {status === 'OK' && data.map(({ id, description }) => <ComboboxOption key={id} value={description} />)}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}

const GoogleMapOutside = styled.div`
  display: flex;
  justify-content: center;
`;

const LocateButton = styled.button``;

const InfoHeader = styled.div``;

const InfoRating = styled.div``;

const InfoOpening = styled.div``;
