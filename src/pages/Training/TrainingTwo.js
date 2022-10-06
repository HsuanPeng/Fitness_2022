import React from 'react';
import styled from 'styled-components';

import ChoiceActionZone from './ChoiceActionZone';
import PromoteActionZone from './PromoteActionZone';
import CalculationZone from './CalculationZone';

import logo from '../../images/Logo_blue.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowLeft, faCircleXmark } from '@fortawesome/free-solid-svg-icons';

const TrainingTwo = (props) => {
  return (
    <>
      <Close onClick={props.closeAddTraining}>
        <FontAwesomeIcon icon={faCircleXmark} />
      </Close>
      <ActionText>
        <ActionTop>
          <ActionPicOutside>
            <ActionPic src={logo} />
          </ActionPicOutside>
          <ActionTitle> 加入菜單動作</ActionTitle>
        </ActionTop>
        <ActionLine />
      </ActionText>
      <ActionOutside>
        <ChoiceActionZone
          choiceAction={props.choiceAction}
          setChoiceAction={props.setChoiceAction}
          deleteItem={props.deleteItem}
          totalWeight={props.totalWeight}
          choiceWeight={props.choiceWeight}
          setChoiceWeight={props.setChoiceWeight}
          choiceTimes={props.choiceTimes}
          setChoiceTimes={props.setChoiceTimes}
        />
        <PromoteActionZone
          setPart={props.setPart}
          promoteActions={props.promoteActions}
          addActionItem={props.addActionItem}
          playing={props.playing}
          setPlaying={props.setPlaying}
          setVideoUrl={props.setVideoUrl}
        />
      </ActionOutside>
      <TrainingOutsideTwoBottom>
        <CalculationZone choiceAction={props.choiceAction} data={props.data} dataNull={props.dataNull} />
        {props.playing ? (
          <VideoZone>
            <CloseVideo
              onClick={() => {
                props.setPlaying(null);
              }}
            >
              <FontAwesomeIcon icon={faCircleXmark} />
            </CloseVideo>
            <video autoPlay loop width="100%" controls src={props.videoUrl}></video>
          </VideoZone>
        ) : (
          <NoVideo>
            <NoVideoTitle>範例影片播放區</NoVideoTitle>
          </NoVideo>
        )}
      </TrainingOutsideTwoBottom>
      <CompeleteTrainingSettingOutside>
        <CompeleteTrainingSetting
          type="button"
          value="submit"
          onClick={() => {
            props.compeleteTrainingSetting();
          }}
        >
          完成菜單設定
        </CompeleteTrainingSetting>
      </CompeleteTrainingSettingOutside>
      <TurnOutside>
        <TurnLeft
          onClick={() => {
            props.setOpenTrainingPage(1);
          }}
        >
          <FontAwesomeIcon icon={faCircleArrowLeft} />
        </TurnLeft>
      </TurnOutside>
    </>
  );
};

export default TrainingTwo;

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

const ActionText = styled.div`
  padding-top: 30px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 20px;
  color: #74c6cc;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 3px;

  @media screen and (max-width: 767px) {
    padding-bottom: 0px;
  }
`;

const ActionTop = styled.div`
  display: flex;
  align-items: center;
`;

const ActionPicOutside = styled.div``;

const ActionPic = styled.img`
  width: 70px;
  margin-right: 15px;
  padding-top: 10px;
`;

const ActionTitle = styled.div``;

const ActionLine = styled.div`
  border-bottom: 2px solid #74c6cc;
  margin-top: 15px;
  margin-bottom: 10px;
`;

const ActionOutside = styled.div`
  display: flex;
  justify-content: center;
  width: 1000px;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
    width: 700px;
  }
  @media screen and (max-width: 767px) {
    flex-direction: column;
    width: 550px;
  }
  @media screen and (max-width: 575px) {
    flex-direction: column;
    margin: 0 auto;
    width: 320px;
  }
`;

const CloseVideo = styled.div`
  cursor: pointer;
  width: 30px;
  height: 30px;
  z-index: 90;
  position: absolute;
  scale: 1;
  right: 50px;
  color: #c14e4f;
  font-size: 30px;
  &:hover {
    scale: 1.2;
  }
  @media screen and (max-width: 767px) {
    top: 10px;
    right: 10px;
  }
  @media screen and (max-width: 575px) {
    top: 10px;
    right: 10px;
  }
`;

const VideoZone = styled.div`
  display: block;
  z-index: 65;
  padding: 0px 40px;
  width: 550px;
  position: relative;
  @media screen and (max-width: 1279px) {
    margin-top: 40px;
  }
  @media screen and (max-width: 767px) {
    width: 350px;
    padding: 0px 0px;
  }
  @media screen and (max-width: 575px) {
    width: 300px;
    padding: 0px 0px;
    margin-right: 0px;
  }
`;

const NoVideoTitle = styled.div`
  width: 200px;
  text-align: center;
`;

const NoVideo = styled.div`
  width: 450px;
  height: 253.13px;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px 40px;
  @media screen and (max-width: 1279px) {
    margin-top: 40px;
  }
  @media screen and (max-width: 767px) {
    width: 350px;
  }
  @media screen and (max-width: 575px) {
    width: 250px;
  }
`;

const TrainingOutsideTwoBottom = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 1279px) {
    flex-direction: column-reverse;
  }
`;

const TurnLeft = styled.div`
  cursor: pointer;
  margin-right: auto;
  margin-left: 13px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 30px;
  &:hover {
    color: #74c6cc;
  }
`;

const CompeleteTrainingSettingOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #74c6cc;
  width: 140px;
  margin-top: 15px;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
  color: black;
  cursor: pointer;
  &:hover {
    background: white;
    color: black;
  }
`;

const CompeleteTrainingSetting = styled.div`
  cursor: pointer;
  padding: 8px;
  font-size: 18px;
  letter-spacing: 1.2px;
  font-weight: 600;
`;

const TurnOutside = styled.div`
  display: flex;
  justify-content: space-between;
`;
