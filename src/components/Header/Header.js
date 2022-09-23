import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

//components
import UserContext from '../../contexts/UserContext';

//images
import LogoBlue from '../../images/logo去背_藍色.png';
import LogoWhite from '../../images/logo去背_白色.png';
import CalendarPage from '../../pages/CalendarPage/CalendarPage';

//FontAwesomeIcon
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const { isLoggedIn, setIsLoggedIn, userSignOut, signInWithGoogle, uid, displayName, email, signIn } =
    useContext(UserContext);

  //控制手機版menu開關
  const [openMenu, setOpenMenu] = useState(false);

  //控制header分頁變色
  const [currentPage, setCurrentPgae] = useState();

  function mobileMenu() {
    setOpenMenu((prev) => !prev);
  }

  return (
    <>
      <Wrapper>
        {!openMenu ? (
          <>
            <MenuIcon onClick={mobileMenu} openMenu={openMenu}>
              <FontAwesomeIcon icon={faBars} />
            </MenuIcon>
          </>
        ) : (
          <>
            <MenuIcon onClick={mobileMenu} openMenu={openMenu}>
              <FontAwesomeIcon icon={faXmark} />
            </MenuIcon>
          </>
        )}
        <LogoZone
          to="/"
          onClick={() => {
            setCurrentPgae('');
          }}
        >
          <Logo></Logo>
          <LogoTitle>健人網</LogoTitle>
        </LogoZone>
        <PageSelection openMenu={openMenu}>
          <TrainingPage
            to="/training"
            onClick={() => {
              setCurrentPgae('TrainingPage');
            }}
            $isActive={currentPage}
          >
            <TrainingPageTitle> 健菜單</TrainingPageTitle>
            <UnderLine></UnderLine>
          </TrainingPage>
          <Calendar
            to="/calendar"
            onClick={() => {
              setCurrentPgae('Calendar');
            }}
            $isActive={currentPage}
          >
            <CalendarPageTitle>健日曆</CalendarPageTitle>
            <UnderLine></UnderLine>
          </Calendar>
          <StatisticsPage
            to="/statistics"
            onClick={() => {
              setCurrentPgae('StatisticsPage');
            }}
            $isActive={currentPage}
          >
            <StatisticsPageTitle> 健數據</StatisticsPageTitle>
            <UnderLine></UnderLine>
          </StatisticsPage>
          <MapPage
            to="/map"
            onClick={() => {
              setCurrentPgae('MapPage');
            }}
            $isActive={currentPage}
          >
            <MapPageTitle> 健地圖</MapPageTitle>
            <UnderLine></UnderLine>
          </MapPage>
          {isLoggedIn ? (
            <>
              <Logout
                onClick={() => {
                  userSignOut();
                }}
              >
                <LogoutTitle>登出</LogoutTitle>
                <UnderLine></UnderLine>
              </Logout>
            </>
          ) : (
            <Login
              onClick={() => {
                signIn();
              }}
            >
              <LoginTitle> 登入</LoginTitle>
              <UnderLine></UnderLine>
            </Login>
          )}
        </PageSelection>
      </Wrapper>
    </>
  );
};

export default Header;

const Wrapper = styled.div`
  position: fixed;
  width: 100%;
  z-index: 99;
  top: 0px;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  height: 90px;
  background: #191a1e;
  padding: 0px 30px;
`;

const MenuIcon = styled.div`
  display: none;
  @media screen and (max-width: 767px) {
    font-size: 40px;
    display: block;
    position: absolute;
    top: 15px;
    left: 15px;
    color: ${({ openMenu }) => (openMenu ? '#74c6cc' : 'white')};
    font-weight: 200;
    cursor: pointer;
    &:hover {
      color: #74c6cc;
    }
  }
`;

const LogoZone = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 240px;
  scale: 1;
  transition: ease-in-out 0.2s;
  &:hover {
    scale: 1.05;
  }
  @media screen and (max-width: 1279px) {
    width: 200px;
  }
  @media screen and (max-width: 767px) {
    margin: 0 auto;
  }
