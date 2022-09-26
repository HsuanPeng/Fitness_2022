import styled from 'styled-components';

//FontAwesomeIcon
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {} from '@fortawesome/free-brands-svg-icons';

const BodyWeightDataPage = (props) => {
  return (
    <BodyWeightWriteDataZone>
      <Top>
        <Date>
          <DateTitle>日期：</DateTitle>
          <BodyWeightDateInput
            type="date"
            onChange={(e) => props.setWeightDateInput(e.target.value)}
            value={props.weightDateInput}
          ></BodyWeightDateInput>
        </Date>
        <Weight>
          <WeightTitle>體重：</WeightTitle>
          <BodyWeightInput
            onChange={(e) => props.setWeightNumberInput(e.target.value)}
            value={props.weightNumberInput}
            maxLength={3}
          ></BodyWeightInput>
        </Weight>
        <BodyWeightInputButtonOutside>
          <BodyWeightInputButton onClick={props.writeBodyWeight}>新增</BodyWeightInputButton>
        </BodyWeightInputButtonOutside>
      </Top>
      <Bottom>
        {props.weightRecord.length > 0 ? (
          <>
            {props.weightRecord.map((item, index) => (
              <BodyWeightHistoryOutside id={index}>
                <BodyWeightMeasureDate>日期：{item.measureDate}</BodyWeightMeasureDate>
                <BodyWeightChange>
                  變化：
                  {index > 0 ? props.weightNumberLine[index] - props.weightNumberLine[index - 1] : <span>--</span>}KG
                </BodyWeightChange>
                <BodyWeightResult>體重：{item.bodyWeight} KG</BodyWeightResult>
                <BodyWeightDelete
                  onClick={() => {
                    props.deleteWeightRecord(index);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </BodyWeightDelete>
              </BodyWeightHistoryOutside>
            ))}
          </>
        ) : (
          <NoData>請新增資料</NoData>
        )}
      </Bottom>
    </BodyWeightWriteDataZone>
  );
};

export default BodyWeightDataPage;

const BodyWeightWriteDataZone = styled.div`
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

const BodyWeightDateInput = styled.input`
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

const BodyWeightInput = styled.input`
  width: 80px;
  margin-right: 10px;
  border-radius: 7px;
  font-size: 20px;
  padding-left: 8px;
`;

const BodyWeightInputButtonOutside = styled.div`
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

const BodyWeightInputButton = styled.div`
  font-size: 22px;
  letter-spacing: 2px;
  font-weight: 600;
`;

const BodyWeightHistoryOutside = styled.div`
  align-items: center;
  font-size: 20px;
  margin: 10px 0px;
  margin-right: 30px;
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
`;

const BodyWeightMeasureDate = styled.div`
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

const BodyWeightChange = styled.div`
  margin: 0px 10px;
  text-align: start;
  width: 120px;
  @media screen and (max-width: 767px) {
    display: none;
  }
`;

const BodyWeightResult = styled.div`
  margin: 0px 10px;
  width: 150px;
  @media screen and (max-width: 580px) {
    margin-right: 0px;
    margin-top: 10px;
    justify-content: center;
    text-align: center;
  }
`;

const BodyWeightDelete = styled.div`
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
