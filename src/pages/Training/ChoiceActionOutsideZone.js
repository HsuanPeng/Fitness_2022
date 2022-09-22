import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

//FontAwesomeIcon
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {} from '@fortawesome/free-brands-svg-icons';

const ChoiceActionOutsideZone = (props) => {
  return (
    <ChoiceActionOutside>
      <TotalZone>
        <TotalWeightButtonOutside>
          <TotalWeightButton onClick={props.calTotalWeight}>計算總重量</TotalWeightButton>
        </TotalWeightButtonOutside>
        <TotalWeight>總重量：{props.totalWeight} KG</TotalWeight>
        <TotalActionNumbers>總動作數：{props.choiceAction.length} 個</TotalActionNumbers>
      </TotalZone>
      {props.choiceAction.length > 0 ? (
        <>
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
                <FontAwesomeIcon icon={faTrash} />
              </Delete>
            </ChoiceItemOutside>
          ))}
        </>
      ) : (
        <NoAcitons>請加入動作</NoAcitons>
      )}
    </ChoiceActionOutside>
  );
};

export default ChoiceActionOutsideZone;

const ChoiceActionOutside = styled.div`
  width: 48%;
  color: black;
  height: 400px;
  overflow-y: scroll;
  @media screen and (max-width: 1279px) {
    width: 98%;
    padding-left: 20px;
  }
`;

const TotalZone = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 10px;
  color: white;
  margin-right: 30px;
  @media screen and (max-width: 767px) {
    margin-left: 10px;
    margin-right: 20px;
    flex-direction: column;
    align-items: start;
  }
`;

const TotalWeightButtonOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #74c6cc;
  width: 120px;
  color: black;
  cursor: pointer;
  &:hover {
    background: white;
    color: black;
  }
  @media screen and (max-width: 767px) {
    margin-bottom: 10px;
  }
`;

const TotalWeightButton = styled.div`
  cursor: pointer;
  padding: 5px;
  font-size: 18px;
  letter-spacing: 1.2px;
  font-weight: 600;
`;

const TotalWeight = styled.div`
  @media screen and (max-width: 767px) {
    margin-bottom: 10px;
  }
`;

const TotalActionNumbers = styled.div``;

const NoAcitons = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: 20px;
  margin: 10px 0px;
  margin-right: 20px;
  border: 1px solid #818a8e;
  padding: 20px 10px 20px 10px;
  color: white;
`;

const ChoiceItemOutside = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: 20px;
  margin: 10px 0px;
  margin-right: 20px;
  margin-left: 10px;
  border: 1px solid #818a8e;
  padding: 5px 10px 5px 10px;
  background: rgba(255, 255, 255, 0.5);
  color: black;
  @media screen and (max-width: 575px) {
    flex-wrap: wrap;
    justify-content: start;
    text-align: start;
  }
`;

const ChoiceItemPart = styled.div`
  width: 12%;
  @media screen and (max-width: 575px) {
    width: 20%;
    margin-right: 10px;
  }
`;

const ChoiceItemName = styled.div`
  width: 40%;
  @media screen and (max-width: 575px) {
    width: 165px;
    text-align: end;
    margin-left: auto;
  }
`;

const WeightOutside = styled.div`
  width: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 20px;
  @media screen and (max-width: 575px) {
    margin-top: 10px;
    justify-content: start;
    width: 40%;
  }
`;

const Weight = styled.input`
  border-radius: 5px;
  letter-spacing: 2px;
  width: 40px;
  margin-right: 5px;
  padding: 2px 3px;
`;

const TimesOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 15%;
  margin-right: 5px;
  @media screen and (max-width: 575px) {
    margin-top: 10px;
    justify-content: start;
    width: 40%;
  }
`;

const Times = styled.input`
  border-radius: 5px;
  letter-spacing: 2px;
  width: 40px;
  margin-right: 5px;
  padding: 2px 3px;
`;

const Delete = styled.div`
  width: 8%;
  cursor: pointer;
  text-align: center;
  color: black;
  &:hover {
    color: red;
  }
  @media screen and (max-width: 575px) {
    width: 5%;
    margin-top: 10px;
  }
`;
