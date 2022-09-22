import React, { useContext, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

//calendar
import { useScript } from '../../Hooks/useScript';

//components
import UserContext from '../../contexts/UserContext';

//chart.js
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

//pics
import remove from '../../images/remove.png';
import armMuscle from '../../images/armMuscle.png';

//FontAwesomeIcon
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faDumbbell, faWeightHanging } from '@fortawesome/free-solid-svg-icons';
import { faGooglePlus } from '@fortawesome/free-brands-svg-icons';

const OpenHistoryZone = (props) => {
  //UserContext拿資料
  const { isLoggedIn, setIsLoggedIn, alertPop, setContent } = useContext(UserContext);

  //點擊過完成鍛鍊後，該按鈕消失
  const [showCompleteTrainingButton, setShowCompleteTrainingButton] = useState(true);

  //從useScript拿
  const API = useScript('https://apis.google.com/js/api.js');
  const Accounts = useScript('https://accounts.google.com/gsi/client');

  //身體部位佔比
  const [shoulderPercent, setShoulderPercent] = useState(0);
  const [armPercent, setArmPercent] = useState(0);
  const [chestPercent, setChestPercent] = useState(0);
  const [backPercent, setBackPercent] = useState(0);
  const [buttLegPercent, setButtLegPercent] = useState(0);
  const [corePercent, setCorePercent] = useState(0);

  //判斷日曆狀態
  const [alreadyLoad, setAlreadyLoad] = useState(false);

  // ＝＝＝＝＝＝＝＝＝＝＝chart.js＝＝＝＝＝＝＝＝＝＝＝

  ChartJS.register(ArcElement, Tooltip, Legend);

  const data = {
    datasets: [
      {
        data: [shoulderPercent, armPercent, chestPercent, backPercent, buttLegPercent, corePercent],
        backgroundColor: ['#f1f2f6', '#8ecae6', '#219ebc', '#74c6cc', '#ffb703', '#fb8500'],
        // backgroundColor: ['#151c48', '#174580', '#3b70a2', '#00a1d7', '#70c2e8', '#5bb9d3'],
        // backgroundColor: ['#13293d', '#006494', '#247ba0', '#1b98e0', '#e8f1fe', '#993333'],
        // backgroundColor: ['#284177', '#006bbd', '#83ceec', '#c0e8ff', '#ede8e4', '#c2afa8'],
        // backgroundColor: ['#ffa200', '#ffaa00', '#ffb700', '#ffc300', '#ffd000', '#ffdd00'],
        borderColor: [
          'rgba(0, 0, 0, 1)',
          'rgba(0, 0, 0, 1)',
          'rgba(0, 0, 0, 1)',
          'rgba(0, 0, 0, 1)',
          'rgba(0, 0, 0, 1)',
          'rgba(0, 0, 0, 1)',
        ],
        borderWidth: 0,
      },
    ],
    labels: ['肩', '手臂', '胸', '背', '臀腿', '核心'],
  };

  const dataNull = {
    datasets: [
      {
        data: [1],
        backgroundColor: ['grey'],
        borderColor: ['rgba(0, 0, 0, 1)'],
        borderWidth: 0,
      },
    ],
    labels: ['無資料'],
  };

  useEffect(() => {
    const shoulderNumber = props.showHistoryActions.filter((item) => item.bodyPart == '肩').length;
    const armNumber = props.showHistoryActions.filter((item) => item.bodyPart == '手臂').length;
    const chestNumber = props.showHistoryActions.filter((item) => item.bodyPart == '胸').length;
    const backNumber = props.showHistoryActions.filter((item) => item.bodyPart == '背').length;
    const buttLegNumber = props.showHistoryActions.filter((item) => item.bodyPart == '臀腿').length;
    const coreNumber = props.showHistoryActions.filter((item) => item.bodyPart == '核心').length;
    setShoulderPercent(shoulderNumber / props.showHistoryActions.length);
    setArmPercent(armNumber / props.showHistoryActions.length);
    setChestPercent(chestNumber / props.showHistoryActions.length);
    setBackPercent(backNumber / props.showHistoryActions.length);
    setButtLegPercent(buttLegNumber / props.showHistoryActions.length);
    setCorePercent(coreNumber / props.showHistoryActions.length);
  });

  // ＝＝＝＝＝＝＝＝＝＝＝chart.js＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝＝Google日曆＝＝＝＝＝＝＝＝＝＝＝

  // 讓script onload
  useEffect(() => {
    if (API === 'ready' && alreadyLoad == false) {
      gapiLoaded();
      setAlreadyLoad(true);
    }
  }, [props.openHistory]);

  useEffect(() => {
    if (Accounts === 'ready' && alreadyLoad == false) {
      gisLoaded();
      setAlreadyLoad(true);
    }
  }, [props.openHistory]);

  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  const SCOPES = 'https://www.googleapis.com/auth/calendar';

  let tokenClient = useRef();
  let gapiInited = false;
  let gisInited = false;

  async function gapiLoaded() {
    await window.gapi.load('client', intializeGapiClient);
  }

  async function intializeGapiClient() {
    await window.gapi.client.init({
      apiKey: process.env.REACT_APP_API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
  }

  async function gisLoaded() {
    tokenClient.current = await window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.REACT_APP_CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined later
    });
    gisInited = true;
  }

  async function handleAuthClick() {
    tokenClient.current.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      await listUpcomingEvents();
    };
    if (window.gapi.client.getToken() === null) {
      tokenClient.current.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.current.requestAccessToken({ prompt: '' });
    }
  }

  async function listUpcomingEvents() {
    let response;
    try {
      const request = {
        calendarId: 'primary',
        timeMin: new window.Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      };
      response = await window.gapi.client.calendar.events.list(request);
    } catch (err) {
      console.log(err);
      return;
    }
    insertEvent();
  }

  //加入事件
  async function insertEvent() {
    var event = {
      summary: `健人行程：${props.showHistory.title}`,
      description: `${props.showHistory.description}`,
      start: {
        date: `${props.showHistory.trainingDate}`,
      },
      end: {
        date: `${props.showHistory.trainingDate}`,
      },
    };

    var request = window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    request.execute(function (event) {});
    alertPop();
    setContent('成功加入google日曆');
  }

  // ＝＝＝＝＝＝＝＝＝＝＝Google日曆＝＝＝＝＝＝＝＝＝＝＝

  return (
    <>
      <OpenHistory $isHide={props.showHistoryToggle}>
        <Close onClick={props.closeHistory} src={remove}></Close>
        <HistoryTop>
          <Title>主題：{props.showHistory.title}</Title>
          <Detail>
            <Date>
              <DateTitle>訓練日期：{props.showHistory.trainingDate}</DateTitle>
              <AddGoogleCalendarOutside>
                <AddGoogleCalendar id="authorize_button" onClick={handleAuthClick}>
                  加入google日曆
                </AddGoogleCalendar>
                <FaGooglePlus>
                  <FontAwesomeIcon icon={faGooglePlus} />
                </FaGooglePlus>
              </AddGoogleCalendarOutside>
            </Date>
            <TotalWeight>總重量：{props.showHistory.totalWeight} KG</TotalWeight>
            <TotalActions>總動作數：{props.showHistory.totalActions} 個</TotalActions>
          </Detail>
          <DescriptionComplete>
            <Description>本次訓練重點：{props.showHistory.description}</Description>
            <Complete $isComplete={props.isComplete}>狀態：{props.showHistory.complete}</Complete>
          </DescriptionComplete>
        </HistoryTop>
        {props.showHistoryActions.map((item) => {
          return (
            <HistoryActions>
              <BodyPart>
                <BodyPartPicOutside>
                  <BodyPartPic src={armMuscle} />
                </BodyPartPicOutside>
                部位：{item.bodyPart}
              </BodyPart>
              <ActionName>
                <FaDumbbellName>
                  <FontAwesomeIcon icon={faDumbbell} />
                </FaDumbbellName>
                動作：{item.actionName}
              </ActionName>
              <Weight>
                <FaDumbbellWeight>
                  <FontAwesomeIcon icon={faWeightHanging} />
                </FaDumbbellWeight>
                重量：{item.weight} KG
              </Weight>
              <Times>
                <FaDumbbellTimes>
                  <FontAwesomeIcon icon={faClock} />
                </FaDumbbellTimes>
                次數：{item.times} 次
              </Times>
            </HistoryActions>
          );
        })}
        <HistoryMiddle>
          <PieOutside>
            {props.showHistoryActions.length > 0 ? (
              <Pie data={data} options={{ color: 'white', fontSize: 20 }} />
            ) : (
              <Pie data={dataNull} options={{ color: 'white', fontSize: 20 }} />
            )}
          </PieOutside>
          <HistoryMiddleRight>
            <AddPhotoOutside>
              {props.imageUpload ? (
                <UploadButton
                  onClick={(e) => {
                    props.uploadImage(e);
                  }}
                >
                  點擊上傳
                </UploadButton>
              ) : (
                <AddPhotoInput
                  onChange={(event) => {
                    props.setImageUpload(event.target.files[0]);
                  }}
                >
                  選擇檔案
                  <input type="file" style={{ display: 'none' }} />
                </AddPhotoInput>
              )}
            </AddPhotoOutside>
            {props.imageList ? (
              <HistoryImageOutside>
                <HistoryImage src={props.imageList} />
              </HistoryImageOutside>
            ) : (
              <HistoryNoOutside>
                <HistoryNo>來上傳照片吧～</HistoryNo>
              </HistoryNoOutside>
            )}
          </HistoryMiddleRight>
        </HistoryMiddle>
        <HistoryBottom>
          {props.showHistory.complete === '已完成' ? null : (
            <CompleteTrainingOutside>
              <CompleteTraining onClick={props.completeTraining} $isHide={props.showCompleteTrainingButton}>
                完成鍛鍊
              </CompleteTraining>
            </CompleteTrainingOutside>
          )}
          <DeleteTrainingItemOutside>
            <DeleteTrainingItem onClick={props.deleteTrainingItem}>刪除菜單</DeleteTrainingItem>
          </DeleteTrainingItemOutside>
        </HistoryBottom>
      </OpenHistory>
      <SignInMenuBackground $isHide={props.showHistoryBackground} />
    </>
  );
};

