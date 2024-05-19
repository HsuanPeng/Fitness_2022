import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const BodyWeightPage = (props) => {
  return (
    <WriteDataZone>
      <Top>
        <Date>
          <DateTitle>日期：</DateTitle>
          <DateInput
            type="date"
            onChange={(e) => props.setWeightDateInput(e.target.value)}
            value={props.weightDateInput}
            max={new window.Date().toISOString().split('T')[0]}
          ></DateInput>
        </Date>
        <Weight>
          <WeightTitle>體重：</WeightTitle>
          <Input
            onChange={(e) => props.setWeightNumberInput(e.target.value)}
            value={props.weightNumberInput}
            maxLength={6}
            placeholder="0"
            type="number"
          ></Input>
        </Weight>
        <InputButtonOutside>
          <InputButton onClick={props.writeBodyWeight}>新增</InputButton>
        </InputButtonOutside>
      </Top>
      <WeightRemind>＊體重請輸入阿拉伯數字，最多6字</WeightRemind>
      <Bottom>
        {props.weightRecord.length > 0 ? (
          <>
            {props.weightRecord.map((item, index) => (
              <HistoryOutside id={index}>
                <MeasureDate>日期：{item.measureDate}</MeasureDate>
                <Change>
                  變化：
                  {index > 0 ? (
                    (props.weightNumberLine[index] - props.weightNumberLine[index - 1]).toFixed(1)
                  ) : (
                    <span>--</span>
                  )}
                  KG
                </Change>
                <Result>體重：{item.bodyWeight} KG</Result>
                <Delete
                  onClick={() => {
                    props.deleteWeightRecord(index);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Delete>
              </HistoryOutside>
            ))}
          </>
        ) : (
          <NoData>請新增資料</NoData>
        )}
      </Bottom>
    </WriteDataZone>
  );
};

export default BodyWeightPage;

const WriteDataZone = styled.div`
  margin-right: 20px;
  @media screen and (max-width: 767px) {
    margin-right: 0px;
  }
`;

const Top = styled.div`
  display: flex;
  margin: 25px 0px;
  @media screen and (max-width: 767px) {
    flex-direction: column;
    margin: 20px 0px;
  }
`;

const Date = styled.div`
  display: flex;
  margin-right: 25px;
  align-items: center;
  @media screen and (max-width: 767px) {
    margin-right: 0px;
  }
`;

const DateTitle = styled.div`
  font-size: 20px;
  letter-spacing: 2px;
  margin-right: 10px;
`;

const DateInput = styled.input`
  border-radius: 7px;
  font-size: 20px;
`;

const Weight = styled.div`
  display: flex;
  margin-right: 25px;
  align-items: center;
  @media screen and (max-width: 767px) {
    margin-right: 0px;
    margin-top: 15px;
  } ;
`;

const WeightTitle = styled.div`
  font-size: 20px;
  letter-spacing: 2px;
  margin-right: 10px;
`;

const Input = styled.input`
  width: 80px;
  margin-right: 10px;
  border-radius: 7px;
  font-size: 20px;
  padding-left: 8px;
`;

const InputButtonOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #74c6cc;
  width: 60px;
  color: black;
  cursor: pointer;
  &:hover {
    background: white;
    color: black;
  }
  @media screen and (max-width: 767px) {
    margin-top: 15px;
  }
`;

const WeightRemind = styled.div`
  color: #cd5c5c;
  font-size: 16px;
  letter-spacing: 2px;
  margin-top: -12px;
`;

const InputButton = styled.div`
  font-size: 22px;
  letter-spacing: 2px;
  font-weight: 600;
`;

const HistoryOutside = styled.div`
  align-items: center;
  font-size: 20px;
  margin: 10px 0px;
  border: 1px solid #818a8e;
  padding: 5px 10px 5px 10px;
  background: rgba(255, 255, 255, 0.5);
  color: black;
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 580px) {
    flex-direction: column;
  }
`;

const Bottom = styled.div`
  height: 350px;
  overflow-y: scroll;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
  &::-webkit-scrollbar-track-piece {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.4);
    border: 1px solid slategrey;
  }
  &::-webkit-scrollbar-track {
    box-shadow: transparent;
  }
`;

const MeasureDate = styled.div`
  margin-right: 10px;
  display: flex;
  justify-content: start;
  width: 180px;
  @media screen and (max-width: 580px) {
    margin-right: 0px;
    margin-top: 5px;
    justify-content: center;
  }
`;

const Change = styled.div`
  margin: 0px 10px;
  text-align: start;
  width: 148px;
  @media screen and (max-width: 767px) {
    display: none;
  }
`;

const Result = styled.div`
  margin-left: 15px;
  width: 160px;
  @media screen and (max-width: 580px) {
    margin-right: 0px;
    margin-top: 10px;
    justify-content: center;
    text-align: center;
  }
`;

const Delete = styled.div`
  margin: 0px 5px;
  cursor: pointer;
  text-align: center;
  color: black;
  width: 30px;
  &:hover {
    color: red;
  }
  @media screen and (max-width: 580px) {
    margin-top: 10px;
    justify-content: center;
  }
`;

const NoData = styled.div`
  width: 600px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  margin: 10px 0px;
  margin-right: 10px;
  border: 1px solid #818a8e;
  padding: 20px 10px 20px 10px;
  color: white;
  border: 1px solid #818a8e;
  @media screen and (max-width: 767px) {
    width: 442px;
  }
  @media screen and (max-width: 580px) {
    width: 203px;
  }
`;
