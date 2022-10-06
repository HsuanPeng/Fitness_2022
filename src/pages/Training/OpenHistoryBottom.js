import React from 'react';
import styled from 'styled-components';

const OpenHistoryBottom = (props) => {
  return (
    <HistoryBottom>
      <ButtonOutside onClick={props.editTraining}>
        <EditTrainingItem>編輯菜單</EditTrainingItem>
      </ButtonOutside>
      {props.showHistory.complete !== '已完成' && (
        <ButtonOutside>
          <CompleteTraining onClick={props.completeTraining}>完成鍛鍊</CompleteTraining>
        </ButtonOutside>
      )}
      <ButtonOutside>
        <DeleteTrainingItem
          onClick={() => {
            props.setDeleteAlert(true);
          }}
        >
          刪除菜單
        </DeleteTrainingItem>
      </ButtonOutside>
    </HistoryBottom>
  );
};

export default OpenHistoryBottom;

const HistoryBottom = styled.div`
  display: flex;
  margin: 0 auto;
  max-width: 500px;
  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

const ButtonOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #74c6cc;
  width: 120px;
  margin: 20px auto;
  color: black;
  cursor: pointer;
  &:hover {
    background: white;
    color: black;
  }
  @media screen and (max-width: 767px) {
    margin: 10px auto;
  }
`;

const EditTrainingItem = styled.div`
  cursor: pointer;
  padding: 8px;
  font-size: 18px;
  letter-spacing: 1.2px;
  font-weight: 600;
`;

const CompleteTraining = styled.div`
  cursor: pointer;
  padding: 8px;
  font-size: 18px;
  letter-spacing: 1.2px;
  font-weight: 600;
`;

const DeleteTrainingItem = styled.div`
  cursor: pointer;
  padding: 8px;
  font-size: 18px;
  letter-spacing: 1.2px;
  font-weight: 600;
`;