export default OpenHistoryZone;

const Close = styled.img`
  cursor: pointer;
  width: 30px;
  position: absolute;
  right: 25px;
  top: 20px;
  scale: 1;
  transition: 0.3s;
  &:hover {
    scale: 1.2;
  }
`;

const OpenHistory = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 15;
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
  background: #475260;
  max-width: 1000px;
  padding-top: 10px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 15px;
  margin-bottom: 40px;
  color: white;
  border-top: 0.5rem solid #74c6cc;
  @media screen and (max-width: 1279px) {
    top: 10%;
    max-width: 700px;
  }
  @media screen and (max-width: 767px) {
    top: 6%;
    max-width: 320px;
    padding-left: 15px;
    padding-right: 15px;
  }
`;

const HistoryTop = styled.div`
  margin-top: 40px;
  @media screen and (max-width: 1279px) {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
  }
`;

const Title = styled.span`
  margin: 10px 0px;
  font-size: 25px;
  color: white;
  font-weight: 700;
  letter-spacing: 2px;
  background-image: linear-gradient(transparent 50%, rgba(25, 26, 30, 0.8) 50%);
  padding: 0px 10px;
  background-size: 100% 100%;
`;

const Date = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 10px;
  @media screen and (max-width: 767px) {
    flex-direction: column;
    align-items: start;
    margin-top: 0px;
  }
`;

