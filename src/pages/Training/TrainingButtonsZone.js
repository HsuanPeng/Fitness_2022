import React from 'react';
import styled from 'styled-components';

const TrainingButtonsZone = (props) => {
  return (
    <TrainingButtons>
      <ButtonOutside>
        <AddTrainingTable
          onClick={() => {
            props.addTraining();
            props.getFavoriteTrainings();
          }}
        >
          建立菜單
        </AddTrainingTable>
      </ButtonOutside>
      <ButtonOutside>
        <ManageFavoriteTraining onClick={props.manageFavoriteTraining}>喜愛菜單</ManageFavoriteTraining>
      </ButtonOutside>
    </TrainingButtons>
  );
};

export default TrainingButtonsZone;

const TrainingButtons = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
`;

const ButtonOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #74c6cc;
  width: 180px;
  margin: 40px 20px 40px 20px;
  color: black;
  cursor: pointer;
  transition: ease-in-out 0.2s;
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
  @media screen and (max-width: 767px) {
    width: 120px;
    margin: 40px 20px 40px 0px;
  }
`;

const AddTrainingTable = styled.div`
  padding: 10px;
  font-size: 25px;
  letter-spacing: 2px;
  font-weight: 600;
  @media screen and (max-width: 767px) {
    font-size: 18px;
  }
`;

const ManageFavoriteTraining = styled.div`
  padding: 10px;
  font-size: 25px;
  letter-spacing: 2px;
  font-weight: 600;
  @media screen and (max-width: 767px) {
    font-size: 18px;
  }
`;
