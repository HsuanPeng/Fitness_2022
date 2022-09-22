import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const HistoryZone = (props) => {
  return (
    <HistoryOutside>
      {props.trainingData.map((item, index) => (
        <HistoryItemsOutside
          index={index}
          key={uuidv4()}
          onClick={() => {
            props.openHistory(index);
          }}
        >
          {!item.picture ? (
            <NoPicOutside>
              <NoPic>請上傳照片</NoPic>
            </NoPicOutside>
          ) : (
            <HistoryPicOutside>
              <HistoryPic src={item.picture}></HistoryPic>
            </HistoryPicOutside>
          )}
          <HistoryRight>
            <HistoryTitle>主題：{item.title}</HistoryTitle>
            <HistoryDate>訓練日期：{item.trainingDate}</HistoryDate>
            <HistoryWeight>總重量：{item.totalWeight} KG</HistoryWeight>
            <HistoryTimes>總動作數：{item.totalActions} 個</HistoryTimes>
            <HistoryComplete>狀態：{item.complete}</HistoryComplete>
          </HistoryRight>
          <MaskText>點擊看更多資訊</MaskText>
          <Mask></Mask>
        </HistoryItemsOutside>
      ))}
    </HistoryOutside>
  );
};

export default HistoryZone;

const HistoryOutside = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1200px;
  width: 95%;
  margin: 0 auto;
  @media screen and (max-width: 1279px) {
    max-width: 800px;
  }
  @media screen and (max-width: 767px) {
    max-width: 350px;
  }
`;

const MaskText = styled.div`
  color: white;
  font-size: 30px;
  font-weight: 600;
  position: absolute;
  z-index: 6;
  margin-top: 65px;
  opacity: 0%;
  transition: 0.2s;
  letter-spacing: 4px;
`;

const Mask = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 0%;
  position: absolute;
  top: 0;
  transition: 0.2s;
  color: red;
  background-color: black;
  opacity: 60%;
  z-index: 5;
`;

const HistoryItemsOutside = styled.div`
  position: relative;
  display: flex;
  justify-content: space-evenly;
  margin: 0px 25px 40px 25px;
  cursor: pointer;
  background: #475260;
  padding: 20px;
  font-size: 16px;
  width: 45%;
  border-top: 0.5rem solid #74c6cc;
  &:hover {
    ${Mask} {
      height: 100%;
    }
    ${MaskText} {
      opacity: 100%;
    }
  }
  @media screen and (max-width: 1279px) {
    width: 540px;
  }
  @media screen and (max-width: 767px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
`;

const NoPicOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 180px;
  border: 1px solid #818a8e;
  border-radius: 5%;
  color: white;
`;

const NoPic = styled.div``;

const HistoryPicOutside = styled.div`
  width: 250px;
  height: 180px;
`;

const HistoryPic = styled.img`
  object-fit: contain;
  width: 200px;
  height: 180px;
`;

const HistoryRight = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

const HistoryTitle = styled.span`
  font-weight: 700;
  letter-spacing: 2px;
  color: #74c6cc;
  font-size: 24px;
  @media screen and (max-width: 767px) {
    margin-top: 15px;
  }
`;
const HistoryDate = styled.div`
  font-size: 18px;
  @media screen and (max-width: 767px) {
    margin-top: 15px;
  }
`;
const HistoryWeight = styled.div`
  font-size: 18px;
  @media screen and (max-width: 767px) {
    margin-top: 15px;
  }
`;
const HistoryTimes = styled.div`
  font-size: 18px;
  @media screen and (max-width: 767px) {
    margin-top: 15px;
  }
`;
const HistoryComplete = styled.div`
  font-size: 18px;
  @media screen and (max-width: 767px) {
    margin-top: 15px;
  }
`;
