import React, { useState, useRef, useCallback, useContext } from 'react';
import styled from 'styled-components';

//maps
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';

//樣式
import '@reach/combobox/styles.css';
import mapStyles from './mapStyles';

//icon
import logo from '../../images/高畫質logo_黑色2.png';

//components
import UserContext from '../../contexts/UserContext';

//pic
import trainingBanner from '../../images/Equipment-rack-in-gym-563854.JPG';

//FontAwesomeIcon
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassLocation } from '@fortawesome/free-solid-svg-icons';

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

  //我的所在地
  const [myPosition, setMyPosition] = useState();

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
    <>
      <BannerOutside>
        <Banner>
          <BannerText>找出離你最近的健身房！</BannerText>
        </Banner>
      </BannerOutside>

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
                anchor: new window.google.maps.Point(20, 20),
                scaledSize: new window.google.maps.Size(80, 40),
              }}
            />
          ))}

          {selected ? (
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
          ) : null}
        </GoogleMap>
      </GoogleMapOutside>
    </>
  );
}

//找出我在哪
function Locate({ panTo }) {
  //UserContext拿資料
  const { isLoggedIn, setIsLoggedIn, userSignOut, signInWithGoogle, uid, displayName, email, signIn } =
    useContext(UserContext);

  return (
    <LocateButtonOutside>
      <LocateButton
        onClick={() => {
          {
            isLoggedIn
              ? navigator.geolocation.getCurrentPosition(
                  (position) => {
                    panTo({
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                    });
                  },
                  () => null
                )
              : signIn();
          }
        }}
      >
        找出我附近的健身房
      </LocateButton>
    </LocateButtonOutside>
  );
}

//搜尋地點，預設在AWS附近
function Search({ panTo }) {
  //UserContext拿資料
  const { isLoggedIn, setIsLoggedIn, userSignOut, signInWithGoogle, uid, displayName, email, signIn } =
    useContext(UserContext);

  //監測有無在使用搜尋框框
  const [focus, setFocus] = useState(false);

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 25.03411303772624, lng: () => 121.56247802392849 },
      radius: 100 * 1000,
    },
  });

  const handleInput = (e) => {
    setValue(e.target.value);
    setFocus(true);
  };

  //選擇搜尋出來的地點以後，清除下拉遠單
  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();
    try {
      if (isLoggedIn) {
        const results = await getGeocode({ address });
        const { lat, lng } = await getLatLng(results[0]);
        panTo({ lat, lng });
      } else {
        signIn();
      }
    } catch (error) {
      console.log('😱 Error: ', error);
    }
  };

  return (
    <ComboboxOutside
      style={{
        zIndex: '50',
      }}
    >
      <ComboboxPic $focus={focus}>
        <FontAwesomeIcon icon={faMagnifyingGlassLocation} />
      </ComboboxPic>
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          onFocus={() => {
            setFocus(true);
          }}
          onBlur={() => {
            setFocus(false);
          }}
          disabled={!ready}
          placeholder="找出目標地附近的健身房"
          style={{
            width: '280px',
            borderRadius: '5px',
            height: '40px',
            border: 'none',
            paddingLeft: '5px',
            fontSize: '20px',
            border: '2px solid black',
            letterSpacing: '1px',
          }}
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === 'OK' &&
              data.map(({ id, description }) => (
                <ComboboxOption
                  key={id}
                  value={description}
                  style={{
                    color: 'black',
                  }}
                />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </ComboboxOutside>
  );
}

const BannerOutside = styled.div`
  height: 320px;
  margin-top: 90px;
  @media screen and (max-width: 1279px) {
    height: 200px;
  }
`;

const Banner = styled.div`
  background-image: url(${trainingBanner});
  background-size: cover;
  background-position: 25% 75%;
  position: absolute;
  width: 100%;
  height: 320px;
  @media screen and (max-width: 1279px) {
    height: 200px;
  }
`;

const BannerText = styled.div`
  color: white;
  padding-top: 180px;
  padding-left: 150px;
  font-size: 25px;
  letter-spacing: 3px;
  font-size: 35px;
  animation-name: fadein;
  animation-duration: 2s;
  @keyframes fadein {
    0% {
      transform: translateX(-6%);
      opacity: 0%;
    }
    100% {
      transform: translateX(0%);
      opacity: 100%;
    }
  }
  @media screen and (max-width: 1279px) {
    font-size: 25px;
    padding-left: 50px;
    padding-top: 100px;
  }
`;

const GoogleMapOutside = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 80px;
`;

const LocateButtonOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #74c6cc;
  width: 260px;
  margin: 40px auto 40px auto;
  color: black;
  cursor: pointer;
  transition: ease-in-out 0.2s;
  animation-name: light;
  animation-duration: 2.5s;
  animation-iteration-count: infinite;
  &:hover {
    background: white;
    color: black;
  }
  @keyframes light {
    0% {
      box-shadow: 0px 0px 0px white;
    }
    50% {
      box-shadow: 0px 0px 20px white;
    }
    100% {
      box-shadow: 0px 0px 0px white;
    }
  }
`;

const LocateButton = styled.div`
  padding: 8px;
  font-size: 23px;
  letter-spacing: 2px;
  font-weight: 600;
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

const ComboboxOutside = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  align-items: center;
`;

const ComboboxPic = styled.div`
  font-size: 30px;
  color: ${(props) => (props.$focus ? '#74c6cc' : 'white')};
  margin-right: 20px;
  scale: 1;
  animation-name: ${(props) => (props.$focus ? 'zoom' : null)};
  animation-duration: 2.5s;
  animation-iteration-count: infinite;
  @keyframes zoom {
    0% {
      scale: 1;
    }
    50% {
      scale: 1.5;
    }
    100% {
      scale: 1;
    }
  }
`;
