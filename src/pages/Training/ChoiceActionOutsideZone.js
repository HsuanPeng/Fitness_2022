import React from 'react';
import styled from 'styled-components';

const ChoiceActionOutsideZone = (props) => {
  return (
    <ChoiceActionOutside>
      {props.choiceAction.map((item, index) => (
        <ChoiceItemOutside id={index}>
          <ChoiceItemPart>{item.bodyPart}</ChoiceItemPart>
          <ChoiceItemName>{item.actionName}</ChoiceItemName>
          <WeightOutside>
            <Weight
              onChange={(e) => {
                props.choiceAction[index].weight = e.target.value;
              }}
            />
            KG
          </WeightOutside>
          <TimesOutside>
            <Times
              onChange={(e) => {
                props.choiceAction[index].times = e.target.value;
              }}
            />
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
        <TotalWeight>總重量：{props.totalWeight}</TotalWeight>
        <TotalActionNumbers>總動作數：{props.choiceAction.length}</TotalActionNumbers>
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

const ChoiceItem = styled.div``;

const Calculation = styled.div``;

const TotalWeight = styled.div``;

const TotalActionNumbers = styled.div``;

const TrainingOutsideThreeLeft = styled.div`
  display: flex;
`;

const TotalZone = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 10px;
`;

const TotalWeightButton = styled.button``;
