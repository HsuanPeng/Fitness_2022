import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

//components
import PiePage from '../Statistics/PiePage';
import LinePage from '../Statistics/LinePage';
import UserContext from '../../contexts/UserContext';

const PieOutside = styled.div`
  padding-top: 100px;
  width: 500px;
  height: 500px;
  margin: 0 auto;
`;

const LineOutside = styled.div`
  padding-top: 100px;
  width: 500px;
  margin: 0 auto;
`;

const Statistics = () => {
  //UserContext拿資料
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);

  return (
    <div>
      Statistics
      <PieOutside>
        <PiePage />
      </PieOutside>
      <LineOutside>
        <LinePage />
      </LineOutside>
    </div>
  );
};

export default Statistics;