`;

const Logo = styled.div`
  color: white;
  background-image: url(${LogoBlue});
  background-size: cover;
  width: 100px;
  height: 50px;
  @media screen and (max-width: 1279px) {
    width: 80px;
    height: 40px;
  }
`;

const LogoTitle = styled.div`
  color: white;
  font-size: 32px;
  font-weight: bold;
  letter-spacing: 7px;
  color: #74c6cc;
  @media screen and (max-width: 1279px) {
    font-size: 28px;
  }
`;

const PageSelection = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: center;
  font-size: 24px;
  width: 580px;
  letter-spacing: 7px;
  font-weight: 600;
  @media screen and (max-width: 1279px) {
    width: 480px;
  }
  @media screen and (max-width: 767px) {
    position: fixed;
    z-index: 30;
    left: 0%;
    top: 7%;
    transform: ${({ openMenu }) => (openMenu ? 'translateX(0)' : 'translateX(-100%)')};
    transition: ${({ openMenu }) => (openMenu ? 'all 0.3s' : 'all 0s')};
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    background: rgba(1, 1, 1, 0.8);
  }
`;

const UnderLine = styled.div`
  width: 0%;
  margin-top: 0.25rem;
  height: 2px;
  background-color: white;
  transition: ease-in-out 0.3s;
`;

const TrainingPage = styled(Link)`
  color: ${(props) => (props.$isActive === 'TrainingPage' ? '#74c6cc' : 'white')};
  height: 40px;
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: ease-in-out 0.2s;
  cursor: pointer;
  ${UnderLine} {
    width: ${(props) => (props.$isActive === 'TrainingPage' ? '100%' : '0%')};
    background-color: #74c6cc;
  }
  &:hover {
    color: #74c6cc;
    height: 45px;
    margin-top: 23px;
    ${UnderLine} {
      width: 100%;
      background-color: #74c6cc;
    }
  }
  @media screen and (max-width: 767px) {
    margin: 0px 0px;
    width: 100%;
    letter-spacing: 5px;
    height: 60px;
    border: 0.5px solid rgba(255, 255, 255, 0.5);
    color: ${(props) => (props.$isActive === 'TrainingPage' ? 'black' : null)};
    background: ${(props) => (props.$isActive === 'TrainingPage' ? 'white' : null)};
    ${UnderLine} {
      width: 0%;
    }
    &:hover {
      color: black;
      height: 60px;
      background: white;
      margin-top: 0px;
      ${UnderLine} {
        width: 0%;
        background-color: #74c6cc;
      }
    }
  }
`;

const TrainingPageTitle = styled.div`
  margin-left: 5px;
`;

const Calendar = styled(Link)`
  color: ${(props) => (props.$isActive === 'Calendar' ? '#74c6cc' : 'white')};
  height: 40px;
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: ease-in-out 0.2s;
  cursor: pointer;
  ${UnderLine} {
    width: ${(props) => (props.$isActive === 'Calendar' ? '100%' : '0%')};
    background-color: #74c6cc;
  }
  &:hover {
    color: #74c6cc;
    height: 45px;
    margin-top: 23px;
    ${UnderLine} {
      width: 100%;
      background-color: #74c6cc;
    }
  }
  @media screen and (max-width: 767px) {
    margin: 0px 0px;
    width: 100%;
    letter-spacing: 5px;
    height: 60px;
    border: 0.5px solid rgba(255, 255, 255, 0.5);
    color: ${(props) => (props.$isActive === 'Calendar' ? 'black' : null)};
    background: ${(props) => (props.$isActive === 'Calendar' ? 'white' : null)};
    ${UnderLine} {
      width: 0%;
    }
    &:hover {
      color: black;
      height: 60px;
      background: white;
      margin-top: 0px;
      ${UnderLine} {
        width: 0%;
        background-color: #74c6cc;
      }
    }
  }
`;

const CalendarPageTitle = styled.div`
  margin-left: 5px;
`;

