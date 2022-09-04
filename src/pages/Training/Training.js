import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

//firebase
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  Timestamp,
  orderBy,
  updateDoc,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { v4 } from 'uuid';

//chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// ＝＝＝＝＝＝＝＝＝＝＝styled＝＝＝＝＝＝＝＝＝＝＝

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 1000px;
  margin-top: 30px;
  font-size: 20px;
`;

const LoginUser = styled.div``;
const Logout = styled.button``;

const HistoryOutside = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

const HistoryItemsOutside = styled.div`
  margin: 30px;
  cursor: pointer;
  background: #fdf5e6;
  padding: 10px;
  font-size: 16px;
`;

const HistoryLeft = styled.div``;
const HistoryRight = styled.div``;
const HistoryPic = styled.div``;
const HistoryTitle = styled.div``;
const HistoryDate = styled.div``;
const HistoryWeight = styled.div``;
const HistoryTimes = styled.div``;
const HistoryComplete = styled.div``;

const AddTrainingTable = styled.button``;

const TrainingOutside = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;

const TrainingInputOutside = styled.div`
  background: #fff5ee;
  width: 1000px;
  height: auto;
  margin: 0 auto;
`;

const TrainingOutsideOne = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;

const Video = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
  position: fixed;
  background: #ffe4b5;
  padding: 30px;
  border-radius: 3%;
`;

const TrainingOutsideTwo = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;

const ActionOutside = styled.div`
  display: flex;
`;

const ChoiceActionOutside = styled.div`
  background: #dcdcdc;
  width: 50%;
  padding: 10px;
`;

const ChoiceItemOutside = styled.div`
  display: flex;
  justify-content: space-evenly;
  margin: 10px;
  background: #8dc3c9;
`;

const ChoiceItemPart = styled.div`
  width: 10%;
`;

const ChoiceItemName = styled.div`
  width: 30%;
`;

const WeightOutside = styled.div`
  width: 20%;
`;

const Weight = styled.input`
  width: 30px;
`;

const TimesOutside = styled.div`
  width: 20%;
`;

const Times = styled.input`
  width: 30px;
`;

const Delete = styled.div`
  width: 20%;
  cursor: pointer;
`;

const ChoiceItem = styled.div``;

const PromoteActionOutside = styled.div`
  background: #dcdcdc;
  width: 50%;
`;

const PromoteItemOutside = styled.div`
  padding: 10px;
`;

const PartTitle = styled.div``;

const ActionTitle = styled.div``;

const PromoteListOutside = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 10px;
  background: #8dc3c9;
`;

const AddIcon = styled.div`
  width: 10%;
  cursor: pointer;
`;

const PromoteListPart = styled.div`
  width: 30%;
`;

const PromoteLisName = styled.div`
  width: 30%;
`;

const VideoTag = styled.div`
  width: 30%;
  cursor: pointer;
`;

const TrainingOutsideThree = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;

const TitleInput = styled.input``;

const DateInput = styled.input``;

const AddPhoto = styled.button``;

const CompleteTraining = styled.button``;

const PieOutside = styled.div`
  max-width: 350px;
  padding: 10px;
  margin: 0 auto;
`;

const CalculationShow = styled.div`
  margin: 0 auto;
`;

const Calculation = styled.div``;

const TotalWeight = styled.div``;

const TotalActionNumbers = styled.div``;

const TrainingOutsideThreeLeft = styled.div`
  display: flex;
`;

const TotalZone = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 10px;
`;

const TotalWeightButton = styled.button``;

const CompeleteTrainingSetting = styled.button``;

const TrainingSettingComplete = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;

const TurnLeft = styled.div``;

const TurnRight = styled.div``;

const TurnOutside = styled.div`
  display: flex;
  justify-content: space-between;
`;

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

// ＝＝＝＝＝＝＝＝＝＝＝styled＝＝＝＝＝＝＝＝＝＝＝

