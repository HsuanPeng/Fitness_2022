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
import armMuscle from '../../images/armMuscle.png';

//FontAwesomeIcon
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faClock,
  faDumbbell,
  faWeightHanging,
  faHeartCirclePlus,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import { faGooglePlus } from '@fortawesome/free-brands-svg-icons';

//firebase
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  startAfter,
  limit,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const OpenHistoryZone = (props) => {
  //UserContext拿資料
  const {
    isLoggedIn,
    setIsLoggedIn,
    userSignOut,
    signInWithGoogle,
    uid,
    displayName,
    email,
    signIn,
    alertPop,
    setContent,
  } = useContext(UserContext);

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

  // ＝＝＝＝＝＝＝＝＝＝＝啟動firebase＝＝＝＝＝＝＝＝＝＝＝

  const firebaseConfig = {
    apiKey: 'AIzaSyDtlWrSX2x1e0oTxI1_MN52sQsVyEwaOzA',
    authDomain: 'fitness2-d4aaf.firebaseapp.com',
    projectId: 'fitness2-d4aaf',
    storageBucket: 'fitness2-d4aaf.appspot.com',
    messagingSenderId: '440863323792',
    appId: '1:440863323792:web:3f097801137f4002c7ca15',
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const storage = getStorage(app);

  // ＝＝＝＝＝＝＝＝＝＝＝啟動firebase＝＝＝＝＝＝＝＝＝＝＝

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

  // ＝＝＝＝＝＝＝＝＝＝＝把動作加入我的最愛＝＝＝＝＝＝＝＝＝＝＝

  //按下加入我的最愛後寫入
  async function addFavoriteTraining() {
    try {
      const query = await getDocs(collection(db, 'users', uid, 'favoriteTrainings'));
      query.forEach((doc) => {
        if (doc.data().title === props.showHistory.title) {
          alertPop();
          setContent('您已加入過本菜單');
        }
      });
      const docRef = doc(collection(db, 'users', uid, 'favoriteTrainings'));
      const data = {
        docID: docRef.id,
        complete: '未完成',
        picture: '',
        title: props.showHistory.title,
        description: props.showHistory.description,
        totalActions: props.showHistoryActions.length,
        totalWeight: props.showHistory.totalWeight,
        trainingDate: props.showHistory.trainingDate,
        setDate: new window.Date(),
        actions: props.showHistoryActions,
      };
      setDoc(docRef, data);
      alertPop();
      setContent('成功加入喜愛菜單');
    } catch (e) {
      console.log(e);
    }
  }

  // ＝＝＝＝＝＝＝＝＝＝＝把動作加入我的最愛＝＝＝＝＝＝＝＝＝＝＝

  return (
    <>
      <OpenHistory $isHide={props.showHistoryToggle}>
        <Close onClick={props.closeHistory}>
          <FontAwesomeIcon icon={faCircleXmark} />
        </Close>
        <HistoryTop>
          <TitleFavorite>
            <Title>主題：{props.showHistory.title}</Title>
            <AddFavoriteOutside onClick={addFavoriteTraining}>
              <AddFavorite>加入喜愛菜單</AddFavorite>
              <FaGooglePlus>
                <FontAwesomeIcon icon={faHeartCirclePlus} />
              </FaGooglePlus>
            </AddFavoriteOutside>
          </TitleFavorite>
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
            <Complete>狀態：{props.showHistory.complete}</Complete>
          </DescriptionComplete>
        </HistoryTop>
        {props.showHistoryActions.map((item) => {
          return (
            <HistoryActions>
              <BodyPart>
                <BodyPartPic src={armMuscle} />
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
        <HistoryBottom>
          <EditTrainingItemOutside onClick={props.editTraining}>
            <EditTrainingItem>編輯菜單</EditTrainingItem>
          </EditTrainingItemOutside>
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

const Close = styled.div`
  cursor: pointer;
  width: 30px;
  position: absolute;
  right: 20px;
  top: 10px;
  scale: 1;
  transition: 0.3s;
  font-size: 30px;
  color: #c14e4f;
  &:hover {
    scale: 1.2;
  }
`;

const OpenHistory = styled.div`
  position: absolute;
  top: 15%;
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
    top: 15%;
    max-width: 700px;
  }
  @media screen and (max-width: 767px) {
    top: 10%;
    max-width: 320px;
    padding-left: 15px;
    padding-right: 15px;
  }
`;

const HistoryTop = styled.div`
  @media screen and (max-width: 1279px) {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
  }
`;

const TitleFavorite = styled.div`
  display: flex;
  align-items: center;
  margin-top: 40px;

  @media screen and (max-width: 767px) {
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

const AddFavoriteOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
  width: 160px;
  color: black;
  cursor: pointer;
  margin-left: 20px;
  border-radius: 20px;
  margin-top: 10px;
  &:hover {
    color: #c14e4f;
  }
  @media screen and (max-width: 767px) {
    margin: 10px 0px;
    margin-left: 0px;
  }
`;

const AddFavorite = styled.div`
  font-size: 18px;
  letter-spacing: 1px;
  font-weight: 600;
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
  flex-wrap: wrap;
  @media screen and (max-width: 1279px) {
    width: 100%;
  }
  @media screen and (max-width: 767px) {
    flex-direction: column;
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

const HistoryBottom = styled.div`
  display: flex;
  margin: 0 auto;
  max-width: 500px;
  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
`;

const EditTrainingItemOutside = styled.div`
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
  @media screen and (max-width: 767px) {
    margin: 10px auto;
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
  @media screen and (max-width: 767px) {
    margin: 10px auto;
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
