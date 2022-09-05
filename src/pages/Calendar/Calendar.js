import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

//components
import UserContext from '../../contexts/UserContext';

const Calendar = () => {
  //UserContext拿資料
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);
  console.log(isLoggedIn);

  return (
    <>
      <div>日曆</div>
    </>
  );
};

export default Calendar;
