import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Logo = styled(Link)``;
const TrainingPage = styled(Link)``;
const CalenderPage = styled(Link)``;
const StatisticsPage = styled(Link)``;
const MapPage = styled(Link)``;
const AnimalPage = styled(Link)``;

const Header = () => {
  return (
    <>
      <Wrapper>
        <Logo to="/">Logo</Logo>
        <TrainingPage to="/training">健菜單</TrainingPage>
        <CalenderPage to="/calender">健日曆</CalenderPage>
        <StatisticsPage to="/statistics">健數據</StatisticsPage>
        <MapPage to="/map">健地圖</MapPage>
        <AnimalPage to="/animal">健畜</AnimalPage>
      </Wrapper>
    </>
  );
};

export default Header;
