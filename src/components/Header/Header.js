import React, { useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

import UserContext from '../../contexts/UserContext';

import LogoBlue from '../../images/Logo_blue.png';
import trainingBanner from '../../images/Beautiful-woman-holding-heavy-604970.jpg';
import calendarBanner from '../../images/Strong-man-doing-bench-press-in-gym.jpg';
import statisticsBanner from '../../images/Athlete-preparing-for-training.jpg';
import mapBanner from '../../images/Equipment-rack-in-gym.JPG';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
  const { isLoggedIn, userSignOut, signIn, currentPage, setCurrentPgae } = useContext(UserContext);

  const location = useLocation();

  const [openMenu, setOpenMenu] = useState(false);

  const [backgroundPic, setBackgroundPic] = useState(null);

  useEffect(() => {
    if (location.pathname === `/training`) {
      setBackgroundPic(trainingBanner);
      setOpenMenu(false);
    } else if (location.pathname === `/calendar`) {
      setBackgroundPic(calendarBanner);
      setOpenMenu(false);
    } else if (location.pathname === `/statistics`) {
      setBackgroundPic(statisticsBanner);
      setOpenMenu(false);
    } else if (location.pathname === `/map`) {
      setBackgroundPic(mapBanner);
      setOpenMenu(false);
    } else if (location.pathname === `/`) {
      setBackgroundPic(null);
      setOpenMenu(false);
    }
  }, [location.pathname]);

  return (
    <>
      <HeaderZone>
        <MenuIcon
          onClick={() => {
            setOpenMenu((prev) => !prev);
          }}
        >
          {openMenu ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faBars} />}
        </MenuIcon>
        <LogoZone
          to="/"
          onClick={() => {
            setCurrentPgae('');
          }}
        >
          <Logo></Logo>
          <LogoTitle>健人網</LogoTitle>
        </LogoZone>
        <PageSelection $openMenu={openMenu}>
          <PageButton
            to="/training"
            onClick={() => {
              setCurrentPgae('TrainingPage');
            }}
            $currentPage={currentPage === 'TrainingPage'}
          >
            <PageButtonTitle> 健菜單</PageButtonTitle>
            <UnderLine />
          </PageButton>
          <PageButton
            to="/calendar"
            onClick={() => {
              setCurrentPgae('Calendar');
            }}
            $currentPage={currentPage === 'Calendar'}
          >
            <PageButtonTitle>健日曆</PageButtonTitle>
            <UnderLine />
          </PageButton>
          <PageButton
            to="/statistics"
            onClick={() => {
              setCurrentPgae('StatisticsPage');
            }}
            $currentPage={currentPage === 'StatisticsPage'}
          >
            <PageButtonTitle> 健數據</PageButtonTitle>
            <UnderLine />
          </PageButton>
          <PageButton
            to="/map"
            onClick={() => {
              setCurrentPgae('MapPage');
            }}
            $currentPage={currentPage === 'MapPage'}
          >
            <PageButtonTitle> 健地圖</PageButtonTitle>
            <UnderLine />
          </PageButton>
          {isLoggedIn ? (
            <LogButton
              onClick={() => {
                userSignOut();
              }}
            >
              <LogButtonTitle>登出</LogButtonTitle>
              <UnderLine></UnderLine>
            </LogButton>
          ) : (
            <LogButton
              onClick={() => {
                signIn();
              }}
            >
              <LogButtonTitle> 登入</LogButtonTitle>
              <UnderLine />
            </LogButton>
          )}
        </PageSelection>
      </HeaderZone>
      {backgroundPic && (
        <BannerOutside>
          <Banner style={{ backgroundImage: `url(${backgroundPic})` }} $backgroundPic={backgroundPic}>
            {location.pathname === `/training` && <BannerText>開始我的記錄！</BannerText>}
            {location.pathname === `/calendar` && <BannerText>讓健身成為生活的一部分！</BannerText>}
            {location.pathname === `/statistics` && <BannerText>追蹤自己的身體變化！</BannerText>}
            {location.pathname === `/map` && <BannerText>找出離你最近的健身房！</BannerText>}
            {location.pathname === `/` && <BannerText></BannerText>}
          </Banner>
        </BannerOutside>
      )}
    </>
  );
};

export default Header;

const HeaderZone = styled.div`
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
    color: white;
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
  width: 260px;
  scale: 1;
  transition: ease-in-out 0.2s;
  &:hover {
    scale: 1.05;
  }
  @media screen and (max-width: 1279px) {
    width: 220px;
  }
  @media screen and (max-width: 767px) {
    margin: 0 auto;
  }
`;

const Logo = styled.div`
  color: white;
  background-image: url(${LogoBlue});
  background-size: cover;
  width: 115px;
  height: 50px;
  margin-right: 10px;
  @media screen and (max-width: 1279px) {
    width: 103px;
    height: 45px;
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
    width: 450px;
    font-size: 22px;
    letter-spacing: 5px;
  }
  @media screen and (max-width: 767px) {
    position: fixed;
    z-index: 30;
    left: 0%;
    top: 8.1%;
    transform: ${(props) => (props.$openMenu ? 'translateX(0)' : 'translateX(-100%)')};
    transition: ${(props) => (props.$openMenu ? 'all 0.3s' : 'all 0s')};
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

const PageButton = styled(Link)`
  color: ${(props) => (props.$currentPage ? '#74c6cc' : 'white')};
  height: 40px;
  margin-top: 28px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: ease-in-out 0.2s;
  cursor: pointer;
  ${UnderLine} {
    width: ${(props) => (props.$currentPage ? '100%' : '0%')};
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
    color: ${(props) => props.$currentPage && 'black'};
    background: ${(props) => props.$currentPage && 'white'};
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

const PageButtonTitle = styled.div`
  margin-left: 5px;
`;

const LogButton = styled.div`
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

const LogButtonTitle = styled.div`
  margin-left: 5px;
`;

const BannerOutside = styled.div`
  margin-top: 90px;
  height: 320px;
  @media screen and (max-width: 1279px) {
    height: 200px;
  }
`;

const Banner = styled.div`
  background-size: cover;
  background-position: ${(props) => {
    if (props.$backgroundPic === trainingBanner) {
      return '0% 20%';
    } else if (props.$backgroundPic === calendarBanner) {
      return '0% 50%';
    } else if (props.$backgroundPic === statisticsBanner) {
      return '0% 45%';
    } else if (props.$backgroundPic === mapBanner) {
      return '25% 75%';
    }
  }};
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
