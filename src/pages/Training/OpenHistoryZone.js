import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

const OpenHistoryZone = (props) => {
  return (
    <OpenHistory $isHide={props.showHistoryToggle}>
      <Close onClick={props.closeHistory}>X</Close>
      <HistoryTop>
        <div>主題：{props.showHistory.title}</div>
        <div>訓練日期：{props.showHistory.trainingDate}</div>
        <div>總重量：{props.showHistory.totalWeight}</div>
        <div>總動作數：{props.showHistory.totalActions}</div>
        <div>狀態：{props.showHistory.complete}</div>
      </HistoryTop>
      {props.showHistoryActions.map((item) => {
        return (
          <HistoryActions>
            <div>部位：{item.bodyPart}</div>
            <div>動作：{item.actionName}</div>
            <div>重量：{item.weight}</div>
            <div>次數：{item.times}</div>
          </HistoryActions>
        );
      })}
      {props.imageList ? <HistoryImage src={props.imageList} /> : <HistoryImageAlert>趕快上傳照片吧</HistoryImageAlert>}
      <AddPhoto>
        <input
          type="file"
          onChange={(event) => {
            props.setImageUpload(event.target.files[0]);
          }}
        />
        <button
          onClick={(e) => {
            props.uploadImage(e);
          }}
        >
          上傳照片
        </button>
      </AddPhoto>
      <CompleteTraining onClick={props.completeTraining}>完成本次鍛鍊</CompleteTraining>
    </OpenHistory>
  );
};

export default OpenHistoryZone;

const Close = styled.div``;

const OpenHistory = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
  margin: 0 auto;
  background: #dcdcdc;
  margin-bottom: 20px;
  width: 800px;
  padding: 10px;
`;

const HistoryActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HistoryTop = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HistoryImage = styled.img`
  width: 200px;
  height: auto;
`;

const HistoryImageAlert = styled.div``;

const AddPhoto = styled.button``;

const CompleteTraining = styled.button``;
