import React from 'react';
import styled from 'styled-components';

import { Pie } from 'react-chartjs-2';

const OpenHistoryMiddle = (props) => {
  return (
    <HistoryMiddle>
      <PieOutside>
        {props.showHistoryActions.length > 0 ? (
          <Pie data={props.data} options={{ color: 'white', fontSize: 20 }} />
        ) : (
          <Pie data={props.dataNull} options={{ color: 'white', fontSize: 20 }} />
        )}
      </PieOutside>
      <HistoryMiddleRight>
        <AddPhotoOutside>
          <AddPhotoInput
            onChange={(event) => {
              props.setImageUpload(event.target.files[0]);
            }}
          >
            選擇檔案
            <input type="file" accept=".png,.jpg,.JPG,.jpeg" style={{ display: 'none' }} />
          </AddPhotoInput>
        </AddPhotoOutside>
        {props.imageList ? (
          <HistoryImageOutside>
            {props.uploadSkeleton && <UploadSkeleton />}
            {!props.uploadSkeleton && <HistoryImage src={props.imageList} />}
          </HistoryImageOutside>
        ) : (
          <HistoryNoOutside>
            <HistoryNo>來上傳照片吧～</HistoryNo>
          </HistoryNoOutside>
        )}
      </HistoryMiddleRight>
    </HistoryMiddle>
  );
};

export default OpenHistoryMiddle;

const HistoryMiddle = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 20px 0px;
  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

const PieOutside = styled.div`
  width: 350px;
  @media screen and (max-width: 1279px) {
    width: 300px;
  }
`;

const HistoryMiddleRight = styled.div`
  display: flex;
  flex-direction: column;
`;

const HistoryImageOutside = styled.div`
  width: 350px;
  height: 280px;
  margin-right: 10px;
  margin-left: 10px;
  margin-top: 10px;
  @media screen and (max-width: 767px) {
    width: 300px;
    margin: 0 auto;
  }
`;

const HistoryImage = styled.img`
  object-fit: cover;
  border-radius: 12px;
  width: 350px;
  height: 280px;
  border: 5px solid #74c6cc;
  @media screen and (max-width: 767px) {
    width: 300px;
    margin: 0 auto;
  }
`;

const UploadSkeleton = styled.div`
  width: 350px;
  height: 280px;
  border: 5px solid #74c6cc;
  border-radius: 12px;
  background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 80%
    ),
    #dcdcdc;
  background-repeat: repeat-y;
  background-size: 50px 500px;
  background-position: 0 0;
  animation: shine 1s infinite;
  @keyframes shine {
    to {
      background-position: 100% 0;
    }
  }
  @media screen and (max-width: 767px) {
    margin-left: 0px;
    margin-top: 12px;
  }
  @media screen and (max-width: 767px) {
    width: 300px;
    margin: 0 auto;
  }
`;

const HistoryNoOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 350px;
  height: 280px;
  margin-right: 30px;
  margin-left: 10px;
  border: 1px solid #818a8e;
  border-radius: 5%;
  @media screen and (max-width: 767px) {
    width: 300px;
    margin-right: 10px;
  }
`;

const HistoryNo = styled.div``;

const AddPhotoOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AddPhotoInput = styled.label`
  text-align: center;
  justify-content: center;
  align-items: center;
  background: black;
  width: 120px;
  margin: 20px 14px;
  color: white;
  cursor: pointer;
  padding: 8px;
  font-size: 18px;
  letter-spacing: 1.2px;
  font-weight: 600;
  border-radius: 20px;
  &:hover {
    background: white;
    color: black;
  }
`;
