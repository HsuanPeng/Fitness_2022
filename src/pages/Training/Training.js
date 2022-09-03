import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

//components
import BeautifulDnd from './BeautifulDnD';

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
} from 'firebase/firestore';

//chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// ==================styled==================

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
  justify-content: start;
  flex-wrap: wrap;
`;

const HistoryItemsOutside = styled.div`
  margin: 30px;
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
  background: #b5b0b3;
  width: 1000px;
  height: auto;
  margin: 0 auto;
`;

const TrainingOutsideOne = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;

const TrainingOutsideTwo = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;

const ActionOutside = styled.div`
  display: flex;
`;

const ChoiceActionOutside = styled.div`
  background: #318a94;
  width: 50%;
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
  background: #8dc3c9;
  width: 50%;
`;

const PromoteItemOutside = styled.div``;

const PartTitle = styled.div``;

const ActionTitle = styled.div``;

const PromoteListOutside = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 10px;
  background: #318a94;
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
`;

const TrainingOutsideThree = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;

const TitleInput = styled.input``;

const DateInput = styled.input``;

const AddPhoto = styled.button``;

const CompleteTraining = styled.button``;

const PieOutside = styled.div`
  max-width: 300px;
`;

const Calculation = styled.div``;

const TotalWeight = styled.div``;

const TotalActionNumbers = styled.div``;

