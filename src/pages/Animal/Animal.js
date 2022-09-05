import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

//components
import UserContext from '../../contexts/UserContext';

const Animal = () => {
  //UserContext拿資料
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);

  return <div>賤畜</div>;
};

export default Animal;
