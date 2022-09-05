import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

//firebase
import { initializeApp } from 'firebase/app';
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

//components
import UserContext from '../../contexts/UserContext';
import Video from './Video';
import HistoryZone from './HistoryZone';
import OpenHistoryZone from './OpenHistoryZone';
import TrainingOutsideOneZone from './TrainingOutsideOneZone';
import ChoiceActionOutsideZone from './ChoiceActionOutsideZone';
import PromoteActionOutsideZone from './PromoteActionOutsideZone';
import CalculationShowZone from './CalculationShowZone';

//引入動作菜單
import BackActions from './BackActions';
import ArmActions from './ArmActions';
import ShoulderActions from './ShoulderActions';
import ChestActions from './ChestActions';
import CoreActions from './CoreActions';
import UpperBodyActions from './UpperBodyActions';
import AllActions from './AllActions';
import ButtLegActions from './ButtLegActions';

//chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

const Training = () => {
  //UserContext拿資料
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);

  //抓到每筆菜單
  const [trainingData, setTrainingData] = useState();

  //建立菜單上下頁開關
  const [openTrainingInput, setOpenTrainingInput] = useState(false);
  const [openTrainingOne, setOpenTrainingOne] = useState(false);
  const [openTrainingTwo, setOpenTrainingTwo] = useState(false);
  const [openCompleteSetting, setOpenCompleteSetting] = useState(false);

  //抓出localstorage資料
  const uid = localStorage.getItem('uid');

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

  useEffect(() => {
    if (part == '背') {
      setPromoteActions(BackActions);
    } else if (part == '手臂') {
      setPromoteActions(ArmActions);
    } else if (part == '胸') {
      setPromoteActions(ChestActions);
    } else if (part == '臀腿') {
      setPromoteActions(ButtLegActions);
    } else if (part == '核心') {
      setPromoteActions(CoreActions);
    } else if (part == '肩') {
      setPromoteActions(ShoulderActions);
    } else if (part == '上半身') {
      setPromoteActions(UpperBodyActions);
    } else if (part == '全身') {
      setPromoteActions(AllActions);
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
  }, [isLoggedIn, uid]);

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
    if (pickHistory) {
      getDownloadURL(imageListRef).then((url) => {
        setImageList(url);
      });
    }
  }, [showPicture]);

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
      <AddTrainingTable onClick={addTraining}>點擊建立菜單</AddTrainingTable>
      <HistoryZone trainingData={trainingData} openHistory={openHistory} />
      <OpenHistoryZone
        showHistory={showHistory}
        openHistory={openHistory}
        showHistoryToggle={showHistoryToggle}
        closeHistory={closeHistory}
        showHistoryActions={showHistoryActions}
        setShowHistoryActions={setShowHistoryActions}
        imageList={imageList}
        setImageList={setImageList}
        imageUpload={imageUpload}
        setImageUpload={setImageUpload}
        completeTraining={completeTraining}
        uploadImage={uploadImage}
      />
      <TrainingOutside $isHide={openTrainingInput}>
        <TrainingInputOutside>
          <TrainingOutsideOneZone
            openTrainingOne={openTrainingOne}
            closeAddTraining={closeAddTraining}
            setTitle={setTitle}
            setDate={setDate}
            getPageTwo={getPageTwo}
          />
          <TrainingOutsideTwo $isHide={openTrainingTwo}>
            <Close onClick={closeAddTraining}>X</Close>
            <ActionOutside>
              <ChoiceActionOutsideZone
                choiceAction={choiceAction}
                deleteItem={deleteItem}
                calTotalWeight={calTotalWeight}
                totalWeight={totalWeight}
              />
              <PromoteActionOutsideZone
                setPart={setPart}
                promoteActions={promoteActions}
                addActionItem={addActionItem}
                openVideo={openVideo}
              />
            </ActionOutside>
            <CalculationShowZone
              choiceAction={choiceAction}
              data={data}
              dataNull={dataNull}
              getCompleteSetting={getCompleteSetting}
            />
            <TurnOutside>
              <TurnLeft onClick={getPageOne}>上一頁</TurnLeft>
            </TurnOutside>
          </TrainingOutsideTwo>
        </TrainingInputOutside>
      </TrainingOutside>
      <Video
        videoUrl={videoUrl}
        setVideoUrl={setVideoUrl}
        videoShow={videoShow}
        setVideoShow={setVideoShow}
        compeleteTrainingSetting={compeleteTrainingSetting}
      />
    </Wrapper>
  );
};

export default Training;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 1000px;
  margin-top: 30px;
  font-size: 20px;
`;

const LoginUser = styled.div``;

const AddTrainingTable = styled.button`
  width: 100px;
`;

const TrainingOutside = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;

const TrainingInputOutside = styled.div`
  background: #fff5ee;
  width: 1000px;
  height: auto;
  margin: 0 auto;
`;

const TrainingOutsideTwo = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;

const ActionOutside = styled.div`
  display: flex;
`;

const TurnLeft = styled.div``;

const TurnOutside = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Close = styled.div``;
