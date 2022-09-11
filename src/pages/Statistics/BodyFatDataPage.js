import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const BodyFatDataPage = (props) => {
  return (
    <BodyFatWriteDataZone>
      <BodyFatWriteDataTitle>登錄數據</BodyFatWriteDataTitle>
      日期
      <BodyFatDateInput
        type="date"
        onChange={(e) => props.setFatDateInput(e.target.value)}
        min={new Date().toISOString().split('T')[0]}
      ></BodyFatDateInput>
      體脂肪率
      <BodyFatInput onChange={(e) => props.setFatNumberInput(e.target.value)}></BodyFatInput>%
      <BodyFatInputButton onClick={props.writeBodyFat}>登錄</BodyFatInputButton>
      {props.fatRecord.map((item, index) => (
        <BodyFatHistoryOutside id={index} key={uuidv4()}>
          <BodyFatMeasureDate>日期：{item.measureDate}</BodyFatMeasureDate>
          <BodyFatChange>
            距離上次變化：{index > 0 ? props.fatNumberLine[index] - props.fatNumberLine[index - 1] : <span>--</span>}%
          </BodyFatChange>
          <BodyFatResult>體脂肪率：{item.bodyFat}%</BodyFatResult>
          <BodyFatDelete
            onClick={() => {
              props.deleteFatRecord(index);
            }}
          >
            刪除
          </BodyFatDelete>
        </BodyFatHistoryOutside>
      ))}
    </BodyFatWriteDataZone>
  );
};

export default BodyFatDataPage;

const BodyFatWriteDataZone = styled.div``;

const BodyFatWriteDataTitle = styled.div``;

const BodyFatHistoryOutside = styled.div`
  display: flex;
  justify-content: space-between;
`;

const BodyFatMeasureDate = styled.div``;

const BodyFatChange = styled.div``;

const BodyFatResult = styled.div``;

const BodyFatInput = styled.input``;

const BodyFatInputButton = styled.button``;

const BodyFatDateInput = styled.input``;

const BodyFatDelete = styled.div`
  cursor: pointer;
`;
