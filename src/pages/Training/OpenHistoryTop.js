import React from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeartCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { faGooglePlus } from '@fortawesome/free-brands-svg-icons';

const OpenhistoryTop = (props) => {
  return (
    <HistoryTop>
      <TitleFavorite>
        <Title>主題：{props.showHistory.title}</Title>
        <AddFavoriteOutside onClick={props.addFavoriteTraining}>
          <AddFavorite>加入喜愛菜單</AddFavorite>
          <FaGooglePlus>
            <FontAwesomeIcon icon={faHeartCirclePlus} />
          </FaGooglePlus>
        </AddFavoriteOutside>
      </TitleFavorite>
      <Detail>
        <Date>
          <DateTitle>訓練日期：{props.showHistory.trainingDate}</DateTitle>
          <AddGoogleCalendarOutside>
            <AddGoogleCalendar id="authorize_button" onClick={props.handleAuthClick}>
              加入google日曆
            </AddGoogleCalendar>
            <FaGooglePlus>
              <FontAwesomeIcon icon={faGooglePlus} />
            </FaGooglePlus>
          </AddGoogleCalendarOutside>
        </Date>
        <TotalWeight>總重量：{props.showHistory.totalWeight} KG</TotalWeight>
        <TotalActions>總動作數：{props.showHistory.totalActions} 個</TotalActions>
      </Detail>
      <DescriptionComplete>
        <Description>本次訓練重點：{props.showHistory.description}</Description>
        <Complete>狀態：{props.showHistory.complete}</Complete>
      </DescriptionComplete>
    </HistoryTop>
  );
};

export default OpenhistoryTop;

const HistoryTop = styled.div`
  @media screen and (max-width: 1279px) {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
  }
`;

const TitleFavorite = styled.div`
  display: flex;
  align-items: center;
  margin-top: 40px;

  @media screen and (max-width: 767px) {
    flex-direction: column;
    justify-content: start;
    align-items: start;
  }
`;

const Title = styled.span`
  margin: 10px 0px;
  font-size: 25px;
  color: white;
  font-weight: 700;
  letter-spacing: 2px;
  background-image: linear-gradient(transparent 50%, rgba(25, 26, 30, 0.8) 50%);
  padding: 0px 10px;
  background-size: 100% 100%;
`;

const AddFavorite = styled.div`
  font-size: 18px;
  letter-spacing: 1px;
  font-weight: 600;
`;

const AddFavoriteOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  width: 160px;
  color: black;
  cursor: pointer;
  margin-left: 20px;
  border-radius: 20px;
  margin-top: 10px;
  &:hover {
    color: #c14e4f;
  }
  @media screen and (max-width: 767px) {
    margin: 10px 0px;
    margin-left: 0px;
  }
`;

const Date = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 10px;
  @media screen and (max-width: 767px) {
    flex-direction: column;
    align-items: start;
    margin-top: 0px;
  }
`;

const DateTitle = styled.div`
  @media screen and (max-width: 767px) {
    margin: 10px 0px;
  }
`;

const Detail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
    align-items: start;
  }
`;

const DescriptionComplete = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  @media screen and (max-width: 1279px) {
    width: 100%;
  }
  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

const Complete = styled.div`
  margin: 10px 0px;
  animation-name: ${(props) => props.$isComplete && 'flipUp'};
  animation-duration: 2s;
  animation-iteration-count: 1;
  @keyframes flipUp {
    0% {
      opacity: 0;
      transform: rotateX(90def);
    }
    50% {
      opacity: 1;
      transform: rotateX(720deg);
    }
    100% {
      opacity: 1;
      transform: rotateX(720deg);
    }
  }
`;

const FaGooglePlus = styled.div`
  margin-left: 3px;
`;

const AddGoogleCalendarOutside = styled(AddFavoriteOutside)`
  width: 180px;
  margin-top: 0px;
  &:hover {
    background: black;
    color: white;
  }
  @media screen and (max-width: 767px) {
    margin-top: 10px;
  }
`;

const AddGoogleCalendar = styled.div`
  font-size: 18px;
  letter-spacing: 1px;
  font-weight: 600;
`;

const TotalWeight = styled.div`
  margin: 10px 0px;
`;

const TotalActions = styled.div`
  margin: 10px 0px;
`;

const Description = styled.div`
  margin: 10px 0px;
`;
