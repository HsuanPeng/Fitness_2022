import React from 'react';
import styled from 'styled-components';

//圖片
import HomePic from './Homepic.png';

const HomeCenter = styled.div`
  background-image: url(${HomePic});
  background-size: 100%;
  width: 500px;
  height: 500px;
  background-repeat: no-repeat;
`;

const Home = () => {
  return (
    <>
      <div>首頁</div>
      <HomeCenter></HomeCenter>
    </>
  );
};

export default Home;
