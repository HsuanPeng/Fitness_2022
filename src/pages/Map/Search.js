import React, { useState, useContext } from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlassLocation } from '@fortawesome/free-solid-svg-icons';

import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';

import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

import UserContext from '../../contexts/UserContext';

function Search({ panTo }) {
  const { isLoggedIn, signIn } = useContext(UserContext);

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
          placeholder="輸入地點找尋健身房"
          style={{
            width: '240px',
            textAlign: 'center',
            borderRadius: '5px',
            height: '40px',
            paddingLeft: '5px',
            paddingTop: '2px',
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

export default Search;

const ComboboxOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 350px;
  @media screen and (max-width: 767px) {
    margin-top: 30px;
  }
`;

const ComboboxPic = styled.div`
  font-size: 30px;
  color: ${(props) => (props.$focus ? '#74c6cc' : 'white')};
  margin-right: 10px;
  scale: 1;
  animation-name: ${(props) => props.$focus && 'zoom'};
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
