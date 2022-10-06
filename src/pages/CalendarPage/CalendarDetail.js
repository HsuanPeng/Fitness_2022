import React from 'react';
import styled from 'styled-components';

import armMuscle from '../../images/armMuscle.png';

import detailBanner from '../../images/Blue-gymnast-rings.jpg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faClock, faFire, faDumbbell, faWeightHanging } from '@fortawesome/free-solid-svg-icons';

const CalendarDetail = (props) => {
  return (
    <>
      <DetailOutside>
        <Close
          onClick={() => {
            props.setDetail(null);
          }}
        >
          <FontAwesomeIcon icon={faCircleXmark} />
        </Close>
        <Top>
          <DetailTitle>
            <TitlePic>
              <FontAwesomeIcon icon={faFire} />
            </TitlePic>
            {props.detail.title}
          </DetailTitle>
          <Line />
          <DetailActionsOutside>
            {props.detail.actions.map((item, index) => (
              <ActionItem>
                <ActionBodyPart>
                  <BodyPartPic src={armMuscle} />
                  {item.bodyPart}
                </ActionBodyPart>
                <ActionName>
                  <FaDumbbellName>
                    <FontAwesomeIcon icon={faDumbbell} />
                  </FaDumbbellName>
                  {item.actionName}
                </ActionName>
                <Weight>
                  <FaDumbbellWeight>
                    <FontAwesomeIcon icon={faWeightHanging} />
                  </FaDumbbellWeight>
                  {item.weight}KG
                </Weight>
                <Times>
                  <FaDumbbellTimes>
                    <FontAwesomeIcon icon={faClock} />
                  </FaDumbbellTimes>
                  {item.times}次
                </Times>
              </ActionItem>
            ))}
          </DetailActionsOutside>
        </Top>
        <PicOutside>
          <Pic />
        </PicOutside>
      </DetailOutside>
      <Background />
    </>
  );
};

export default CalendarDetail;

const Close = styled.div`
  cursor: pointer;
  width: 30px;
  position: absolute;
  right: 20px;
  top: 10px;
  scale: 1;
  transition: 0.3s;
  font-size: 30px;
  color: #c14e4f;
  &:hover {
    scale: 1.2;
  }
`;

const DetailOutside = styled.div`
  margin: 0 auto;
  position: absolute;
  top: 13%;
  left: calc(50% - 346px);
  z-index: 15;
  background: #475260;
  max-width: 1000px;
  color: white;
  border-top: 0.5rem solid #74c6cc;
  z-index: 20;
  animation-name: detailfadein;
  animation-duration: 0.5s;
  @keyframes detailfadein {
    0% {
      transform: translateY(-2%);
      opacity: 0%;
    }
    100% {
      transform: translateY(0%);
      opacity: 100%;
    }
  }
  @media screen and (max-width: 767px) {
    max-width: 320px;
    left: calc(50% - 160px);
  }
`;

const Top = styled.div`
  padding: 0px 20px;
`;

const TitlePic = styled.div`
  margin-right: 12px;
`;

const DetailTitle = styled.div`
  display: flex;
  margin-top: 45px;
  font-weight: 600;
  letter-spacing: 3px;
  color: #74c6cc;
  font-size: 25px;
`;

const Line = styled.div`
  border-bottom: 2px solid #74c6cc;
  margin: 20px 0px;
`;

const DetailActionsOutside = styled.div`
  font-size: 20px;
`;

const ActionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
  border: 1px solid #818a8e;
  margin: 10px 0px;
  border: 1px solid #818a8e;
  padding: 5px 10px 5px 10px;
  background: rgba(255, 255, 255, 0.5);
  @media screen and (max-width: 1279px) {
    flex-wrap: wrap;
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

const ActionBodyPart = styled.div`
  width: 150px;
  display: flex;
  @media screen and (max-width: 767px) {
    width: 200px;
    margin: 5px 0px;
  }
`;

const FaDumbbellName = styled.div`
  margin-right: 10px;
  color: white;
`;

const ActionName = styled.div`
  width: 250px;
  display: flex;
  @media screen and (max-width: 767px) {
    margin: 5px 0px;
  }
`;

const FaDumbbellWeight = styled.div`
  margin-right: 14px;
  color: white;
`;

const Weight = styled.div`
  width: 150px;
  display: flex;
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
  width: 80px;
  display: flex;
  margin: 5px 0px;
`;

const PicOutside = styled.div`
  width: 100%;
  height: 200px;
  margin: 30px 0px 40px 0px;
`;

const Pic = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${detailBanner});
  background-size: cover;
  background-position: 30% 50%;
  background-repeat: no-repeat;
`;

const Background = styled.div`
  background: black;
  top: 0;
  opacity: 50%;
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  display: block;
`;