const DateTitle = styled.div`
  @media screen and (max-width: 767px) {
    margin: 10px 0px;
  }
`;

const Detail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
    align-items: start;
  }
`;

const DescriptionComplete = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  @media screen and (max-width: 1279px) {
    justify-content: center;
    align-items: start;
  }
`;

const Complete = styled.div`
  margin: 10px 0px;
  animation-name: ${(props) => (props.$isComplete ? 'flipUp' : null)};
  animation-duration: 2s;
  animation-iteration-count: 1;
  @keyframes flipUp {
    0% {
      opacity: 0;
      transform: rotateX(90def);
    }
    50% {
      opacity: 1;
      transform: rotateX(720deg);
    }
    100% {
      opacity: 1;
      transform: rotateX(720deg);
    }
  }
`;

const FaGooglePlus = styled.div`
  margin-left: 3px;
`;

const AddGoogleCalendarOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  width: 180px;
  color: black;
  cursor: pointer;
  margin-left: 20px;
  border-radius: 20px;
  &:hover {
    background: black;
    color: white;
  }
  @media screen and (max-width: 767px) {
    margin-top: 10px;
    margin-left: 0px;
  }
`;

const AddGoogleCalendar = styled.div`
  font-size: 18px;
  letter-spacing: 1px;
  font-weight: 600;
