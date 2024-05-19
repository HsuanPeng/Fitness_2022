import styled from "styled-components";

const HistoryZone = (props) => {
  return (
    <HistoryOutside>
      {props.trainingData.map((item, index) => (
        <HistoryItemsOutside
          index={item.docID}
          onClick={() => {
            props.openHistory(index);
          }}
        >
          {item.picture ? (
            <HistoryPicOutside>
              <HistoryPic src={item.picture}></HistoryPic>
            </HistoryPicOutside>
          ) : (
            <NoPicOutside>請上傳照片</NoPicOutside>
          )}
          <HistoryRight>
            <HistoryTitleOutside>
              <HistoryTitle>主題：{item.title}</HistoryTitle>
            </HistoryTitleOutside>
            <HistoryItem>訓練日期：{item.trainingDate}</HistoryItem>
            <HistoryItem>總重量：{item.totalWeight} KG</HistoryItem>
            <HistoryItem>總動作數：{item.totalActions} 個</HistoryItem>
            <HistoryItem>狀態：{item.complete}</HistoryItem>
          </HistoryRight>
          <MaskText>點擊看更多資訊</MaskText>
          <Mask></Mask>
        </HistoryItemsOutside>
      ))}
    </HistoryOutside>
  );
};

export default HistoryZone;

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

const HistoryOutside = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  @media screen and (max-width: 1279px) {
    max-width: 800px;
  }
  @media screen and (max-width: 767px) {
    max-width: 350px;
  }
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
  width: 465px;
  border-top: 0.5rem solid #74c6cc;
  &:hover {
    ${Mask} {
      height: 100%;
    }
    ${MaskText} {
      opacity: 100%;
    }
  }
  @media screen and (max-width: 767px) {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: 440px;
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

const HistoryPicOutside = styled.div`
  height: 180px;
  width: 200px;
`;

const HistoryPic = styled.img`
  border-radius: 12px;
  object-fit: cover;
  width: 200px;
  height: 180px;
  border: 2px solid #74c6cc;
`;

const HistoryRight = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin-left: 18px;
`;

const HistoryTitleOutside = styled.div`
  width: 200px;
  @media screen and (max-width: 767px) {
    width: 240px;
  }
`;

const HistoryTitle = styled.div`
  font-weight: 700;
  letter-spacing: 2px;
  color: #74c6cc;
  font-size: 24px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  @media screen and (max-width: 767px) {
    margin-top: 15px;
  }
`;
const HistoryItem = styled.div`
  font-size: 20px;
  @media screen and (max-width: 767px) {
    margin-top: 15px;
  }
`;
