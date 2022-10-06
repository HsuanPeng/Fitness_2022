import React, { useContext } from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';

import UserContext from '../../contexts/UserContext';

function Locate({ panTo }) {
  const { isLoggedIn, signIn, setContent, alertPop } = useContext(UserContext);

  return (
    <>
      <LocationOutside>
        <LocatePic>
          <FontAwesomeIcon icon={faMapLocationDot} />
        </LocatePic>
        <LocateButtonOutside>
          <LocateButton
            onClick={() => {
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
              alertPop();
              setContent('請開啟瀏覽器存取權');
            }}
          >
            找出我附近的健身房
          </LocateButton>
        </LocateButtonOutside>
      </LocationOutside>
    </>
  );
}

export default Locate;

const LocateButtonOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #74c6cc;
  width: 260px;
  margin-right: 20px;
  color: black;
  cursor: pointer;
  transition: ease-in-out 0.2s;
  &:hover {
    background: white;
    color: black;
  }
  @media screen and (max-width: 767px) {
    margin-right: 0px;
  }
`;

const LocationOutside = styled.div`
  display: flex;
`;

const LocatePic = styled.div`
  color: #74c6cc;
  font-size: 30px;
  margin-right: 20px;
`;

const LocateButton = styled.div`
  padding: 8px;
  font-size: 23px;
  letter-spacing: 2px;
  font-weight: 600;
`;