const TrainingOutsideThreeLeft = styled.div`
  display: flex;
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

// ==================styled==================

//加總map出來物件總重量==================

const Training = () => {
  //抓到每筆菜單
  const [trainingData, setTrainingData] = useState();

  //建立菜單上下頁開關
  const [openTrainingInput, setOpenTrainingInput] = useState(true);
  const [openTrainingOne, setOpenTrainingOne] = useState(true);
  const [openTrainingTwo, setOpenTrainingTwo] = useState(true);
  const [openTrainingThree, setOpenTrainingThree] = useState(true);
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

  // ==================chart.js==================

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

  function calPiePercent() {
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
  }

  // ==================chart.js==================

  const firebaseConfig = {
    apiKey: 'AIzaSyDtlWrSX2x1e0oTxI1_MN52sQsVyEwaOzA',
    authDomain: 'fitness2-d4aaf.firebaseapp.com',
    projectId: 'fitness2-d4aaf',
    storageBucket: 'fitness2-d4aaf.appspot.com',
    messagingSenderId: '440863323792',
    appId: '1:440863323792:web:3f097801137f4002c7ca15',
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

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

  // ＝＝＝＝＝＝＝＝＝＝即時抓出每筆菜單資料＝＝＝＝＝＝＝＝＝＝＝

  useEffect(() => {
    async function getTrainingTables() {
      onSnapshot(collection(db, 'users', uid, 'trainingTables'), (doc) => {
        const newData = [];
        doc.forEach((doc) => {
          newData.push(doc.data());
          setTrainingData(newData);
        });
      });
    }
    getTrainingTables();
  }, [uid]);

  // ＝＝＝＝＝＝＝＝＝＝抓出每筆菜單資料＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝點擊建立菜單+上下頁切換＝＝＝＝＝＝＝＝＝＝＝

  function addTraining() {
    setOpenTrainingInput(true);
    if (
      openTrainingTwo !== true &&
      openTrainingThree !== true &&
      openTrainingThree !== true &&
      openCompleteSetting !== true
    )
      setOpenTrainingOne(true);
  }

  function getPageOne() {
    setOpenTrainingOne(true);
    setOpenTrainingTwo(false);
    setOpenTrainingThree(false);
  }

  function getPageTwo() {
    setOpenTrainingOne(false);
    setOpenTrainingTwo(true);
    setOpenTrainingThree(false);
  }

  function getPgaeThree() {
    setOpenTrainingOne(false);
    setOpenTrainingTwo(false);
    setOpenTrainingThree(true);
  }

  function getCompleteSetting() {
    if (title !== '' && date !== '') {
      setOpenTrainingOne(false);
      setOpenTrainingTwo(false);
      setOpenTrainingThree(false);
      setOpenTrainingInput(false);
    }
  }

  function completeTraining() {
    setOpenTrainingInput(false);
    setOpenTrainingOne(false);
    setOpenTrainingTwo(false);
    setOpenTrainingThree(false);
    setOpenCompleteSetting(false);
  }

  function closeAddTraining() {
    setOpenTrainingInput(false);
    setOpenTrainingInput(false);
    setOpenTrainingOne(false);
    setOpenTrainingTwo(false);
    setOpenTrainingThree(false);
    setOpenCompleteSetting(false);
  }

  // ＝＝＝＝＝＝＝＝＝＝點擊建立菜單+上下頁切換＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝加入動作＝＝＝＝＝＝＝＝＝＝＝

  const shoulder = [
    { actionName: '槓鈴肩推', bodyPart: '肩', weight: 0, times: 0 },
    { actionName: '側平舉機', bodyPart: '肩', weight: 0, times: 0 },
    { actionName: '蝴蝶飛鳥機', bodyPart: '肩', weight: 0, times: 0 },
  ];

  const arm = [
    { actionName: '碎顱者', bodyPart: '手臂', weight: 0, times: 0 },
    { actionName: '側邊二頭彎舉機', bodyPart: '手臂', weight: 0, times: 0 },
    { actionName: '斜板二頭彎舉機', bodyPart: '手臂', weight: 0, times: 0 },
  ];

  const chest = [
    { actionName: '槓鈴臥推', bodyPart: '胸', weight: 0, times: 0 },
    { actionName: 'Cable滑輪機', bodyPart: '胸', weight: 0, times: 0 },
    { actionName: '蝴蝶夾胸機', bodyPart: '胸', weight: 0, times: 0 },
  ];

  const back = [
    { actionName: '槓鈴划船', bodyPart: '背', weight: 0, times: 0 },
    { actionName: '槓鈴俯身划船', bodyPart: '背', weight: 0, times: 0 },
    { actionName: '滑輪下拉機', bodyPart: '背', weight: 0, times: 0 },
  ];

  const buttLeg = [
    { actionName: '臀推', bodyPart: '臀腿', weight: 0, times: 0 },
    { actionName: '坐姿腿後勾機', bodyPart: '臀腿', weight: 0, times: 0 },
    { actionName: '前負式深蹲', bodyPart: '臀腿', weight: 0, times: 0 },
  ];

  const core = [
    { actionName: '坐姿捲腹機', bodyPart: '核心', weight: 0, times: 0 },
    { actionName: '轉體機', bodyPart: '核心', weight: 0, times: 0 },
    { actionName: '雙槓抬腿機', bodyPart: '核心', weight: 0, times: 0 },
  ];

  const upperBody = [
    { actionName: '槓鈴肩推', bodyPart: '肩', weight: 0, times: 0 },
    { actionName: '側平舉機', bodyPart: '肩', weight: 0, times: 0 },
    { actionName: '蝴蝶飛鳥機', bodyPart: '肩', weight: 0, times: 0 },
    { actionName: '碎顱者', bodyPart: '手臂', weight: 0, times: 0 },
    { actionName: '側邊二頭彎舉機', bodyPart: '手臂', weight: 0, times: 0 },
    { actionName: '斜板二頭彎舉機', bodyPart: '手臂', weight: 0, times: 0 },
    { actionName: '槓鈴臥推', bodyPart: '胸', weight: 0, times: 0 },
    { actionName: 'Cable滑輪機', bodyPart: '胸', weight: 0, times: 0 },
    { actionName: '蝴蝶夾胸機', bodyPart: '胸', weight: 0, times: 0 },
    { actionName: '槓鈴划船', bodyPart: '背', weight: 0, times: 0 },
    { actionName: '槓鈴俯身划船', bodyPart: '背', weight: 0, times: 0 },
    { actionName: '滑輪下拉機', bodyPart: '背', weight: 0, times: 0 },
  ];

  const all = [
    { actionName: '槓鈴肩推', bodyPart: '肩', weight: 0, times: 0 },
    { actionName: '側平舉機', bodyPart: '肩', weight: 0, times: 0 },
    { actionName: '蝴蝶飛鳥機', bodyPart: '肩', weight: 0, times: 0 },
    { actionName: '碎顱者', bodyPart: '手臂', weight: 0, times: 0 },
    { actionName: '側邊二頭彎舉機', bodyPart: '手臂', weight: 0, times: 0 },
    { actionName: '斜板二頭彎舉機', bodyPart: '手臂', weight: 0, times: 0 },
    { actionName: '槓鈴臥推', bodyPart: '胸', weight: 0, times: 0 },
    { actionName: 'Cable滑輪機', bodyPart: '胸', weight: 0, times: 0 },
    { actionName: '蝴蝶夾胸機', bodyPart: '胸', weight: 0, times: 0 },
    { actionName: '槓鈴划船', bodyPart: '背', weight: 0, times: 0 },
    { actionName: '槓鈴俯身划船', bodyPart: '背', weight: 0, times: 0 },
    { actionName: '滑輪下拉機', bodyPart: '背', weight: 0, times: 0 },
    { actionName: '坐姿捲腹機', bodyPart: '核心', weight: 0, times: 0 },
    { actionName: '轉體機', bodyPart: '核心', weight: 0, times: 0 },
    { actionName: '雙槓抬腿機', bodyPart: '核心', weight: 0, times: 0 },
    { actionName: '臀推', bodyPart: '臀腿', weight: 0, times: 0 },
    { actionName: '坐姿腿後勾機', bodyPart: '臀腿', weight: 0, times: 0 },
    { actionName: '前負式深蹲', bodyPart: '臀腿', weight: 0, times: 0 },
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

  async function setTrainingDate() {
    if (title !== '' && date !== '') {
      const docRef = await addDoc(collection(db, 'users', uid, 'trainingTables'), {
        complete: '未完成',
        picture: '',
        title: title,
        totalActions: choiceAction.length,
        totalWeight: totalWeight,
        trainingDate: date,
        setDate: new Date(),
        actions: choiceAction,
      });
    } else {
      alert('請填寫完資料');
    }
  }

  // ＝＝＝＝＝＝＝＝＝＝寫入菜單＝＝＝＝＝＝＝＝＝＝＝

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
          <HistoryItemsOutside id={index}>
            <HistoryLeft>
              <HistoryPic></HistoryPic>
            </HistoryLeft>
            <HistoryRight>
              <HistoryTitle>主題：{item.title}</HistoryTitle>
              <HistoryDate>日期：{item.trainingDate}</HistoryDate>
              <HistoryWeight>總重量：{item.totalWeight}</HistoryWeight>
              <HistoryTimes>總動作數：{item.totalActions}</HistoryTimes>
              <HistoryComplete>狀態：{item.complete}</HistoryComplete>
            </HistoryRight>
          </HistoryItemsOutside>
        ))}
      </HistoryOutside>
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
                <TotalWeightButton onClick={calTotalWeight}>計算總重量</TotalWeightButton>
                <TotalWeight>總重量：{totalWeight}</TotalWeight>
                <TotalActionNumbers>總動作數：{choiceAction.length}</TotalActionNumbers>
              </ChoiceActionOutside>

              <PromoteActionOutside>
                <PromoteItemOutside>
                  <PartTitle>部位</PartTitle>
                  <select onChange={(e) => setPart(e.target.value)}>
                    <option value="none" selected disabled hidden>
                      請選擇選項
                    </option>
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
                        <VideoTag>影片按鈕</VideoTag>
                      </PromoteListOutside>
                    ))}
                  </div>
                </PromoteItemOutside>
              </PromoteActionOutside>
            </ActionOutside>

            <TurnOutside>
              <TurnLeft onClick={getPageOne}>上一頁</TurnLeft>
              <TurnRight
                onClick={() => {
                  getPgaeThree();
                  calPiePercent();
                }}
              >
                下一頁
              </TurnRight>
            </TurnOutside>
          </TrainingOutsideTwo>
          <TrainingOutsideThree $isHide={openTrainingThree}>
            <Close onClick={closeAddTraining}>X</Close>
            <TrainingOutsideThreeLeft>
              <PieOutside>
                <Pie data={data} />
              </PieOutside>
              <Calculation>
                <TotalWeight>總重量：{totalWeight}</TotalWeight>
                <TotalActionNumbers>總動作數：{choiceAction.length}</TotalActionNumbers>
              </Calculation>
            </TrainingOutsideThreeLeft>
            <TurnOutside>
              <TurnLeft onClick={getPageTwo}>上一頁</TurnLeft>
            </TurnOutside>
            <CompeleteTrainingSetting
              onClick={() => {
                getCompleteSetting();
                setTrainingDate();
              }}
            >
              完成菜單設定
            </CompeleteTrainingSetting>
          </TrainingOutsideThree>
          <TrainingSettingComplete $isHide={openCompleteSetting}>
            <Close onClick={closeAddTraining}>X</Close>
            <PieOutside>
              <Pie data={data} />
            </PieOutside>
            <AddPhoto>點擊上傳照片</AddPhoto>
            <CompleteTraining onClick={completeTraining}>完成本次鍛鍊</CompleteTraining>
          </TrainingSettingComplete>
        </TrainingInputOutside>
      </TrainingOutside>
      <BeautifulDnd />
    </Wrapper>
  );
};

export default Training;