const StatisticsPage = styled(Link)`
  color: ${(props) => (props.$isActive === 'StatisticsPage' ? '#74c6cc' : 'white')};
  height: 40px;
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: ease-in-out 0.2s;
  cursor: pointer;
  ${UnderLine} {
    width: ${(props) => (props.$isActive === 'StatisticsPage' ? '100%' : '0%')};
    background-color: #74c6cc;
  }
  &:hover {
    color: #74c6cc;
    height: 45px;
    margin-top: 23px;
    ${UnderLine} {
      width: 100%;
      background-color: #74c6cc;
    }
  }
  @media screen and (max-width: 767px) {
    margin: 0px 0px;
    width: 100%;
    letter-spacing: 5px;
    height: 60px;
    border: 0.5px solid rgba(255, 255, 255, 0.5);
    color: ${(props) => (props.$isActive === 'StatisticsPage' ? 'black' : null)};
    background: ${(props) => (props.$isActive === 'StatisticsPage' ? 'white' : null)};
    ${UnderLine} {
      width: 0%;
    }
    &:hover {
      color: black;
      height: 60px;
      background: white;
      margin-top: 0px;
      ${UnderLine} {
        width: 0%;
        background-color: #74c6cc;
      }
    }
  }
`;

const StatisticsPageTitle = styled.div`
  margin-left: 5px;
`;

const MapPage = styled(Link)`
  color: ${(props) => (props.$isActive === 'MapPage' ? '#74c6cc' : 'white')};
  height: 40px;
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: ease-in-out 0.2s;
  cursor: pointer;
  ${UnderLine} {
    width: ${(props) => (props.$isActive === 'MapPage' ? '100%' : '0%')};
    background-color: #74c6cc;
  }
  &:hover {
    color: #74c6cc;
    height: 45px;
    margin-top: 23px;
    ${UnderLine} {
      width: 100%;
      background-color: #74c6cc;
    }
  }
  @media screen and (max-width: 767px) {
    margin: 0px 0px;
    width: 100%;
    letter-spacing: 5px;
    height: 60px;
    border: 0.5px solid rgba(255, 255, 255, 0.5);
    color: ${(props) => (props.$isActive === 'MapPage' ? 'black' : null)};
    background: ${(props) => (props.$isActive === 'MapPage' ? 'white' : null)};
    ${UnderLine} {
      width: 0%;
    }
    &:hover {
      color: black;
      height: 60px;
      background: white;
      margin-top: 0px;
      ${UnderLine} {
        width: 0%;
        background-color: #74c6cc;
      }
    }
  }
`;

const MapPageTitle = styled.div`
  margin-left: 5px;
`;

const Logout = styled.div`
  color: white;
  height: 40px;
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: ease-in-out 0.2s;
  cursor: pointer;
  &:hover {
    color: #74c6cc;
    height: 45px;
    margin-top: 23px;
    ${UnderLine} {
      width: 100%;
      background-color: #74c6cc;
    }
  }
  @media screen and (max-width: 767px) {
    margin: 0px 0px;
    width: 100%;
    letter-spacing: 5px;
    height: 60px;
    border: 0.5px solid white;
    border: 0.5px solid rgba(255, 255, 255, 0.5);
    &:hover {
      color: black;
      height: 60px;
      background: white;
      margin-top: 0px;
      ${UnderLine} {
        width: 0%;
        background-color: #74c6cc;
      }
    }
  }
`;

const LogoutTitle = styled.div`
  margin-left: 5px;
`;

const Login = styled.div`
  color: white;
  height: 40px;
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: ease-in-out 0.2s;
  cursor: pointer;
  &:hover {
    color: #74c6cc;
    height: 45px;
    margin-top: 23px;
    ${UnderLine} {
      width: 100%;
      background-color: #74c6cc;
    }
  }
  @media screen and (max-width: 767px) {
    margin: 0px 0px;
    width: 100%;
    letter-spacing: 5px;
    height: 60px;
    border: 0.5px solid white;
    border: 0.5px solid rgba(255, 255, 255, 0.5);
    &:hover {
      color: black;
      height: 60px;
      background: white;
      margin-top: 0px;
      ${UnderLine} {
        width: 0%;
        background-color: #74c6cc;
      }
    }
  }
`;

const LoginTitle = styled.div`
  margin-left: 5px;
`;
