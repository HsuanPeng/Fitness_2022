import React from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faXmark } from '@fortawesome/free-solid-svg-icons';

const FavoriteNameZone = (props) => {
  return (
    <NameZone>
      <Name> 主題</Name>
      <NameContent>
        {props.favoriteTrainings.map((item, index) => (
          <NameContentListOustide
            index={index}
            onClick={() => {
              props.setPickFavorite(index);
              props.setPickActions(props.favoriteTrainings[index].actions);
              props.setPickID(props.favoriteTrainings[index].docID);
            }}
            $pickFavorite={index === props.pickFavorite}
          >
            <NameTitle>
              <FaXmark
                index={index}
                $isClick={index === props.pickName}
                onClick={() => {
                  props.setPickName(null);
                  props.setNewName('');
                }}
              >
                <FontAwesomeIcon icon={faXmark} style={{ pointerEvents: 'none' }} />
              </FaXmark>
              <FaPenToSquare
                index={index}
                $isClick={index !== props.pickName}
                onClick={() => {
                  props.changeName(index);
                }}
              >
                <FontAwesomeIcon icon={faPenToSquare} style={{ pointerEvents: 'none' }} />
              </FaPenToSquare>
              <NameOld $isClick={index !== props.pickName}> {item.title}</NameOld>
              <NameNew
                index={index}
                $isClick={index === props.pickName}
                onChange={(e) => props.setNewName(e.target.value)}
                defaultValue={item.title}
                maxLength={10}
              />
              <UpdateName
                index={index}
                $isClick={index === props.pickName}
                onClick={() => {
                  props.updateNewName(index);
                }}
              >
                送出
              </UpdateName>
            </NameTitle>
            <NameDelete
              onClick={() => {
                props.setDeleteAlert(true);
                props.setDeleteItem(index);
              }}
            >
              <FontAwesomeIcon icon={faTrash} style={{ pointerEvents: 'none' }} />
            </NameDelete>
          </NameContentListOustide>
        ))}
        <NameRemind>＊修改最多輸入10字</NameRemind>
      </NameContent>
    </NameZone>
  );
};

export default FavoriteNameZone;

const NameZone = styled.div`
  margin-right: 40px;
  width: 100%;
`;

const Name = styled.div`
  font-size: 25px;
  letter-spacing: 12px;
`;

const NameContent = styled.div`
  height: 327px;
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
  @media screen and (max-width: 767px) {
    margin-bottom: 50px;
  }
`;

const NameRemind = styled.div`
  color: #cd5c5c;
  font-size: 16px;
  letter-spacing: 2px;
  margin-top: -6px;
`;

const NameContentListOustide = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 300px;
  margin: 15px 0px;
  cursor: pointer;
  color: black;
  background: ${(props) => (props.$pickFavorite ? 'rgb(116, 198, 204)' : 'rgba(255, 255, 255, 0.5)')};
  padding: 5px 15px 5px 15px;
  &:hover {
    background: #74c6cc;
  }
  @media screen and (max-width: 767px) {
    width: 100%;
  }
`;

const NameTitle = styled.div`
  display: flex;
`;

const FaPenToSquare = styled.div`
  display: ${(props) => (props.$isClick ? 'block' : 'none')};
  margin-right: 15px;
  &:hover {
    color: white;
  }
`;

const FaXmark = styled.div`
  display: ${(props) => (props.$isClick ? 'block' : 'none')};
  margin-right: 15px;
  &:hover {
    color: white;
  }
`;

const NameOld = styled.div`
  display: ${(props) => (props.$isClick ? 'block' : 'none')};
`;

const NameNew = styled.input`
  display: ${(props) => (props.$isClick ? 'block' : 'none')};
  width: 80px;
  font-size: 20px;
`;

const UpdateName = styled.div`
  display: ${(props) => (props.$isClick ? 'block' : 'none')};
  margin-left: 15px;
  border-radius: 12px;
  background: white;
  padding: 0px 5px;
  &:hover {
    color: white;
    background: black;
  }
`;

const NameDelete = styled.div`
  cursor: pointer;
  &:hover {
    color: red;
  }
`;
