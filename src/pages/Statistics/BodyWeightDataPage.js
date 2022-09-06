import styled from 'styled-components';

const BodyWeightDataPage = (props) => {
  return (
    <BodyWeightWriteDataZone>
      <BodyWeightWriteDataTitle>登錄數據</BodyWeightWriteDataTitle>
      日期
      <BodyWeightDateInput type="date" onChange={(e) => props.setWeightDateInput(e.target.value)}></BodyWeightDateInput>
      體重
      <BodyWeightInput onChange={(e) => props.setWeightNumberInput(e.target.value)}></BodyWeightInput>KG
      <BodyWeightInputButton onClick={props.writeBodyWeight}>登錄</BodyWeightInputButton>
      {props.weightRecord.map((item, index) => (
        <BodyWeightHistoryOutside id={index}>
          <BodyWeightMeasureDate>日期：{item.measureDate}</BodyWeightMeasureDate>
          <BodyWeightChange>
            距離上次變化：
            {index > 0 ? props.weightNumberLine[index] - props.weightNumberLine[index - 1] : <span>--</span>}KG
          </BodyWeightChange>
          <BodyWeightResult>體重：{item.bodyWeight} KG</BodyWeightResult>
          <BodyWeightDelete
            onClick={() => {
              props.deleteWeightRecord(index);
            }}
          >
            刪除
          </BodyWeightDelete>
        </BodyWeightHistoryOutside>
      ))}
    </BodyWeightWriteDataZone>
  );
};

export default BodyWeightDataPage;

const BodyWeightWriteDataZone = styled.div``;

const BodyWeightWriteDataTitle = styled.div``;

const BodyWeightHistoryOutside = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BodyWeightMeasureDate = styled.div``;

const BodyWeightChange = styled.div``;

const BodyWeightResult = styled.div``;

const BodyWeightInput = styled.input``;

const BodyWeightInputButton = styled.button``;

const BodyWeightDateInput = styled.input``;

const BodyWeightDelete = styled.div`
  cursor: pointer;
`;
