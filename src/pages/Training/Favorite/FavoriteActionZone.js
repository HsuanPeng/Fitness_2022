import React from 'react';
import styled from 'styled-components';

import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';

import armMuscle from '../../../images/armMuscle.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell } from '@fortawesome/free-solid-svg-icons';

const FavoriteActionZone = (props) => {
  return (
    <ActionZone>
      <Action>動作</Action>
      <ActionContent>
        {props.pickActions.length > 0 ? (
          <DragDropContext onDragEnd={props.onDragEnd}>
            <Droppable droppableId="list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {props.pickActions.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                      {(provided, snapshot) => (
                        <ActionContentListOustide
                          index={index}
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
                          <ActionPart>
                            <BodyPartPic src={armMuscle} />
                            {item.bodyPart}
                          </ActionPart>
                          <ActionName>
                            <FaDumbbellName>
                              <FontAwesomeIcon icon={faDumbbell} />
                            </FaDumbbellName>
                            {item.actionName}
                          </ActionName>
                        </ActionContentListOustide>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <NoAction>
            請點選查看主題
            <br />
            並上下拖曳改變順序
          </NoAction>
        )}
      </ActionContent>
    </ActionZone>
  );
};

export default FavoriteActionZone;

const ActionZone = styled.div``;

const BodyPartPic = styled.img`
  object: fit;
  width: 25px;
  margin-right: 10px;
  @media screen and (max-width: 767px) {
    width: 25px;
    margin-right: 10px;
  }
`;

const ActionContent = styled.div`
  height: 327px;
  width: 365px;
  overflow-y: scroll;
  padding-right: 15px;
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
  @media screen and (max-width: 500px) {
    width: 280px;
    padding-right: 0px;
  }
`;

const ActionContentListOustide = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  margin: 15px 0px;
  cursor: pointer;
  color: black;
  background: rgba(255, 255, 255, 0.5);
  padding: 5px 15px 5px 15px;
  @media screen and (max-width: 500px) {
    flex-direction: column;
    align-items: start;
    width: 95%;
  }
`;

const Action = styled.div`
  font-size: 25px;
  letter-spacing: 12px;
`;

const ActionPart = styled.div`
  width: 100px;
`;

const FaDumbbellName = styled.div`
  color: white;
  margin-right: 10px;
`;

const ActionName = styled.div`
  display: flex;
`;

const NoAction = styled.div`
  text-align: center;
  line-height: 35px;
  width: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 280px;
  border: 1px solid #818a8e;
  margin-top: 12px;
  @media screen and (max-width: 500px) {
    width: 240px;
  }
`;
