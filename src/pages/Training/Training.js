import React, { useContext, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

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
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';

//components
import UserContext from '../../contexts/UserContext';
import Video from './Video';
import HistoryZone from './HistoryZone';
import OpenHistoryZone from './OpenHistoryZone';
import ChoiceActionOutsideZone from './ChoiceActionOutsideZone';
import PromoteActionOutsideZone from './PromoteActionOutsideZone';
import CalculationShowZone from './CalculationShowZone';

//引入動作菜單
import ACTIONS from './allActionsLists';

//寄信
import emailjs from 'emailjs-com';

//chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

//Dnd.js
// import Dnd from './Dnd';
// import Dnd2 from './Dnd2';
// import BeautifulDnD from './BeautifulDnD';

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
  const email = localStorage.getItem('email');
  const name = localStorage.getItem('name');

  //抓到菜單input
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
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

  //點擊完成菜單設定，頁面開關
  function getCompleteSetting() {
    if (title !== '' && date !== '' && description !== '' && totalWeight !== 0) {
      setOpenTrainingOne(false);
      setOpenTrainingTwo(false);
      setOpenTrainingInput(false);
      alert('完成菜單設定');
    }
  }

  //點擊左上角XX
  function closeAddTraining() {
    setOpenTrainingInput(false);
    setOpenTrainingOne(false);
    setOpenTrainingTwo(false);
    setOpenCompleteSetting(false);
  }

  //點擊「完成本次鍛鍊」
  function completeTraining() {
    setShowHistoryToggle(false);
    alert('恭喜完成本次鍛鍊');
    changeCompleteCondition();
  }

  //改變狀態
  async function changeCompleteCondition() {
    try {
      const docRef = doc(db, 'users', uid, 'trainingTables', pickHistory);
      const data = {
        complete: '已完成',
      };
      await updateDoc(docRef, data);
    } catch (e) {
      console.log(e);
    }
  }

  //可以刪除菜單
  async function deleteTrainingItem() {
    try {
      const docRef = await doc(db, 'users', uid, 'trainingTables', pickHistory);
      await deleteDoc(docRef);
      setShowHistoryToggle(false);
    } catch (e) {
      console.log(e);
    }
  }

  // ＝＝＝＝＝＝＝＝＝＝點擊建立菜單+上下頁切換＝＝＝＝＝＝＝＝＝＝＝

  useEffect(() => {
    if (part == '背') {
      setPromoteActions(ACTIONS.BACK);
    } else if (part == '手臂') {
      setPromoteActions(ACTIONS.ARM);
    } else if (part == '胸') {
      setPromoteActions(ACTIONS.CHEST);
    } else if (part == '臀腿') {
      setPromoteActions(ACTIONS.BUTTLEG);
    } else if (part == '核心') {
      setPromoteActions(ACTIONS.CORE);
    } else if (part == '肩') {
      setPromoteActions(ACTIONS.SHOULDER);
    } else if (part == '上半身') {
      setPromoteActions(ACTIONS.UPPERBODY);
    } else if (part == '全身') {
      setPromoteActions(ACTIONS.ALL);
    }
  }, [part]);

  //從右邊加入左邊
  function addActionItem(e) {
    const newArray = [...choiceAction];
    if (!newArray.includes(promoteActions[e.target.id])) {
      newArray.push(promoteActions[e.target.id]);
      setChoiceAction(newArray);
    } else {
      alert('已經加入過該動作了！');
    }
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

  //點擊完成菜單設定，寫入菜單
  async function compeleteTrainingSetting() {
    try {
      if (title !== '' && date !== '' && description !== '' && totalWeight !== 0) {
        const docRef = doc(collection(db, 'users', uid, 'trainingTables'));
        const data = {
          docID: docRef.id,
          complete: '未完成',
          picture: '',
          title: title,
          description: description,
          totalActions: choiceAction.length,
          totalWeight: totalWeight,
          trainingDate: date,
          setDate: new Date(),
          actions: choiceAction,
        };
        await setDoc(docRef, data);
        setChoiceAction([]);
        setTotalWeight(0);
        sendEmail();
      } else {
        alert('請填寫完整資料，並計算總重量');
      }
    } catch (e) {
      console.log(e);
    }
  }

  // ＝＝＝＝＝＝＝＝＝＝寫入菜單＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝即時抓出每筆菜單資料＝＝＝＝＝＝＝＝＝＝＝

  useEffect(() => {
    async function getTrainingTables() {
      const docRef = query(collection(db, 'users', uid, 'trainingTables'), orderBy('trainingDate'));
      onSnapshot(docRef, (item) => {
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
  async function uploadImage(e) {
    if (imageUpload == null) return;
    const imageRef = await ref(storage, `${uid}/${pickHistory}`);
    await uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageList(url);
        const docRef = doc(db, 'users', uid, 'trainingTables', pickHistory);
        const data = {
          picture: url,
        };
        updateDoc(docRef, data);
      });
    });
  }

  //點到哪個菜單就顯示誰的照片
  useEffect(() => {
    const imageListRef = ref(storage, `${uid}/${pickHistory}`);
    if (imageListRef) {
      getDownloadURL(imageListRef).then((url) => {
        setImageList(url);
      });
    }
  }, [showPicture]);

  function closeHistory() {
    setShowHistoryToggle(false);
  }

  // ＝＝＝＝＝＝＝＝＝＝上傳照片、顯示照片、個別對應＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝寄信＝＝＝＝＝＝＝＝＝＝

  const form = useRef();

  const sendEmail = (e) => {
    emailjs.sendForm('service_aqtfkmw', 'template_jq89u95', form.current, 'c1RPxdcmtzncbu3Wv').then(
      (result) => {
        console.log(result.text);
      },
      (error) => {
        console.log(error.text);
      }
    );
  };

  // ＝＝＝＝＝＝＝＝＝＝寄信＝＝＝＝＝＝＝＝＝＝

  return (
    <Wrapper>
      <AddTrainingTable onClick={addTraining}>點擊建立菜單</AddTrainingTable>
      {trainingData ? <HistoryZone trainingData={trainingData} openHistory={openHistory} /> : null}
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
        setOpenCompleteSetting={setOpenCompleteSetting}
        uploadImage={uploadImage}
        deleteTrainingItem={deleteTrainingItem}
        choiceAction={choiceAction}
        data={data}
      />
      <TrainingOutside $isHide={openTrainingInput}>
        <TrainingInputOutside>
          <TrainingOutsideOne $isHide={openTrainingOne}>
            <Close onClick={closeAddTraining}>X</Close>
            <form ref={form}>
              主題
              <TitleInput onChange={(e) => setTitle(e.target.value)} name="to_title"></TitleInput>
              日期
              <DateInput
                type="date"
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                name="to_date"
              ></DateInput>
              本次訓練重點
              <Description name="to_description" onChange={(e) => setDescription(e.target.value)}></Description>
              <ToName name="to_name" defaultValue={name}></ToName>
              <ToEmail name="to_email" defaultValue={email}></ToEmail>
            </form>
            <TurnOutside>
              <TurnRight onClick={getPageTwo}>下一頁</TurnRight>
            </TurnOutside>
          </TrainingOutsideOne>
          <TrainingOutsideTwo $isHide={openTrainingTwo}>
            <Close onClick={closeAddTraining}>X</Close>
            <ActionOutside>
              <ChoiceActionOutsideZone
                choiceAction={choiceAction}
                setChoiceAction={setChoiceAction}
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
              compeleteTrainingSetting={compeleteTrainingSetting}
              sendEmail={sendEmail}
            />
            <TurnOutside>
              <TurnLeft onClick={getPageOne}>上一頁</TurnLeft>
            </TurnOutside>
          </TrainingOutsideTwo>
        </TrainingInputOutside>
      </TrainingOutside>
      {/* <Dnd />
      <Dnd2 />
      <BeautifulDnD /> */}
      <Video videoUrl={videoUrl} setVideoUrl={setVideoUrl} videoShow={videoShow} setVideoShow={setVideoShow} />
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

const AddTrainingTable = styled.button`
  width: 100px;
`;

const TrainingOutside = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;

const TrainingOutsideOne = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;

const TitleInput = styled.input``;

const DateInput = styled.input``;

const Description = styled.input``;

const TurnRight = styled.div``;

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

const ToEmail = styled.input`
  display: none;
`;

const ToName = styled.input`
  display: none;
`;
