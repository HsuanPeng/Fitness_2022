import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

//components
import UserContext from '../../contexts/UserContext';

const Header = () => {
  const { isLoggedIn, setIsLoggedIn, userSignOut } = useContext(UserContext);

  return (
    <>
      <Wrapper>
        <Logo to="/">Logo</Logo>
        <TrainingPage to="/training">健菜單</TrainingPage>
        <CalendarPage to="/CalendarPage">健日曆</CalendarPage>
        <StatisticsPage to="/statistics">健數據</StatisticsPage>
        <MapPage to="/map">健地圖</MapPage>
        {isLoggedIn ? (
          <>
            <LoginUser>{localStorage.getItem('name')} 登入中</LoginUser>
            <Logout
              onClick={() => {
                userSignOut();
              }}
            >
              登出
            </Logout>
          </>
        ) : null}
      </Wrapper>
    </>
  );
};

export default Header;

const Logout = styled.button``;

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  height: 100px;
`;

const Logo = styled(Link)``;
const TrainingPage = styled(Link)``;
const CalendarPage = styled(Link)``;
const StatisticsPage = styled(Link)``;
const MapPage = styled(Link)``;

const LoginUser = styled.div``;
