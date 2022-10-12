import React from 'react';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

const DeleteZone = (props) => {
  return (
    <>
      <DeleteAlertOutside>
        <DeleteContent>
          <DeletePic>
            <FontAwesomeIcon icon={faTriangleExclamation} />
          </DeletePic>
          確定執行刪除？
        </DeleteContent>
        <DeleteButton>
          <YesOutside onClick={props.confirmDeleteTrainingItem}>
            <Yes>YES</Yes>
          </YesOutside>
          <NoOutside
            onClick={() => {
              props.setDeleteAlert(false);
            }}
          >
            <No>NO</No>
          </NoOutside>
        </DeleteButton>
      </DeleteAlertOutside>
      <DeleteBackground />
    </>
  );
};

export default DeleteZone;

const DeleteAlertOutside = styled.div`
  display: flex;
  padding: 15px;
  width: 400px;
  background: #475260;
  border: 5px solid #74c6cc;
  border-radius: 20px;
  position: absolute;
  top: 28%;
  left: calc(50% - 200px);
  z-index: 98;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  animation-name: deletefadein;
  animation-duration: 0.8s;
  @keyframes deletefadein {
    0% {
      transform: translateY(-10%);
      opacity: 0%;
    }
    100% {
      transform: translateY(0%);
      opacity: 100%;
    }
  }
  @media screen and (max-width: 1279px) {
    top: 16%;
  }
  @media screen and (max-width: 767px) {
    padding: 10px;
    width: 300px;
    left: calc(50% - 150px);
    top: 12%;
  }
`;

const DeletePic = styled.div`
  color: #ffd700;
  font-size: 40px;
  margin-right: 20px;
`;

const DeleteContent = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-size: 30px;
  margin-top: 10px;
  letter-spacing: 6px;
  @media screen and (max-width: 767px) {
    margin-top: 0px;
    font-size: 25px;
    letter-spacing: 4px;
  }
`;
const DeleteButton = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 10px;
`;

const YesOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #74c6cc;
  width: 50px;
  color: black;
  cursor: pointer;
  border-radius: 10px;
  margin-right: 30px;
  &:hover {
    background: #c14e4f;
    color: black;
  }
`;

const Yes = styled.div`
  padding: 3px;
  font-size: 20px;
  letter-spacing: 2px;
  font-weight: 600;
`;

const NoOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #74c6cc;
  width: 50px;
  color: black;
  cursor: pointer;
  border-radius: 10px;
  &:hover {
    background: white;
    color: black;
  }
`;

const No = styled.div`
  padding: 3px;
  font-size: 20px;
  letter-spacing: 2px;
  font-weight: 600;
`;

const DeleteBackground = styled.div`
  background: black;
  top: 0;
  opacity: 50%;
  z-index: 60;
  position: fixed;
  width: 100vw;
  height: 100vh;
`;
