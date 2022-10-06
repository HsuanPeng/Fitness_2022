import React from 'react';
import styled from 'styled-components';

const SkeletonItemList = () => {
  return (
    <SkeletonItem>
      <SkeletonLeft />
      <SkeletonRight>
        <SkeletonRightContent />
        <SkeletonRightContent />
        <SkeletonRightContent />
        <SkeletonRightContent />
        <SkeletonRightContent />
      </SkeletonRight>
    </SkeletonItem>
  );
};

export default SkeletonItemList;

const SkeletonItem = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 0px 25px 40px 25px;
  width: 460.69px;
  height: 228px;
  border-top: 0.5rem solid #74c6cc;
  background: #a9a9a9;
  @media screen and (max-width: 767px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 300px;
    height: 453px;
  }
`;

const SkeletonLeft = styled.div`
  height: 180px;
  width: 200px;
  border-radius: 5%;
  margin-left: 5px;
  background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 80%
    ),
    #dcdcdc;
  background-repeat: repeat-y;
  background-size: 50px 500px;
  background-position: 0 0;
  animation: shine 1s infinite;
  @keyframes shine {
    to {
      background-position: 100% 0;
    }
  }
  @media screen and (max-width: 767px) {
    margin-left: 0px;
    margin-top: 12px;
  }
`;

const SkeletonRight = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin-left: 10px;
  margin-right: 8px;
  height: 180px;
  @media screen and (max-width: 767px) {
    margin-left: 0px;
    margin-right: 0px;
    height: 230px;
  }
`;

const SkeletonRightContent = styled.div`
  width: 202px;
  height: 27px;
  background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 80%
    ),
    #dcdcdc;
  background-repeat: repeat-y;
  background-size: 50px 500px;
  background-position: 0 0;
  animation: shine 1s infinite;
  @keyframes shine {
    to {
      background-position: 100% 0;
    }
  }
  border-radius: 15px;
`;
