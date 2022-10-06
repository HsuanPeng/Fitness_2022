import React from 'react';
import styled from 'styled-components';

import armMuscle from '../../images/armMuscle.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faDumbbell, faWeightHanging } from '@fortawesome/free-solid-svg-icons';

const OpenHistoryActions = (props) => {
  return (
    <>
      {props.showHistoryActions.map((item) => {
        return (
          <HistoryActions>
            <BodyPart>
              <BodyPartPic src={armMuscle} />
              部位：{item.bodyPart}
            </BodyPart>
            <ActionName>
              <FaDumbbellName>
                <FontAwesomeIcon icon={faDumbbell} />
              </FaDumbbellName>
              動作：{item.actionName}
            </ActionName>
            <Weight>
              <FaDumbbellWeight>
                <FontAwesomeIcon icon={faWeightHanging} />
              </FaDumbbellWeight>
              重量：{item.weight} KG
            </Weight>
            <Times>
              <FaDumbbellTimes>
                <FontAwesomeIcon icon={faClock} />
              </FaDumbbellTimes>
              次數：{item.times} 次
            </Times>
          </HistoryActions>
        );
      })}
    </>
  );
};

export default OpenHistoryActions;

const HistoryActions = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  margin: 10px 0px;
  border: 1px solid #818a8e;
  padding: 5px 10px 5px 10px;
  background: rgba(255, 255, 255, 0.5);
  max-width: 900px;
  color: black;
  @media screen and (max-width: 1279px) {
    flex-wrap: wrap;
  }
`;

const BodyPart = styled.div`
  width: 200px;
  display: flex;
  margin-left: 10px;
  @media screen and (max-width: 1279px) {
    width: 270px;
    margin-left: 40px;
  }
  @media screen and (max-width: 767px) {
    width: 200px;
    margin: 5px 0px;
  }
`;

const BodyPartPic = styled.img`
  object: fit;
  width: 25px;
  margin-right: 10px;
  @media screen and (max-width: 767px) {
    width: 25px;
    margin-right: 10px;
  }
`;

const FaDumbbellName = styled.div`
  margin-right: 10px;
  color: white;
`;

const ActionName = styled.div`
  display: flex;
  width: 300px;
  @media screen and (max-width: 1279px) {
    margin-left: 10px;
    width: 270px;
  }
  @media screen and (max-width: 767px) {
    margin: 5px 0px;
  }
`;

const FaDumbbellWeight = styled.div`
  margin-right: 14px;
  color: white;
`;

const Weight = styled.div`
  display: flex;
  width: 200px;
  @media screen and (max-width: 1279px) {
    width: 270px;
    margin-left: 40px;
  }
  @media screen and (max-width: 767px) {
    width: 200px;
    margin: 5px 0px;
  }
`;

const FaDumbbellTimes = styled.div`
  margin-right: 13px;
  color: white;
`;

const Times = styled.div`
  display: flex;
  margin: 5px 0px;
  width: 150px;
  @media screen and (max-width: 1279px) {
    margin-left: 10px;
  }
  @media screen and (max-width: 767px) {
    margin-left: 0px;
  }
`;
