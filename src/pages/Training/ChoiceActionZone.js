import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';

const ChoiceActionZone = (props) => {
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(props.choiceAction);
    const [reorderData] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderData);
    props.setChoiceAction(items);
  };

  return (
    <ChoiceActionOutside>
      <TotalZone>
        <TotalWeight>總重量：{props.totalWeight} KG</TotalWeight>
        <TotalActionNumbers>動作數：{props.choiceAction.length} 個</TotalActionNumbers>
      </TotalZone>
      {props.choiceAction.length > 0 ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="list">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {props.choiceAction.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                    {(provided, snapshot) => (
                      <ChoiceItemOutside
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        style={{
                          ...provided.draggableProps.style,
                          border: snapshot.isDragging ? '2px solid #74c6cc' : 'none',
                          borderStyle: snapshot.isDragging ? 'outset' : 'none',
                          background: snapshot.isDragging ? '#74c6cc' : 'rgba(255, 255, 255, 0.5)',
                        }}
                      >
                        <ChoiceItemPart>{item.bodyPart}</ChoiceItemPart>
                        <ChoiceItemName>{item.actionName}</ChoiceItemName>
                        <WeightOutside>
                          {item.weight ? (
                            <>
                              <Weight
                                onChange={(e) => {
                                  const newObject = { ...props.choiceAction[index] };
                                  const newArray = [...props.choiceAction];
                                  newObject.weight = e.target.value;
                                  newArray[index] = newObject;
                                  props.setChoiceAction(newArray);
                                }}
                                maxLength={5}
                                defaultValue={item.weight}
                                placeholder="0"
                              />
                              KG
                            </>
                          ) : (
                            <>
                              <Weight
                                onChange={(e) => {
                                  const newObject = { ...props.choiceAction[index] };
                                  const newArray = [...props.choiceAction];
                                  newObject.weight = e.target.value;
                                  newArray[index] = newObject;
                                  props.setChoiceAction(newArray);
                                }}
                                maxLength={5}
                                placeholder="0"
                              />
                              KG
                            </>
                          )}
                        </WeightOutside>
                        <TimesOutside>
                          {item.times ? (
                            <>
                              <Times
                                onChange={(e) => {
                                  const newObject = { ...props.choiceAction[index] };
                                  const newArray = [...props.choiceAction];
                                  newObject.times = e.target.value;
                                  newArray[index] = newObject;
                                  props.setChoiceAction(newArray);
                                }}
                                maxLength={2}
                                defaultValue={item.times}
                                placeholder="0"
                              />
                              次
                            </>
                          ) : (
                            <>
                              <Times
                                onChange={(e) => {
                                  const newObject = { ...props.choiceAction[index] };
                                  const newArray = [...props.choiceAction];
                                  newObject.times = e.target.value;
                                  newArray[index] = newObject;
                                  props.setChoiceAction(newArray);
                                }}
                                maxLength={2}
                                placeholder="0"
                              />
                              次
                            </>
                          )}
                        </TimesOutside>
                        <Delete
                          onClick={() => {
                            props.deleteItem(index);
                          }}
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Delete>
                      </ChoiceItemOutside>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                <ChoiceActionRemind>＊請輸入阿拉伯數字</ChoiceActionRemind>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <>
          <NoAcitons>可拖曳調整動作順序</NoAcitons>
        </>
      )}
    </ChoiceActionOutside>
  );
};

export default ChoiceActionZone;

const ChoiceActionOutside = styled.div`
  position: relative;
  width: 50%;
  color: black;
  height: 400px;
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
  @media screen and (max-width: 1279px) {
    width: 98%;
    padding-left: 20px;
  }
`;

const TotalZone = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 17px 10px 15px 10px;
  color: white;
  margin-right: 30px;
  @media screen and (max-width: 767px) {
    margin-left: 10px;
    margin-right: 20px;
    flex-direction: column;
    align-items: start;
  }
`;

const TotalWeight = styled.div`
  color: ${(props) => (props.$isActive ? '#74c6cc' : 'white')};
  scale: 1;
  animation-name: ${(props) => props.$isActive && 'active'};
  animation-duration: 1s;
  transition: ease-in-out;
  @keyframes active {
    0% {
      scale: 1;
    }
    50% {
      scale: 1.1;
    }
    100% {
      scale: 1;
    }
  }
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

const ChoiceActionRemind = styled.div`
  color: #cd5c5c;
  font-size: 16px;
  letter-spacing: 2px;
  margin-top: -3px;
  margin-left: 9px;
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