`;

const TotalWeight = styled.div`
  margin: 10px 0px;
`;

const TotalActions = styled.div`
  margin: 10px 0px;
`;

const Description = styled.div`
  margin: 10px 0px;
`;

const HistoryActions = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  margin: 10px 0px;
  border: 1px solid #818a8e;
  padding: 5px 10px 5px 10px;
  background: rgba(255, 255, 255, 0.5);
  max-width: 900px;
  color: black;
  @media screen and (max-width: 1279px) {
    flex-wrap: wrap;
  }
`;

const BodyPart = styled.div`
  width: 200px;
  display: flex;
  margin-left: 10px;
  @media screen and (max-width: 1279px) {
    width: 270px;
    margin-left: 40px;
  }
  @media screen and (max-width: 767px) {
    width: 200px;
    margin: 5px 0px;
  }
`;

const BodyPartPicOutside = styled.div``;

const BodyPartPic = styled.img`
  object: fit;
  width: 25px;
  margin-right: 10px;
  @media screen and (max-width: 767px) {
    width: 25px;
    margin-right: 10px;
  }
`;

const FaDumbbellName = styled.div`
  margin-right: 10px;
  color: white;
`;

const ActionName = styled.div`
  display: flex;
  width: 300px;
  @media screen and (max-width: 1279px) {
    margin-left: 10px;
    width: 270px;
  }
  @media screen and (max-width: 767px) {
    margin: 5px 0px;
  }
`;

const FaDumbbellWeight = styled.div`
  margin-right: 14px;
  color: white;
`;

const Weight = styled.div`
  display: flex;
  width: 200px;
  @media screen and (max-width: 1279px) {
    width: 270px;
    margin-left: 40px;
  }
  @media screen and (max-width: 767px) {
    width: 200px;
    margin: 5px 0px;
  }
`;

const FaDumbbellTimes = styled.div`
  margin-right: 13px;
  color: white;
`;

const Times = styled.div`
  display: flex;
  margin: 5px 0px;
  width: 150px;
  @media screen and (max-width: 1279px) {
    margin-left: 10px;
  }
  @media screen and (max-width: 767px) {
    margin-left: 0px;
  }
`;

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
  object-fit: contain;
  width: 350px;
  height: 280px;
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

const HistoryNo = styled.div`
  ${'' /* width: 350px; */}
`;

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

const UploadButton = styled.div`
  text-align: center;
  justify-content: center;
  align-items: center;
  background: #74c6cc;
  width: 120px;
  margin: 20px 14px;
  color: black;
  cursor: pointer;
  padding: 8px;
  font-size: 18px;
  letter-spacing: 1.2px;
  font-weight: 600;
  border-radius: 20px;
  scale: 1;
  animation-name: scale;
  animation-duration: 2s;
  animation-iteration-count: infinite;
  &:hover {
    background: white;
    color: black;
  }
  @keyframes scale {
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
`;

const HistoryBottom = styled.div`
  display: flex;
  margin: 0 auto;
  max-width: 500px;
`;

const CompleteTrainingOutside = styled.div`
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
`;

const CompleteTraining = styled.div`
  cursor: pointer;
  padding: 8px;
  font-size: 18px;
  letter-spacing: 1.2px;
  font-weight: 600;
`;

const DeleteTrainingItemOutside = styled.div`
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
`;

const DeleteTrainingItem = styled.div`
  cursor: pointer;
  padding: 8px;
  font-size: 18px;
  letter-spacing: 1.2px;
  font-weight: 600;
`;

const SignInMenuBackground = styled.div`
  background: black;
  top: 0;
  opacity: 50%;
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;
