import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

//FontAwesomeIcon
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {} from '@fortawesome/free-brands-svg-icons';

const BodyFatDataPage = (props) => {
  return (
    <BodyFatWriteDataZone>
      <Top>
        <Date>
          <DateTitle>日期：</DateTitle>
          <BodyFatDateInput type="date" onChange={(e) => props.setFatDateInput(e.target.value)}></BodyFatDateInput>
        </Date>
        <Fat>
          <FatTitle>體脂肪率：</FatTitle>
          <BodyFatInput onChange={(e) => props.setFatNumberInput(e.target.value)}></BodyFatInput>
        </Fat>
        <BodyFatInputButtonOutside>
          <BodyFatInputButton onClick={props.writeBodyFat}>新增</BodyFatInputButton>
        </BodyFatInputButtonOutside>
      </Top>
      <Bottom>
        {props.fatRecord.length > 0 ? (
          <>
            {props.fatRecord.map((item, index) => (
              <BodyFatHistoryOutside id={index} key={uuidv4()}>
                <BodyFatMeasureDate>日期：{item.measureDate}</BodyFatMeasureDate>
                <BodyFatChange>
                  變化：
                  {index > 0 ? props.fatNumberLine[index] - props.fatNumberLine[index - 1] : <span>--</span>}%
                </BodyFatChange>
                <BodyFatResult>體脂肪率：{item.bodyFat}%</BodyFatResult>
                <BodyFatDelete
                  onClick={() => {
                    props.deleteFatRecord(index);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </BodyFatDelete>
              </BodyFatHistoryOutside>
            ))}
          </>
        ) : (
          <NoData>請新增資料</NoData>
        )}
      </Bottom>
    </BodyFatWriteDataZone>
  );
};

export default BodyFatDataPage;

const BodyFatWriteDataZone = styled.div`
  margin-right: 40px;
  @media screen and (max-width: 1279px) {
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

const BodyFatDateInput = styled.input`
  border-radius: 7px;
  font-size: 20px;
`;

const Fat = styled.div`
  display: flex;
  margin-right: 25px;
  align-items: center;
  @media screen and (max-width: 767px) {
    margin-right: 0px;
    margin-top: 15px;
  }
`;

const FatTitle = styled.div`
  font-size: 20px;
  letter-spacing: 2px;
  margin-right: 10px;
`;

const BodyFatInput = styled.input`
  width: 80px;
  margin-right: 10px;
  border-radius: 7px;
  font-size: 20px;
  padding-left: 8px;
`;

const BodyFatInputButtonOutside = styled.div`
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

const BodyFatInputButton = styled.div`
  font-size: 22px;
  letter-spacing: 2px;
  font-weight: 600;
`;

const BodyFatHistoryOutside = styled.div`
  align-items: center;
  font-size: 20px;
  margin: 10px 0px;
  margin-right: 30px;
  border: 1px solid #818a8e;
  padding: 5px 10px 5px 10px;
  background: #818a8e;
  color: black;
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 580px) {
    flex-direction: column;
  }
`;

const Bottom = styled.div`
  height: 350px;
  -y: scroll;
`;

const BodyFatMeasureDate = styled.div`
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

const BodyFatChange = styled.div`
  margin: 0px 10px;
  text-align: start;
  width: 120px;
  @media screen and (max-width: 767px) {
    display: none;
  }
`;

const BodyFatResult = styled.div`
  margin: 0px 10px;
  width: 150px;
  @media screen and (max-width: 580px) {
    margin-right: 0px;
    margin-top: 10px;
    justify-content: center;
    text-align: center;
  }
`;

const BodyFatDelete = styled.div`
  margin: 0px 5px;
  cursor: pointer;
  text-align: center;
  color: black;
  width: 50px;
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
