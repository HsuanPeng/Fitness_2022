import React, { useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

//pic
import HomePic from '../../images/Man-performs-dumbbell-rows-451139.jpg';

//components
import UserContext from '../../contexts/UserContext';

const Home = () => {
  let navigate = useNavigate();

  const {
    isLoggedIn,
    setIsLoggedIn,
    userSignOut,
    signInWithGoogle,
    uid,
    displayName,
    email,
    signIn,
    currentPage,
    setCurrentPgae,
  } = useContext(UserContext);

  return (
    <>
      <Wrapper>
        <MainPicZone>
          <HomeContentZone>
            <HomeTitle>全力以赴 你會很酷</HomeTitle>
            <HomeContent>菜單規劃｜數據追蹤｜健身地圖</HomeContent>
            <HomeContentMobile>
              <Training>菜單規劃</Training>
              <Statistics>數據追蹤</Statistics>
              <Map>健身地圖</Map>
            </HomeContentMobile>
          </HomeContentZone>
          <GoTrainingPageOutside
            onClick={() => {
              navigate('/training', { replace: true });
            }}
          >
            <GoTrainingPage
              onClick={() => {
                setCurrentPgae('TrainingPage');
              }}
            >
              開始我的紀錄！
            </GoTrainingPage>
          </GoTrainingPageOutside>
        </MainPicZone>
      </Wrapper>
    </>
  );
};

export default Home;

const Wrapper = styled.div`
  max-width: 1440px;
  padding-top: 90px;
`;

const MainPicZone = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${HomePic});
  background-size: cover;
  background-position: 30% 30%;
  position: absolute;
  @media screen and (max-width: 767px) {
    background-position: 60% 50%;
  }
`;

const HomeContentZone = styled.div`
  color: white;
  display: flex;
  align-items: start;
  justify-content: center;
  flex-direction: column;
  padding-top: 450px;
  padding-left: 150px;
  @media screen and (max-width: 767px) {
    max-width: 767px;
    padding-top: 350px;
    padding-left: 0px;
    align-items: center;
  }
`;

const HomeTitle = styled.div`
  font-size: 40px;
  letter-spacing: 2px;
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
  @media screen and (max-width: 767px) {
    font-size: 35px;
  }
`;

const HomeContent = styled.div`
  font-size: 30px;
  letter-spacing: 5px;
  margin-top: 20px;
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
  @media screen and (max-width: 767px) {
    display: none;
  }
`;

const HomeContentMobile = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-size: 28px;
`;

const Training = styled.div`
  display: none;
  padding-top: 30px;
  @media screen and (max-width: 767px) {
    display: block;
  }
`;

const Statistics = styled.div`
  display: none;
  padding-top: 30px;
  @media screen and (max-width: 767px) {
    display: block;
  }
`;

const Map = styled.div`
  display: none;
  padding-top: 30px;
  @media screen and (max-width: 767px) {
    display: block;
  }
`;

const GoTrainingPageOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #74c6cc;
  width: 250px;
  margin: 60px auto;
  color: black;
  cursor: pointer;
  transition: ease-in-out 0.2s;
  animation-name: light;
  animation-duration: 2.5s;
  animation-iteration-count: infinite;
  &:hover {
    background: white;
    color: black;
  }
  @keyframes light {
    0% {
      box-shadow: 0px 0px 0px white;
    }
    50% {
      box-shadow: 0px 0px 20px white;
    }
    100% {
      box-shadow: 0px 0px 0px white;
    }
  }
`;

const GoTrainingPage = styled.div`
  padding: 13px;
  font-size: 25px;
  letter-spacing: 2px;
  font-weight: 600;
`;