const Training = () => {
  //抓到每筆菜單
  const [trainingData, setTrainingData] = useState();

  //建立菜單上下頁開關
  const [openTrainingInput, setOpenTrainingInput] = useState(false);
  const [openTrainingOne, setOpenTrainingOne] = useState(false);
  const [openTrainingTwo, setOpenTrainingTwo] = useState(false);
  const [openCompleteSetting, setOpenCompleteSetting] = useState(false);

  //抓出localstorage資料
  const uid = localStorage.getItem('uid');

  //登入後菜單刷新
  const navigate = useNavigate();

  //抓到菜單input
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [part, setPart] = useState('');
  const [promoteActions, setPromoteActions] = useState([]);
  const [choiceAction, setChoiceAction] = useState([]);

  //計算總重量
  const [totalWeight, setTotalWeight] = useState(0);

  //身體部位佔比
  const [shoulderPercent, setShoulderPercent] = useState(0);
  const [armPercent, setArmPercent] = useState(0);
  const [chestPercent, setChestPercent] = useState(0);
  const [backPercent, setBackPercent] = useState(0);
  const [buttLegPercent, setButtLegPercent] = useState(0);
  const [corePercent, setCorePercent] = useState(0);

  //點擊哪個菜單就顯示哪個菜單
  const [showHistory, setShowHistory] = useState([]);
  const [showHistoryToggle, setShowHistoryToggle] = useState(false);
  const [showHistoryActions, setShowHistoryActions] = useState([]);

  //上傳照片
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState('');
  const [pickHistory, setPickHistory] = useState();
  const [showPicture, setShowPicture] = useState(true);

  //點擊顯示影片
  const [videoUrl, setVideoUrl] = useState('');
  const [videoShow, setVideoShow] = useState(false);

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
  const auth = getAuth(app);
  const storage = getStorage(app);

  // ＝＝＝＝＝＝＝＝＝＝＝啟動firebase＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝＝chart.js＝＝＝＝＝＝＝＝＝＝＝

  ChartJS.register(ArcElement, Tooltip, Legend);

  const data = {
    datasets: [
      {
        label: '# of Votes',
        data: [shoulderPercent, armPercent, chestPercent, backPercent, buttLegPercent, corePercent],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
    labels: ['肩', '手臂', '胸', '背', '臀腿', '核心'],
  };

  const dataNull = {
    datasets: [
      {
        label: '# of Votes',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
    labels: ['肩', '手臂', '胸', '背', '臀腿', '核心'],
  };

  useEffect(() => {
    const shoulderNumber = choiceAction.filter((item) => item.bodyPart == '肩').length;
    const armNumber = choiceAction.filter((item) => item.bodyPart == '手臂').length;
    const chestNumber = choiceAction.filter((item) => item.bodyPart == '胸').length;
    const backNumber = choiceAction.filter((item) => item.bodyPart == '背').length;
    const buttLegNumber = choiceAction.filter((item) => item.bodyPart == '臀腿').length;
    const coreNumber = choiceAction.filter((item) => item.bodyPart == '核心').length;
    setShoulderPercent(shoulderNumber / choiceAction.length);
    setArmPercent(armNumber / choiceAction.length);
    setChestPercent(chestNumber / choiceAction.length);
    setBackPercent(backNumber / choiceAction.length);
    setButtLegPercent(buttLegNumber / choiceAction.length);
    setCorePercent(coreNumber / choiceAction.length);
  });

  // ＝＝＝＝＝＝＝＝＝＝＝chart.js＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝登入系統＝＝＝＝＝＝＝＝＝＝＝

  const provider = new GoogleAuthProvider();

  if (localStorage.getItem('uid') == '') {
    signInWithGoogle();
  }

  function signInWithGoogle() {
    signInWithPopup(auth, provider)
      .then((result) => {
        localStorage.setItem('name', result.user.displayName);
        localStorage.setItem('email', result.user.email);
        localStorage.setItem('uid', result.user.uid);
        localStorage.setItem('accessToken', result.user.accessToken);
        navigate('/training', { replace: false });
      })
      .catch((error) => console.log(error));
  }

  function userSignOut() {
    signOut(auth)
      .then(() => {
        localStorage.setItem('name', '');
        localStorage.setItem('email', '');
        localStorage.setItem('uid', '');
        localStorage.setItem('accessToken', '');
        navigate('/training', { replace: false });
      })
      .catch((error) => {
        console.log('An error happened');
      });
  }

  // ＝＝＝＝＝＝＝＝＝＝登入系統＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝點擊建立菜單+上下頁切換＝＝＝＝＝＝＝＝＝＝＝

  function addTraining() {
    setOpenTrainingInput(true);
    if (openTrainingOne !== true && openTrainingTwo !== true && openCompleteSetting !== true) setOpenTrainingOne(true);
  }

  function getPageOne() {
    setOpenTrainingOne(true);
    setOpenTrainingTwo(false);
  }

  function getPageTwo() {
    setOpenTrainingOne(false);
    setOpenTrainingTwo(true);
  }

  function getCompleteSetting() {
    if (title !== '' && date !== '') {
      setOpenTrainingOne(false);
      setOpenTrainingTwo(false);
      setOpenTrainingInput(false);
    }
  }

  function closeAddTraining() {
    setOpenTrainingInput(false);
    setOpenTrainingOne(false);
    setOpenTrainingTwo(false);
    setOpenCompleteSetting(false);
  }

  function completeTraining() {
    setShowHistoryToggle(false);
  }

  // ＝＝＝＝＝＝＝＝＝＝點擊建立菜單+上下頁切換＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝加入動作＝＝＝＝＝＝＝＝＝＝＝

  const shoulder = [
    {
      actionName: '槓鈴肩推',
      bodyPart: '肩',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fshoulder%2F%E6%A7%93%E9%88%B4%E8%82%A9%E6%8E%A8.mp4?alt=media&token=b7a4b84a-8320-40f3-9889-9814fae3fdf1',
    },
    {
      actionName: '坐姿肩推',
      bodyPart: '肩',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fshoulder%2F%E5%9D%90%E5%A7%BF%E8%82%A9%E6%8E%A8.mp4?alt=media&token=b5b90252-7e6c-4d63-b26f-f65dee987d31',
    },
    {
      actionName: '側平舉',
      bodyPart: '肩',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fshoulder%2F%E5%81%B4%E5%B9%B3%E8%88%89.mp4?alt=media&token=f9e62e29-dca8-4f04-a988-fe016dea997f',
    },
    {
      actionName: '蝴蝶飛鳥機',
      bodyPart: '肩',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fshoulder%2F%E8%9D%B4%E8%9D%B6%E9%A3%9B%E9%B3%A5%E6%A9%9F.mp4?alt=media&token=05174b90-6af6-46be-84cf-8eeee5d25f50',
    },
  ];

  const arm = [
    {
      actionName: '碎顱者',
      bodyPart: '手臂',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Farm%2F%E7%A2%8E%E9%A1%B1%E8%80%85.mp4?alt=media&token=223a5d6c-0f29-4cc2-a4f7-c302da4a60bbs',
    },
    {
      actionName: '二頭彎舉訓練機',
      bodyPart: '手臂',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Farm%2F%E4%BA%8C%E9%A0%AD%E5%BD%8E%E8%88%89%E8%A8%93%E7%B7%B4%E6%A9%9F.mp4?alt=media&token=4ebc7c36-f727-4b7b-bb27-3533e499087c',
    },
    {
      actionName: '三頭肌伸展訓練機',
      bodyPart: '手臂',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Farm%2F%E4%B8%89%E9%A0%AD%E8%82%8C%E4%BC%B8%E5%B1%95%E8%A8%93%E7%B7%B4%E6%A9%9F.mp4?alt=media&token=aff44ade-7abd-4c85-80ae-6f99a6be6aef',
    },
  ];

  const chest = [
    {
      actionName: '槓鈴臥推',
      bodyPart: '胸',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fchest%2F%E6%A7%93%E9%88%B4%E8%87%A5%E6%8E%A8.mp4?alt=media&token=d5164b79-2be9-490b-8865-4220c87c347b',
    },
    {
      actionName: '滑輪機',
      bodyPart: '胸',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fchest%2F%E6%BB%91%E8%BC%AA%E6%A9%9F.mp4?alt=media&token=b3095e8c-f679-4735-bc99-d51ef0e0e19a',
    },
    {
      actionName: '蝴蝶夾胸機',
      bodyPart: '胸',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fchest%2F%E8%9D%B4%E8%9D%B6%E5%A4%BE%E8%83%B8%E6%A9%9F.mp4?alt=media&token=6b6e0335-fca6-4ed3-8dd2-7338fa5d0f12',
    },
    {
      actionName: '胸推',
      bodyPart: '胸',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fchest%2F%E8%83%B8%E6%8E%A8.mp4?alt=media&token=3e83396b-6247-478b-8d70-0d685127b97c',
    },
    {
      actionName: '上斜胸推',
      bodyPart: '胸',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fchest%2F%E4%B8%8A%E6%96%9C%E8%83%B8%E6%8E%A8.mp4?alt=media&token=698614fd-ba2f-4026-a87e-019a515e583f',
    },
  ];

  const back = [
    {
      actionName: '槓鈴划船',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E6%A7%93%E9%88%B4%E5%88%92%E8%88%B9.mp4?alt=media&token=eec0d322-aa7f-4639-8621-ce2163dbcc86',
    },
    {
      actionName: '槓鈴俯身划船',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E6%A7%93%E9%88%B4%E4%BF%AF%E8%BA%AB%E5%88%92%E8%88%B9.mp4?alt=media&token=789856d2-0807-4fe3-a996-cc19870c222b',
    },
    {
      actionName: '啞鈴划船',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E5%95%9E%E9%88%B4%E5%88%92%E8%88%B9.mp4?alt=media&token=6b99c720-cd76-446c-acca-d796f0b7685e',
    },
    {
      actionName: '水平引體',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E6%B0%B4%E5%B9%B3%E5%BC%95%E9%AB%94.mp4?alt=media&token=f5a596de-5537-4e7d-ac71-8970e3d97813',
    },
    {
      actionName: '低位划船機',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E4%BD%8E%E4%BD%8D%E5%88%92%E8%88%B9%E6%A9%9F.mp4?alt=media&token=e7f4ae60-756b-47e8-9b4e-8176d9e298f1',
    },
    {
      actionName: '滑輪下拉機',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E6%BB%91%E8%BC%AA%E4%B8%8B%E6%8B%89%E6%A9%9F.mp4?alt=media&token=d48fc8c4-9b78-472b-9496-ee0d9a52227c',
    },
    {
      actionName: '背部伸張訓練機',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E8%83%8C%E9%83%A8%E4%BC%B8%E5%BC%B5%E8%A8%93%E7%B7%B4%E6%A9%9F.mp4?alt=media&token=5102e5e0-95b0-448c-994c-22526871bab4',
    },
  ];

  const buttLeg = [
    {
      actionName: '臀推',
      bodyPart: '臀腿',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2FbuttLeg%2F%E8%87%80%E6%8E%A8.mp4?alt=media&token=843d6b57-9bdf-4486-8c5d-d5b261a7a464',
    },
    {
      actionName: '雙腿伸屈',
      bodyPart: '臀腿',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2FbuttLeg%2F%E9%9B%99%E8%85%BF%E4%BC%B8%E5%B1%88.mp4?alt=media&token=8b8674a4-91ed-4e1c-a08b-130dcdd7b00e',
    },
    {
      actionName: '雙腿彎舉',
      bodyPart: '臀腿',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2FbuttLeg%2F%E9%9B%99%E8%85%BF%E5%BD%8E%E8%88%89.mp4?alt=media&token=929da96d-f385-4ebe-8f91-d8086353fcc0',
    },
    {
      actionName: '深蹲',
      bodyPart: '臀腿',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2FbuttLeg%2F%E6%B7%B1%E8%B9%B2.mp4?alt=media&token=61f35d20-558f-4ee0-940c-8588e0b5fd17',
    },
    {
      actionName: '腿推機',
      bodyPart: '臀腿',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2FbuttLeg%2F%E8%85%BF%E6%8E%A8%E6%A9%9F.mp4?alt=media&token=05fe219d-1605-45b4-8035-f4a5a3bde281',
    },
    {
      actionName: '夾腿機',
      bodyPart: '臀腿',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2FbuttLeg%2F%E5%A4%BE%E8%85%BF%E6%A9%9F.mp4?alt=media&token=57991aec-b451-473b-80fd-8c2ba521878e',
    },
  ];

  const core = [
    {
      actionName: '坐姿捲腹機',
      bodyPart: '核心',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fcore%2F%E5%9D%90%E5%A7%BF%E6%8D%B2%E8%85%B9%E6%A9%9F.mp4?alt=media&token=eb10df30-cd9d-44f8-8b44-dcd502d701c4',
    },
    {
      actionName: '轉體機',
      bodyPart: '核心',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fcore%2F%E8%BD%89%E9%AB%94%E6%A9%9F.mp4?alt=media&token=048b56fb-7fef-4c77-8a55-2b72363a02bf',
    },
    {
      actionName: '腹部訓練機',
      bodyPart: '核心',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fcore%2F%E8%85%B9%E9%83%A8%E8%A8%93%E7%B7%B4%E6%A9%9F.mp4?alt=media&token=f2d8dbc9-f8c6-44e9-ae55-0c5068d94616',
    },
    {
      actionName: '背部伸展',
      bodyPart: '核心',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fcore%2F%E8%83%8C%E9%83%A8%E4%BC%B8%E5%B1%95.mp4?alt=media&token=8d437cf2-07eb-4fce-945a-e825284ccd6e',
    },
    {
      actionName: '側棒式',
      bodyPart: '核心',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fcore%2F%E5%81%B4%E6%A3%92%E5%BC%8F.mp4?alt=media&token=fa73e2f8-8f37-4c33-ba34-aef75dfe8b01',
    },
  ];

  const upperBody = [
    {
      actionName: '槓鈴肩推',
      bodyPart: '肩',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fshoulder%2F%E6%A7%93%E9%88%B4%E8%82%A9%E6%8E%A8.mp4?alt=media&token=b7a4b84a-8320-40f3-9889-9814fae3fdf1',
    },
    {
      actionName: '坐姿肩推',
      bodyPart: '肩',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fshoulder%2F%E5%9D%90%E5%A7%BF%E8%82%A9%E6%8E%A8.mp4?alt=media&token=b5b90252-7e6c-4d63-b26f-f65dee987d31',
    },
    {
      actionName: '側平舉',
      bodyPart: '肩',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fshoulder%2F%E5%81%B4%E5%B9%B3%E8%88%89.mp4?alt=media&token=f9e62e29-dca8-4f04-a988-fe016dea997f',
    },
    {
      actionName: '蝴蝶飛鳥機',
      bodyPart: '肩',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fshoulder%2F%E8%9D%B4%E8%9D%B6%E9%A3%9B%E9%B3%A5%E6%A9%9F.mp4?alt=media&token=05174b90-6af6-46be-84cf-8eeee5d25f50',
    },
    {
      actionName: '碎顱者',
      bodyPart: '手臂',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Farm%2F%E7%A2%8E%E9%A1%B1%E8%80%85.mp4?alt=media&token=223a5d6c-0f29-4cc2-a4f7-c302da4a60bbs',
    },
    {
      actionName: '二頭彎舉訓練機',
      bodyPart: '手臂',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Farm%2F%E4%BA%8C%E9%A0%AD%E5%BD%8E%E8%88%89%E8%A8%93%E7%B7%B4%E6%A9%9F.mp4?alt=media&token=4ebc7c36-f727-4b7b-bb27-3533e499087c',
    },
    {
      actionName: '三頭肌伸展訓練機',
      bodyPart: '手臂',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Farm%2F%E4%B8%89%E9%A0%AD%E8%82%8C%E4%BC%B8%E5%B1%95%E8%A8%93%E7%B7%B4%E6%A9%9F.mp4?alt=media&token=aff44ade-7abd-4c85-80ae-6f99a6be6aef',
    },
    {
      actionName: '槓鈴臥推',
      bodyPart: '胸',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fchest%2F%E6%A7%93%E9%88%B4%E8%87%A5%E6%8E%A8.mp4?alt=media&token=d5164b79-2be9-490b-8865-4220c87c347b',
    },
    {
      actionName: '滑輪機',
      bodyPart: '胸',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fchest%2F%E6%BB%91%E8%BC%AA%E6%A9%9F.mp4?alt=media&token=b3095e8c-f679-4735-bc99-d51ef0e0e19a',
    },
    {
      actionName: '蝴蝶夾胸機',
      bodyPart: '胸',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fchest%2F%E8%9D%B4%E8%9D%B6%E5%A4%BE%E8%83%B8%E6%A9%9F.mp4?alt=media&token=6b6e0335-fca6-4ed3-8dd2-7338fa5d0f12',
    },
    {
      actionName: '胸推',
      bodyPart: '胸',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fchest%2F%E8%83%B8%E6%8E%A8.mp4?alt=media&token=3e83396b-6247-478b-8d70-0d685127b97c',
    },
    {
      actionName: '上斜胸推',
      bodyPart: '胸',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fchest%2F%E4%B8%8A%E6%96%9C%E8%83%B8%E6%8E%A8.mp4?alt=media&token=698614fd-ba2f-4026-a87e-019a515e583f',
    },
    {
      actionName: '槓鈴划船',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E6%A7%93%E9%88%B4%E5%88%92%E8%88%B9.mp4?alt=media&token=eec0d322-aa7f-4639-8621-ce2163dbcc86',
    },
    {
      actionName: '槓鈴俯身划船',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E6%A7%93%E9%88%B4%E4%BF%AF%E8%BA%AB%E5%88%92%E8%88%B9.mp4?alt=media&token=789856d2-0807-4fe3-a996-cc19870c222b',
    },
    {
      actionName: '啞鈴划船',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E5%95%9E%E9%88%B4%E5%88%92%E8%88%B9.mp4?alt=media&token=6b99c720-cd76-446c-acca-d796f0b7685e',
    },
    {
      actionName: '水平引體',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E6%B0%B4%E5%B9%B3%E5%BC%95%E9%AB%94.mp4?alt=media&token=f5a596de-5537-4e7d-ac71-8970e3d97813',
    },
    {
      actionName: '低位划船機',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E4%BD%8E%E4%BD%8D%E5%88%92%E8%88%B9%E6%A9%9F.mp4?alt=media&token=e7f4ae60-756b-47e8-9b4e-8176d9e298f1',
    },
    {
      actionName: '滑輪下拉機',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E6%BB%91%E8%BC%AA%E4%B8%8B%E6%8B%89%E6%A9%9F.mp4?alt=media&token=d48fc8c4-9b78-472b-9496-ee0d9a52227c',
    },
    {
      actionName: '背部伸張訓練機',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E8%83%8C%E9%83%A8%E4%BC%B8%E5%BC%B5%E8%A8%93%E7%B7%B4%E6%A9%9F.mp4?alt=media&token=5102e5e0-95b0-448c-994c-22526871bab4',
    },
  ];

  const all = [
    {
      actionName: '槓鈴肩推',
      bodyPart: '肩',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fshoulder%2F%E6%A7%93%E9%88%B4%E8%82%A9%E6%8E%A8.mp4?alt=media&token=b7a4b84a-8320-40f3-9889-9814fae3fdf1',
    },
    {
      actionName: '坐姿肩推',
      bodyPart: '肩',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fshoulder%2F%E5%9D%90%E5%A7%BF%E8%82%A9%E6%8E%A8.mp4?alt=media&token=b5b90252-7e6c-4d63-b26f-f65dee987d31',
    },
    {
      actionName: '側平舉',
      bodyPart: '肩',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fshoulder%2F%E5%81%B4%E5%B9%B3%E8%88%89.mp4?alt=media&token=f9e62e29-dca8-4f04-a988-fe016dea997f',
    },
    {
      actionName: '蝴蝶飛鳥機',
      bodyPart: '肩',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fshoulder%2F%E8%9D%B4%E8%9D%B6%E9%A3%9B%E9%B3%A5%E6%A9%9F.mp4?alt=media&token=05174b90-6af6-46be-84cf-8eeee5d25f50',
    },
    {
      actionName: '碎顱者',
      bodyPart: '手臂',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Farm%2F%E7%A2%8E%E9%A1%B1%E8%80%85.mp4?alt=media&token=223a5d6c-0f29-4cc2-a4f7-c302da4a60bbs',
    },
    {
      actionName: '二頭彎舉訓練機',
      bodyPart: '手臂',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Farm%2F%E4%BA%8C%E9%A0%AD%E5%BD%8E%E8%88%89%E8%A8%93%E7%B7%B4%E6%A9%9F.mp4?alt=media&token=4ebc7c36-f727-4b7b-bb27-3533e499087c',
    },
    {
      actionName: '三頭肌伸展訓練機',
      bodyPart: '手臂',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Farm%2F%E4%B8%89%E9%A0%AD%E8%82%8C%E4%BC%B8%E5%B1%95%E8%A8%93%E7%B7%B4%E6%A9%9F.mp4?alt=media&token=aff44ade-7abd-4c85-80ae-6f99a6be6aef',
    },
    {
      actionName: '槓鈴臥推',
      bodyPart: '胸',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fchest%2F%E6%A7%93%E9%88%B4%E8%87%A5%E6%8E%A8.mp4?alt=media&token=d5164b79-2be9-490b-8865-4220c87c347b',
    },
    {
      actionName: '滑輪機',
      bodyPart: '胸',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fchest%2F%E6%BB%91%E8%BC%AA%E6%A9%9F.mp4?alt=media&token=b3095e8c-f679-4735-bc99-d51ef0e0e19a',
    },
    {
      actionName: '蝴蝶夾胸機',
      bodyPart: '胸',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fchest%2F%E8%9D%B4%E8%9D%B6%E5%A4%BE%E8%83%B8%E6%A9%9F.mp4?alt=media&token=6b6e0335-fca6-4ed3-8dd2-7338fa5d0f12',
    },
    {
      actionName: '胸推',
      bodyPart: '胸',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fchest%2F%E8%83%B8%E6%8E%A8.mp4?alt=media&token=3e83396b-6247-478b-8d70-0d685127b97c',
    },
    {
      actionName: '上斜胸推',
      bodyPart: '胸',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fchest%2F%E4%B8%8A%E6%96%9C%E8%83%B8%E6%8E%A8.mp4?alt=media&token=698614fd-ba2f-4026-a87e-019a515e583f',
    },
    {
      actionName: '槓鈴划船',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E6%A7%93%E9%88%B4%E5%88%92%E8%88%B9.mp4?alt=media&token=eec0d322-aa7f-4639-8621-ce2163dbcc86',
    },
    {
      actionName: '槓鈴俯身划船',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E6%A7%93%E9%88%B4%E4%BF%AF%E8%BA%AB%E5%88%92%E8%88%B9.mp4?alt=media&token=789856d2-0807-4fe3-a996-cc19870c222b',
    },
    {
      actionName: '啞鈴划船',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E5%95%9E%E9%88%B4%E5%88%92%E8%88%B9.mp4?alt=media&token=6b99c720-cd76-446c-acca-d796f0b7685e',
    },
    {
      actionName: '水平引體',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E6%B0%B4%E5%B9%B3%E5%BC%95%E9%AB%94.mp4?alt=media&token=f5a596de-5537-4e7d-ac71-8970e3d97813',
    },
    {
      actionName: '低位划船機',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E4%BD%8E%E4%BD%8D%E5%88%92%E8%88%B9%E6%A9%9F.mp4?alt=media&token=e7f4ae60-756b-47e8-9b4e-8176d9e298f1',
    },
    {
      actionName: '滑輪下拉機',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E6%BB%91%E8%BC%AA%E4%B8%8B%E6%8B%89%E6%A9%9F.mp4?alt=media&token=d48fc8c4-9b78-472b-9496-ee0d9a52227c',
    },
    {
      actionName: '背部伸張訓練機',
      bodyPart: '背',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fback%2F%E8%83%8C%E9%83%A8%E4%BC%B8%E5%BC%B5%E8%A8%93%E7%B7%B4%E6%A9%9F.mp4?alt=media&token=5102e5e0-95b0-448c-994c-22526871bab4',
    },
    {
      actionName: '臀推',
      bodyPart: '臀腿',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2FbuttLeg%2F%E8%87%80%E6%8E%A8.mp4?alt=media&token=843d6b57-9bdf-4486-8c5d-d5b261a7a464',
    },
    {
      actionName: '雙腿伸屈',
      bodyPart: '臀腿',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2FbuttLeg%2F%E9%9B%99%E8%85%BF%E4%BC%B8%E5%B1%88.mp4?alt=media&token=8b8674a4-91ed-4e1c-a08b-130dcdd7b00e',
    },
    {
      actionName: '雙腿彎舉',
      bodyPart: '臀腿',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2FbuttLeg%2F%E9%9B%99%E8%85%BF%E5%BD%8E%E8%88%89.mp4?alt=media&token=929da96d-f385-4ebe-8f91-d8086353fcc0',
    },
    {
      actionName: '深蹲',
      bodyPart: '臀腿',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2FbuttLeg%2F%E6%B7%B1%E8%B9%B2.mp4?alt=media&token=61f35d20-558f-4ee0-940c-8588e0b5fd17',
    },
    {
      actionName: '腿推機',
      bodyPart: '臀腿',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2FbuttLeg%2F%E8%85%BF%E6%8E%A8%E6%A9%9F.mp4?alt=media&token=05fe219d-1605-45b4-8035-f4a5a3bde281',
    },
    {
      actionName: '夾腿機',
      bodyPart: '臀腿',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2FbuttLeg%2F%E5%A4%BE%E8%85%BF%E6%A9%9F.mp4?alt=media&token=57991aec-b451-473b-80fd-8c2ba521878e',
    },
    {
      actionName: '坐姿捲腹機',
      bodyPart: '核心',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fcore%2F%E5%9D%90%E5%A7%BF%E6%8D%B2%E8%85%B9%E6%A9%9F.mp4?alt=media&token=eb10df30-cd9d-44f8-8b44-dcd502d701c4',
    },
    {
      actionName: '轉體機',
      bodyPart: '核心',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fcore%2F%E8%BD%89%E9%AB%94%E6%A9%9F.mp4?alt=media&token=048b56fb-7fef-4c77-8a55-2b72363a02bf',
    },
    {
      actionName: '腹部訓練機',
      bodyPart: '核心',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fcore%2F%E8%85%B9%E9%83%A8%E8%A8%93%E7%B7%B4%E6%A9%9F.mp4?alt=media&token=f2d8dbc9-f8c6-44e9-ae55-0c5068d94616',
    },
    {
      actionName: '背部伸展',
      bodyPart: '核心',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fcore%2F%E8%83%8C%E9%83%A8%E4%BC%B8%E5%B1%95.mp4?alt=media&token=8d437cf2-07eb-4fce-945a-e825284ccd6e',
    },
    {
      actionName: '側棒式',
      bodyPart: '核心',
      weight: 0,
      times: 0,
      videoURL:
        'https://firebasestorage.googleapis.com/v0/b/fitness2-d4aaf.appspot.com/o/videos%2Fcore%2F%E5%81%B4%E6%A3%92%E5%BC%8F.mp4?alt=media&token=fa73e2f8-8f37-4c33-ba34-aef75dfe8b01',
    },
  ];

  useEffect(() => {
    if (part == '背') {
      setPromoteActions(back);
    } else if (part == '手臂') {
      setPromoteActions(arm);
    } else if (part == '胸') {
      setPromoteActions(chest);
    } else if (part == '臀腿') {
      setPromoteActions(buttLeg);
    } else if (part == '核心') {
      setPromoteActions(core);
    } else if (part == '肩') {
      setPromoteActions(shoulder);
    } else if (part == '上半身') {
      setPromoteActions(upperBody);
    } else if (part == '全身') {
      setPromoteActions(all);
    }
  }, [part]);

  //從右邊加入左邊
  function addActionItem(e) {
    const newArray = [...choiceAction];
    newArray.push(promoteActions[e.target.id]);
    setChoiceAction(newArray);
  }

  //左邊的可以刪除
  function deleteItem(id) {
    const newNextChoiceAction = choiceAction.filter((item, index) => {
      return index !== id;
    });
    setChoiceAction(newNextChoiceAction);
  }

  //加總每個動作的重量
  function calTotalWeight() {
    const total = choiceAction.reduce((prev, item) => prev + item.weight * item.times, 0);
    setTotalWeight(total);
  }

  // ＝＝＝＝＝＝＝＝＝＝加入動作＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝寫入菜單＝＝＝＝＝＝＝＝＝＝＝

  async function compeleteTrainingSetting() {
    try {
      if (title !== '' && date !== '') {
        const docRef = doc(collection(db, 'users', uid, 'trainingTables'));
        const data = {
          docID: docRef.id,
          complete: '未完成',
          picture: imageList,
          title: title,
          totalActions: choiceAction.length,
          totalWeight: totalWeight,
          trainingDate: date,
          setDate: new Date(),
          actions: choiceAction,
        };
        await setDoc(docRef, data);
      } else {
        alert('請填寫完整資料');
      }
    } catch (e) {
      console.log(e);
    }
  }

  // ＝＝＝＝＝＝＝＝＝＝寫入菜單＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝即時抓出每筆菜單資料＝＝＝＝＝＝＝＝＝＝＝

  useEffect(() => {
    async function getTrainingTables() {
      const q = query(collection(db, 'users', uid, 'trainingTables'), orderBy('trainingDate'));
      onSnapshot(q, (item) => {
        const newData = [];
        item.forEach((doc) => {
          newData.push(doc.data());
          setTrainingData(newData);
        });
      });
    }
    getTrainingTables();
  }, [uid]);

  // ＝＝＝＝＝＝＝＝＝＝即時抓出每筆菜單資料＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝點擊個別菜單打開內容＝＝＝＝＝＝＝＝＝＝＝

  function openHistory(index) {
    setShowHistory(trainingData[index]);
    setShowHistoryActions(trainingData[index].actions);
    setShowHistoryToggle(true);
    setPickHistory(trainingData[index].docID);
    setImageList(trainingData.picture);
    setShowPicture((prevShowPicture) => !prevShowPicture);
  }

  // ＝＝＝＝＝＝＝＝＝＝點擊個別菜單打開內容＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝播放個別影片＝＝＝＝＝＝＝＝＝＝＝

  function openVideo(e) {
    setVideoUrl(promoteActions[e.target.id].videoURL);
    setVideoShow(true);
  }

  function closeVideo() {
    setVideoShow(false);
  }

  // ＝＝＝＝＝＝＝＝＝＝播放個別影片＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝上傳照片、顯示照片、個別對應＝＝＝＝＝＝＝＝＝＝＝

  //上傳後即時顯示
  function uploadImage(e) {
    if (imageUpload == null) return;
    const imageRef = ref(storage, `${uid}/${pickHistory}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageList(url);
      });
    });
    updatePicture();
  }

  //把圖片url寫到firestore的picture欄位
  function updatePicture() {
    const docRef = doc(db, 'users', uid, 'trainingTables', pickHistory);
    const data = {
      picture: imageList,
    };
    updateDoc(docRef, data);
  }

  //點到哪個菜單就顯示誰的照片
  useEffect(() => {
    const imageListRef = ref(storage, `${uid}/${pickHistory}`);
    getDownloadURL(imageListRef).then((url) => {
      setImageList(url);
    });
  }, [showPicture]);

  //一進入網站自動把所有照片map出來
  // useEffect(() => {
  //   const imageListRef = ref(storage, `${uid}/${pickHistory}`);
  //   listAll(imageListRef).then((res) => {
  //     res.items.forEach((item) => {
  //       getDownloadURL(item).then((url) => {
  //         setImageList(url);
  //       });
  //     });
  //   });
  // }, []);

  function closeHistory() {
    setShowHistoryToggle(false);
  }

  // ＝＝＝＝＝＝＝＝＝＝上傳照片、顯示照片、個別對應＝＝＝＝＝＝＝＝＝＝

  if (!trainingData) {
    return null;
  }

  return (
    <Wrapper>
      <LoginUser>{localStorage.getItem('name')}你好！</LoginUser>
      <Logout onClick={userSignOut}>登出</Logout>
      <AddTrainingTable onClick={addTraining}>點擊建立菜單</AddTrainingTable>
      <HistoryOutside>
        {trainingData.map((item, index) => (
          <HistoryItemsOutside
            index={index}
            onClick={() => {
              openHistory(index);
            }}
          >
            <HistoryLeft>
              <HistoryPic></HistoryPic>
            </HistoryLeft>
            <HistoryRight>
              <HistoryTitle>主題：{item.title}</HistoryTitle>
              <HistoryDate>訓練日期：{item.trainingDate}</HistoryDate>
              <HistoryWeight>總重量：{item.totalWeight}</HistoryWeight>
              <HistoryTimes>總動作數：{item.totalActions}</HistoryTimes>
              <HistoryComplete>狀態：{item.complete}</HistoryComplete>
            </HistoryRight>
          </HistoryItemsOutside>
        ))}
      </HistoryOutside>
      <OpenHistory $isHide={showHistoryToggle}>
        <Close onClick={closeHistory}>X</Close>
        <HistoryTop>
          <div>主題：{showHistory.title}</div>
          <div>訓練日期：{showHistory.trainingDate}</div>
          <div>總重量：{showHistory.totalWeight}</div>
          <div>總動作數：{showHistory.totalActions}</div>
          <div>狀態：{showHistory.complete}</div>
        </HistoryTop>
        {showHistoryActions.map((item) => {
          return (
            <HistoryActions>
              <div>部位：{item.bodyPart}</div>
              <div>動作：{item.actionName}</div>
              <div>重量：{item.weight}</div>
              <div>次數：{item.times}</div>
            </HistoryActions>
          );
        })}
        {imageList ? <HistoryImage src={imageList} /> : <HistoryImageAlert>趕快上傳照片吧</HistoryImageAlert>}
        <AddPhoto>
          <input
            type="file"
            onChange={(event) => {
              setImageUpload(event.target.files[0]);
            }}
          />
          <button
            onClick={(e) => {
              uploadImage(e);
            }}
          >
            上傳照片
          </button>
        </AddPhoto>
        <CompleteTraining onClick={completeTraining}>完成本次鍛鍊</CompleteTraining>
      </OpenHistory>
      <TrainingOutside $isHide={openTrainingInput}>
        <TrainingInputOutside>
          <TrainingOutsideOne $isHide={openTrainingOne}>
            <Close onClick={closeAddTraining}>X</Close>
            主題
            <TitleInput onChange={(e) => setTitle(e.target.value)}></TitleInput>
            日期
            <DateInput type="date" onChange={(e) => setDate(e.target.value)}></DateInput>
            <TurnOutside>
              <TurnRight onClick={getPageTwo}>下一頁</TurnRight>
            </TurnOutside>
          </TrainingOutsideOne>
          <TrainingOutsideTwo $isHide={openTrainingTwo}>
            <Close onClick={closeAddTraining}>X</Close>
            <ActionOutside>
              <ChoiceActionOutside>
                {choiceAction.map((item, index) => (
                  <ChoiceItemOutside id={index}>
                    <ChoiceItemPart>{item.bodyPart}</ChoiceItemPart>
                    <ChoiceItemName>{item.actionName}</ChoiceItemName>
                    <WeightOutside>
                      <Weight
                        onChange={(e) => {
                          choiceAction[index].weight = e.target.value;
                        }}
                      />
                      KG
                    </WeightOutside>
                    <TimesOutside>
                      <Times
                        onChange={(e) => {
                          choiceAction[index].times = e.target.value;
                        }}
                      />
                      次
                    </TimesOutside>
                    <Delete
                      onClick={() => {
                        deleteItem(index);
                      }}
                    >
                      刪除
                    </Delete>
                  </ChoiceItemOutside>
                ))}
                <TotalZone>
                  <TotalWeightButton onClick={calTotalWeight}>計算總重量</TotalWeightButton>
                  <TotalWeight>總重量：{totalWeight}</TotalWeight>
                  <TotalActionNumbers>總動作數：{choiceAction.length}</TotalActionNumbers>
                </TotalZone>
              </ChoiceActionOutside>
              <PromoteActionOutside>
                <PromoteItemOutside>
                  <PartTitle>部位</PartTitle>
                  <select onChange={(e) => setPart(e.target.value)}>
                    {/* <option value="none" selected disabled hidden>
                      請選擇選項
                    </option> */}
                    <option value="肩">肩</option>
                    <option value="手臂">手臂</option>
                    <option value="胸">胸</option>
                    <option value="背">背</option>
                    <option value="臀腿">臀腿</option>
                    <option value="核心">核心</option>
                    <option value="上半身">上半身</option>
                    <option value="全身">全身</option>
                  </select>
                  <div>
                    {promoteActions.map((item, index) => (
                      <PromoteListOutside>
                        <AddIcon
                          id={index}
                          onClick={(e) => {
                            addActionItem(e);
                          }}
                        >
                          ⊕
                        </AddIcon>
                        <PromoteListPart>{item.bodyPart}</PromoteListPart>
                        <PromoteLisName>{item.actionName}</PromoteLisName>
                        <VideoTag
                          id={index}
                          onClick={(e) => {
                            openVideo(e);
                          }}
                        >
                          影片按鈕
                        </VideoTag>
                      </PromoteListOutside>
                    ))}
                  </div>
                </PromoteItemOutside>
              </PromoteActionOutside>
            </ActionOutside>
            <CalculationShow>
              <PieOutside>{choiceAction.length > 0 ? <Pie data={data} /> : <Pie data={dataNull} />}</PieOutside>
              <CompeleteTrainingSetting
                onClick={() => {
                  getCompleteSetting();
                  compeleteTrainingSetting();
                }}
              >
                完成菜單設定
              </CompeleteTrainingSetting>
            </CalculationShow>
            <TurnOutside>
              <TurnLeft onClick={getPageOne}>上一頁</TurnLeft>
            </TurnOutside>
          </TrainingOutsideTwo>
        </TrainingInputOutside>
      </TrainingOutside>
      <Video $isHide={videoShow}>
        <Close onClick={closeVideo}>X</Close>
        <video autoPlay loop width={640} controls src={videoUrl}></video>
      </Video>
    </Wrapper>
  );
};

export default Training;
