import React, { useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

//FontAwesomeIcon
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import {} from '@fortawesome/free-brands-svg-icons';

const PromoteActionOutsideZone = (props) => {
  return (
    <PromoteActionOutside>
      <PromoteTop>
        <PartTitle>請選擇部位</PartTitle>
        <PartSelect onChange={(e) => props.setPart(e.target.value)}>
          <option defaultValue="肩">肩</option>
          <option defaultValue="手臂">手臂</option>
          <option defaultValue="胸">胸</option>
          <option defaultValue="背">背</option>
          <option defaultValue="臀腿">臀腿</option>
          <option defaultValue="核心">核心</option>
          <option defaultValue="上半身">上半身</option>
          <option defaultValue="全身">全身</option>
        </PartSelect>
      </PromoteTop>
      {props.promoteActions.map((item, index) => (
        <PromoteListOutside key={uuidv4()}>
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
            $isActive={index == props.playing}
            id={index}
            onClick={(e) => {
              props.openVideo(e);
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

export default PromoteActionOutsideZone;

const PromoteActionOutside = styled.div`
  width: 45%;
  color: black;
  height: 400px;
  overflow-y: scroll;
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
  margin: 18px 15px;
`;

const PartTitle = styled.div`
  margin-right: 20px;
  color: white;
`;

const PartSelect = styled.select`
  width: 20%;
  height: 30px;
  background: white;
  color: gray;
  padding-left: 5px;
  font-size: 14px;
  border-radius: 6px;
  option {
    color: black;
    background: white;
    display: flex;
    white-space: pre;
    min-height: 20px;
  }
  @media screen and (max-width: 575px) {
    width: 30%;
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
  border: 1px solid #818a8e;
  padding: 5px 10px 5px 10px;
  background: #818a8e;
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
  color: ${(props) => (props.$isActive ? '#74c6cc' : 'black')};
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
