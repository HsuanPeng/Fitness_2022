import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const ChoiceActionOutsideZone = (props) => {
  return (
    <ChoiceActionOutside>
      {props.choiceAction.map((item, index) => (
        <ChoiceItemOutside id={index} key={uuidv4()}>
          <ChoiceItemPart>{item.bodyPart}</ChoiceItemPart>
          <ChoiceItemName>{item.actionName}</ChoiceItemName>
          <WeightOutside>
            <Weight
              type="input"
              placeholder="0"
              onChange={(e) => {
                props.choiceAction[index].weight = e.target.value;
              }}
            />{' '}
            KG
          </WeightOutside>
          <TimesOutside>
            <Times
              type="input"
              placeholder="0"
              onChange={(e) => {
                props.choiceAction[index].times = e.target.value;
              }}
            />{' '}
            次
          </TimesOutside>
          <Delete
            onClick={() => {
              props.deleteItem(index);
            }}
          >
            刪除
          </Delete>
        </ChoiceItemOutside>
      ))}
      <TotalZone>
        <TotalWeightButton onClick={props.calTotalWeight}>計算總重量</TotalWeightButton>
        <TotalWeight>總重量：{props.totalWeight} KG</TotalWeight>
        <TotalActionNumbers>總動作數：{props.choiceAction.length} 個</TotalActionNumbers>
      </TotalZone>
    </ChoiceActionOutside>
  );
};

export default ChoiceActionOutsideZone;

const ChoiceActionOutside = styled.div`
  background: #dcdcdc;
  width: 50%;
  padding: 10px;
`;

const ChoiceItemOutside = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin: 10px;
  background: #8dc3c9;
`;

const ChoiceItemPart = styled.div`
  width: 10%;
`;

const ChoiceItemName = styled.div`
  width: 30%;
`;

const WeightOutside = styled.div`
  width: 20%;
`;

const Weight = styled.input`
  width: 30px;
`;

const TimesOutside = styled.div`
  width: 20%;
`;

const Times = styled.input`
  width: 30px;
`;

const Delete = styled.div`
  width: 20%;
  cursor: pointer;
`;

const TotalWeight = styled.div``;

const TotalActionNumbers = styled.div``;

const TotalZone = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 10px;
`;

const TotalWeightButton = styled.button``;
