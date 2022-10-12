import React, { useState } from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faCirclePlus, faChevronDown } from '@fortawesome/free-solid-svg-icons';

const options = ['肩', '手臂', '胸', '背', '臀腿', '核心', '上半身', '全身'];

const PromoteActionZone = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = (value) => () => {
    props.setPart(value);
    setIsOpen(false);
  };

  console.log(props.part);

  return (
    <PromoteActionOutside>
      <PromoteTop>
        <PartTitle>請選擇部位</PartTitle>
        <DropDownContainer>
          <DropDownHeader onClick={toggling}>
            {props.part || '肩'} <FontAwesomeIcon icon={faChevronDown} style={{ pointerEvents: 'none' }} />
          </DropDownHeader>
          {isOpen && (
            <DropDownListContainer>
              <DropDownList>
                {options.map((option) => (
                  <ListItem onClick={onOptionClicked(option)}>{option}</ListItem>
                ))}
              </DropDownList>
            </DropDownListContainer>
          )}
        </DropDownContainer>
      </PromoteTop>
      {props.promoteActions.map((item, index) => (
        <PromoteListOutside>
          <AddIcon
            id={index}
            onClick={(e) => {
              props.addActionItem(e);
            }}
          >
            <FontAwesomeIcon icon={faCirclePlus} style={{ pointerEvents: 'none' }} />
          </AddIcon>
          <PromoteListPart>{item.bodyPart}</PromoteListPart>
          <PromoteLisName>{item.actionName}</PromoteLisName>
          <VideoTag
            $playing={index == props.playing}
            id={index}
            onClick={(e) => {
              props.setVideoUrl(props.promoteActions[e.target.id].videoURL);
              props.setPlaying(e.target.id);
            }}
          >
            <FontAwesomeIcon icon={faVideo} style={{ pointerEvents: 'none' }} />
          </VideoTag>
        </PromoteListOutside>
      ))}
    </PromoteActionOutside>
  );
};

export default PromoteActionZone;

const PromoteActionOutside = styled.div`
  width: 45%;
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
  padding-left: 20px;
  @media screen and (max-width: 1279px) {
    width: 98%;
    margin-top: 40px;
  }
  @media screen and (max-width: 767px) {
    width: 98%;
    margin-top: 20px;
  }
`;

const PromoteTop = styled.div`
  display: flex;
  justify-content: start;
  margin: 15px 15px;
`;

const PartTitle = styled.div`
  margin-right: 20px;
  color: white;
`;

const DropDownContainer = styled('div')`
  width: 110px;
  letter-spacing: 1px;
`;

const DropDownHeader = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  color: gray;
  background: #ffffff;
  cursor: pointer;
`;

const DropDownListContainer = styled('div')``;

const DropDownList = styled('ul')`
  width: 110px;
  padding: 0;
  margin: 0;
  background: #ffffff;
  box-sizing: border-box;
  color: gray;
  position: absolute;
  font-weight: 500;
  &:first-child {
    padding-top: 0.2em;
  }
`;

const ListItem = styled('li')`
  list-style: none;
  cursor: pointer;
  padding: 0px 10px;
  &:hover {
    background: #74c6cc;
  }
`;

const PromoteListOutside = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 20px 15px;
  font-size: 20px;
  margin: 10px 0px;
  margin-right: 20px;
  margin-left: 10px;
  padding: 5px 10px 5px 10px;
  background: rgba(255, 255, 255, 0.5);
  color: black;
  @media screen and (max-width: 575px) {
    flex-wrap: wrap;
  }
`;

const AddIcon = styled.div`
  width: 10%;
  cursor: pointer;
  &:hover {
    color: #74c6cc;
  }
  @media screen and (max-width: 575px) {
    font-size: 25px;
    width: 100%;
    text-align: center;
  }
`;

const PromoteListPart = styled.div`
  width: 15%;
  @media screen and (max-width: 575px) {
    margin-top: 10px;
    width: 25%;
  }
`;

const PromoteLisName = styled.div`
  width: 50%;
  @media screen and (max-width: 575px) {
    margin-top: 10px;
    width: 70%;
    text-align: end;
  }
`;

const VideoTag = styled.div`
  width: 10%;
  cursor: pointer;
  color: ${(props) => (props.$playing ? '#74c6cc' : 'black')};
  &:hover {
    color: #74c6cc;
  }
  @media screen and (max-width: 575px) {
    margin-top: 10px;
    font-size: 25px;
    width: 100%;
    text-align: center;
  }
`;
