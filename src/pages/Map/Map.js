import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

//components
import UserContext from '../../contexts/UserContext';

const Map = () => {
  //UserContext拿資料
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);

  return <div>Map</div>;
};

export default Map;
