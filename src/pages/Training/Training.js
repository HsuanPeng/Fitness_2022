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
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

//components
import UserContext from '../../contexts/UserContext';
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

//pic
import trainingBanner from '../../images/Beautiful-woman-holding-heavy-604970.jpg';
import remove from '../../images/remove.png';
import pageOnePic from '../../images/Empty-gym-in-sunlight-397510.jpg';

//FontAwesomeIcon
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleArrowRight, faCircleArrowLeft } from '@fortawesome/free-solid-svg-icons';
import {} from '@fortawesome/free-brands-svg-icons';

//loading animation
import { Blocks } from 'react-loader-spinner';

//Dnd.js
// import Dnd from './Dnd';
// import Dnd2 from './Dnd2';
// import BeautifulDnD from './BeautifulDnD';

const Training = () => {
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

  //抓到每筆菜單
  const [trainingData, setTrainingData] = useState();

  //建立菜單上下頁開關
  const [openTrainingInput, setOpenTrainingInput] = useState(false);
  const [openTrainingOne, setOpenTrainingOne] = useState(false);
  const [openTrainingTwo, setOpenTrainingTwo] = useState(false);
  const [openCompleteSetting, setOpenCompleteSetting] = useState(false);
  const [pageTwo, setPageTwo] = useState(false);

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
  const [showHistoryBackground, setShowHistoryBackground] = useState(false);

  //上傳照片
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState('');
  const [pickHistory, setPickHistory] = useState();
  const [showPicture, setShowPicture] = useState(true);

  //點擊顯示影片
  const [videoUrl, setVideoUrl] = useState('');
  const [videoShow, setVideoShow] = useState(false);

  //loading動畫
  const [loading, setLoading] = useState(false);

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
        backgroundColor: ['#a8e8f9', '#00537a', '#013c58', '#f5a201', '#ffba42', '#ffd35b'],
        borderColor: [
          'rgba(0, 0, 0, 1)',
          'rgba(0, 0, 0, 1)',
          'rgba(0, 0, 0, 1)',
          'rgba(0, 0, 0, 1)',
          'rgba(0, 0, 0, 1)',
          'rgba(0, 0, 0, 1)',
        ],
        borderWidth: 1,
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
        borderWidth: 1,
      },
    ],
    labels: ['無資料'],
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
    if (isLoggedIn) {
      setShowHistoryBackground(true);
      setOpenTrainingInput(true);
      setPageTwo(false);
      if (openTrainingOne !== true && openTrainingTwo !== true && openCompleteSetting !== true)
        setOpenTrainingOne(true);
    } else {
      signIn();
    }
  }

  function getPageOne() {
    setOpenTrainingOne(true);
    setOpenTrainingTwo(false);
    setPageTwo(false);
  }

  function getPageTwo() {
    setOpenTrainingOne(false);
    setOpenTrainingTwo(true);
    setPageTwo(true);
    setPart('肩');
  }

  //點擊左上角XX
  function closeAddTraining() {
    setOpenTrainingInput(false);
    setOpenTrainingOne(false);
    setOpenTrainingTwo(false);
    setOpenCompleteSetting(false);
    setShowHistoryBackground(false);
  }

  //點擊「完成本次鍛鍊」
  function completeTraining() {
    alertPop();
    setContent('恭喜完成本次鍛鍊');
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
    setLoading(true);
    try {
      const docRef = await doc(db, 'users', uid, 'trainingTables', pickHistory);
      await deleteDoc(docRef);
      setShowHistoryToggle(false);
      setShowHistoryBackground(false);
      setLoading(false);
      alertPop();
      setContent('成功刪除菜單');
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
        setOpenTrainingOne(false);
        setOpenTrainingTwo(false);
        setOpenTrainingInput(false);
        setChoiceAction([]);
        setTotalWeight(0);
        sendEmail();
        setShowHistoryBackground(false);
        alertPop();
        setContent('完成菜單設定');
      } else if (title == '' || date == '' || description == '') {
        alertPop();
        setContent('請填寫完整資料');
      } else if (totalWeight == 0) {
        alertPop();
        setContent('請計算總重量');
      }
    } catch (e) {
      console.log(e);
    }
  }

  // ＝＝＝＝＝＝＝＝＝＝寫入菜單＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝即時抓出每筆菜單資料＝＝＝＝＝＝＝＝＝＝＝

  useEffect(() => {
    if (isLoggedIn == false) {
      setTrainingData(null);
    } else {
      async function getTrainingTables() {
        const docRef = query(collection(db, 'users', uid, 'trainingTables'), orderBy('trainingDate'));
        setLoading(true);
        onSnapshot(docRef, (item) => {
          const newData = [];
          item.forEach((doc) => {
            newData.push(doc.data());
            setTrainingData(newData);
          });
        });
        setTimeout(() => {
          setLoading(false);
        }, 1500);
      }
      getTrainingTables();
    }
  }, [isLoggedIn]);

  // ＝＝＝＝＝＝＝＝＝＝即時抓出每筆菜單資料＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝點擊個別菜單打開內容＝＝＝＝＝＝＝＝＝＝＝

  function openHistory(index) {
    setLoading(true);
    setShowHistory(trainingData[index]);
    setShowHistoryActions(trainingData[index].actions);
    setShowHistoryToggle(true);
    setPickHistory(trainingData[index].docID);
    setImageList(trainingData.picture);
    setShowPicture((prevShowPicture) => !prevShowPicture);
    setShowHistoryBackground(true);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
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
    console.log('uploadImage1');
    if (imageUpload == null) return;
    const imageRef = await ref(storage, `${uid}/${pickHistory}`);
    await uploadBytes(imageRef, imageUpload).then((snapshot) => {
      console.log('uploadImage2');
      getDownloadURL(snapshot.ref).then((url) => {
        setImageList(url);
        const docRef = doc(db, 'users', uid, 'trainingTables', pickHistory);
        const data = {
          picture: url,
        };
        updateDoc(docRef, data);
        alertPop();
        setContent('照片上傳成功');
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
    setShowHistoryBackground(false);
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

  // ＝＝＝＝＝＝＝＝＝＝關閉影片＝＝＝＝＝＝＝＝＝＝＝

  function closeVideo() {
    setVideoShow(false);
  }

  // ＝＝＝＝＝＝＝＝＝＝關閉影片＝＝＝＝＝＝＝＝＝＝＝

  return (
    <>
      <LoadingOutside $isActive={loading}>
        <LoadingBlocks>
          <Blocks
            visible={true}
            height="260"
            width="260"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
          />
        </LoadingBlocks>
      </LoadingOutside>
      <Wrapper>
        <BannerOutside>
          <Banner>
            <BannerText>開始我的記錄！</BannerText>
          </Banner>
        </BannerOutside>
        <AddTrainingTableOutside>
          <AddTrainingTable onClick={addTraining}>建立菜單</AddTrainingTable>
        </AddTrainingTableOutside>
        {trainingData ? (
          <HistoryZone trainingData={trainingData} openHistory={openHistory} />
        ) : (
          <NoHistory>尚未建立菜單</NoHistory>
        )}
        <OpenHistoryZone
          showHistory={showHistory}
          openHistory={openHistory}
          showHistoryBackground={showHistoryBackground}
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
        <TrainingOutside $isHide={openTrainingInput} $isActive={pageTwo}>
          <TrainingOutsideOne $isHide={openTrainingOne}>
            <PageOneDetail>
              <Close onClick={closeAddTraining} src={remove} />
              <form ref={form}>
                <PageOneDetailContent>
                  <TitleInputText>
                    主題
                    <TitleInputLine />
                    <TitleInput onChange={(e) => setTitle(e.target.value)} name="to_title"></TitleInput>
                  </TitleInputText>
                  <DateInputText>
                    日期
                    <DateInputLine />
                    <DateInput
                      type="date"
                      onChange={(e) => setDate(e.target.value)}
                      // min={new Date().toISOString().split('T')[0]}
                      name="to_date"
                    ></DateInput>
                  </DateInputText>
                  <DescriptionText>
                    本次訓練重點
                    <DescriptionLine />
                    <DescriptionInput
                      name="to_description"
                      onChange={(e) => setDescription(e.target.value)}
                    ></DescriptionInput>
                  </DescriptionText>
                  <ToName name="to_name" defaultValue={displayName}></ToName>
                  <ToEmail name="to_email" defaultValue={email}></ToEmail>
                </PageOneDetailContent>
              </form>
            </PageOneDetail>
            <PageOnePicOutside>
              <PageOnePic />
            </PageOnePicOutside>
            <TurnOutside>
              <TurnRight onClick={getPageTwo}>
                <FontAwesomeIcon icon={faCircleArrowRight} />
              </TurnRight>
            </TurnOutside>
          </TrainingOutsideOne>
          <TrainingOutsideTwo $isHide={openTrainingTwo}>
            <Close onClick={closeAddTraining} src={remove} />
            <ActionText>
              加入菜單動作
              <ActionLine />
            </ActionText>
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
            <TrainingOutsideTwoBottom>
              <CalculationShowZone
                choiceAction={choiceAction}
                data={data}
                dataNull={dataNull}
                compeleteTrainingSetting={compeleteTrainingSetting}
                sendEmail={sendEmail}
              />
              {videoShow ? (
                <VideoZone $isHide={videoShow}>
                  <CloseVideo onClick={closeVideo} src={remove} />
                  <video autoPlay loop width="100%" controls src={videoUrl}></video>
                </VideoZone>
              ) : (
                <NoVideo>
                  <NoVideoTitle>範例影片播放區</NoVideoTitle>
                </NoVideo>
              )}
            </TrainingOutsideTwoBottom>
            <CompeleteTrainingSettingOutside>
              <CompeleteTrainingSetting
                type="button"
                value="submit"
                onClick={() => {
                  compeleteTrainingSetting();
                }}
              >
                完成菜單設定
              </CompeleteTrainingSetting>
            </CompeleteTrainingSettingOutside>
            <TurnOutside>
              <TurnLeft onClick={getPageOne}>
                <FontAwesomeIcon icon={faCircleArrowLeft} />
              </TurnLeft>
            </TurnOutside>
          </TrainingOutsideTwo>
        </TrainingOutside>
        {/* <Dnd />
      <Dnd2 />
      <BeautifulDnD /> */}
        <TrainingBackground $isHide={showHistoryBackground} />
      </Wrapper>
    </>
  );
};

export default Training;

const LoadingOutside = styled.div`
  position: fixed;
  z-index: 2000;
  background: rgba(49, 50, 55, 1);
  height: 100%;
  width: 100%;
  display: ${(props) => (props.$isActive ? 'block' : 'none')};
`;

const LoadingBlocks = styled.div`
  position: fixed;
  z-index: 2000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  font-size: 20px;
  position: relative;
  padding-top: 90px;
`;

const Close = styled.img`
  cursor: pointer;
  width: 30px;
  height: 30px;
  z-index: 90;
  position: absolute;
  right: 20px;
  top: 17px;
  scale: 1;
  transition: 0.3s;
  &:hover {
    scale: 1.2;
  }
`;

const BannerOutside = styled.div`
  height: 320px;
  @media screen and (max-width: 1279px) {
    height: 200px;
  }
`;

const Banner = styled.div`
  background-image: url(${trainingBanner});
  background-size: cover;
  background-position: 0% 20%;
  background-repeat: no-repeat;
  position: absolute;
  width: 100%;
  height: 320px;
  @media screen and (max-width: 1279px) {
    height: 200px;
  }
`;

const BannerText = styled.div`
  color: white;
  padding-top: 180px;
  padding-left: 150px;
  font-size: 25px;
  letter-spacing: 3px;
  font-size: 35px;
  animation-name: fadein;
  animation-duration: 2s;
  @keyframes fadein {
    0% {
      transform: translateX(-6%);
      opacity: 0%;
    }
    100% {
      transform: translateX(0%);
      opacity: 100%;
    }
  }
  @media screen and (max-width: 1279px) {
    font-size: 25px;
    padding-left: 50px;
    padding-top: 100px;
  }
`;

const AddTrainingTableOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #74c6cc;
  width: 150px;
  margin: 40px auto 40px auto;
  color: black;
  cursor: pointer;
  transition: ease-in-out 0.2s;
  animation-name: light;
  animation-duration: 2.5s;
  animation-iteration-count: infinite;
  &:hover {
    background: white;
    color: black;
  }
  @keyframes light {
    0% {
      box-shadow: 0px 0px 0px white;
    }
    50% {
      box-shadow: 0px 0px 20px white;
    }
    100% {
      box-shadow: 0px 0px 0px white;
    }
  }
`;

const AddTrainingTable = styled.div`
  padding: 10px;
  font-size: 25px;
  letter-spacing: 2px;
  font-weight: 600;
`;

const NoHistory = styled.div`
  max-width: 1200px;
  margin: auto;
  margin-bottom: 30px;
  color: white;
  border: 1px solid #818a8e;
  padding: 50px 150px;
  letter-spacing: 2px;
  @media screen and (max-width: 767px) {
    padding: 50px 50px;
  }
`;

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝第一頁＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

const TrainingOutside = styled.div`
  position: absolute;
  left: 50%;
  top: 15%;
  transform: translate(-50%, -5%);
  z-index: 10;
  display: ${(props) => (props.$isHide ? 'block' : 'none')};
  background: #313237;
  max-width: ${(props) => (props.$isActive ? '1000px' : '700px')};
  margin-bottom: 40px;
  color: white;
  border-top: 0.5rem solid #74c6cc;
  @media screen and (max-width: 1279px) {
    top: 11.5%;
  }
  @media screen and (max-width: 767px) {
    top: 7.1%;
  }
`;

const TrainingOutsideOne = styled.div`
  display: ${(props) => (props.$isHide ? 'block' : 'none')};
`;

const PageOneDetail = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px;
  color: #74c6cc;
  font-size: 24px;
  @media screen and (max-width: 767px) {
    padding: 20px;
  }
`;

const PageOneDetailContent = styled.div``;

const TitleInputText = styled.div`
  margin-top: 10px;
  @media screen and (max-width: 767px) {
    font-size: 20px;
  }
`;

const TitleInputLine = styled.div`
  border-bottom: 2px solid #74c6cc;
  margin-top: 15px;
  margin-bottom: 10px;
  @media screen and (max-width: 767px) {
    border-bottom: 1px solid #74c6cc;
    margin-top: 8px;
  }
`;

const TitleInput = styled.input`
  width: 500px;
  height: 40px;
  border-radius: 15px;
  font-size: 20px;
  padding-left: 10px;
  margin-top: 10px;
  letter-spacing: 2px;
  @media screen and (max-width: 767px) {
    height: 30px;
    margin-top: 0px;
    width: 400px;
  }
  @media screen and (max-width: 525px) {
    height: 30px;
    margin-top: 0px;
    width: 300px;
  }
`;

const DateInputText = styled.div`
  margin-top: 25px;
  @media screen and (max-width: 767px) {
    font-size: 20px;
  }
`;

const DateInputLine = styled.div`
  border-bottom: 2px solid #74c6cc;
  margin-top: 15px;
  margin-bottom: 10px;
  @media screen and (max-width: 767px) {
    border-bottom: 1px solid #74c6cc;
    margin-top: 8px;
  }
`;

const DateInput = styled.input`
  width: 100%;
  height: 40px;
  border-radius: 15px;
  font-size: 20px;
  padding: 0px 5px;
  margin-top: 10px;
  @media screen and (max-width: 767px) {
    height: 30px;
    margin-top: 0px;
    font-size: 16px;
  }
`;

const DescriptionText = styled.div`
  margin-top: 25px;
  @media screen and (max-width: 767px) {
    font-size: 20px;
  }
`;

const DescriptionLine = styled.div`
  border-bottom: 2px solid #74c6cc;
  margin-top: 15px;
  margin-bottom: 10px;
  @media screen and (max-width: 767px) {
    border-bottom: 1px solid #74c6cc;
    margin-top: 8px;
  }
`;

const DescriptionInput = styled.textarea`
  width: 100%;
  margin-top: 10px;
  border-radius: 15px;
  font-size: 20px;
  padding: 10px 10px;
  letter-spacing: 2px;
  resize: none;
  height: 100px;
  @media screen and (max-width: 767px) {
    height: 80px;
    margin-top: 2px;
  }
`;

const PageOnePicOutside = styled.div`
  width: 100%;
  height: 200px;
  @media screen and (max-width: 767px) {
    height: 100px;
  }
`;

const PageOnePic = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${pageOnePic});
  background-size: cover;
  background-position: 30% 95%;
  background-repeat: no-repeat;
`;

const TurnRight = styled.div`
  cursor: pointer;
  margin-left: auto;
  margin-right: 13px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 30px;
  &:hover {
    color: #74c6cc;
  }
`;

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝第一頁＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝第二頁＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

const TrainingOutsideTwo = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;

const ActionText = styled.div`
  padding-top: 30px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 20px;
  color: #74c6cc;
  font-size: 24px;
  @media screen and (max-width: 767px) {
    padding-bottom: 0px;
  }
`;

const ActionLine = styled.div`
  border-bottom: 2px solid #74c6cc;
  margin-top: 15px;
  margin-bottom: 10px;
`;

const ActionOutside = styled.div`
  display: flex;
  justify-content: center;
  width: 1000px;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
    width: 700px;
  }
  @media screen and (max-width: 767px) {
    flex-direction: column;
    width: 550px;
  }
  @media screen and (max-width: 575px) {
    flex-direction: column;
    margin: 0 auto;
    width: 320px;
  }
`;

const CloseVideo = styled.img`
  cursor: pointer;
  width: 30px;
  height: 30px;
  z-index: 90;
  position: absolute;
  scale: 1;
  top: 10px;
  right: 50px;
  &:hover {
    scale: 1.2;
  }
  @media screen and (max-width: 767px) {
    top: 10px;
    right: 10px;
  }
  @media screen and (max-width: 575px) {
    top: 10px;
    right: 10px;
  }
`;

const VideoZone = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
  z-index: 65;
  padding: 0px 40px;
  width: 550px;
  position: relative;
  @media screen and (max-width: 1279px) {
    margin-top: 40px;
  }
  @media screen and (max-width: 767px) {
    width: 350px;
    padding: 0px 0px;
  }
  @media screen and (max-width: 575px) {
    width: 300px;
    padding: 0px 0px;
    margin-right: 0px;
  }
`;

const NoVideoTitle = styled.div`
  width: 200px;
  text-align: center;
`;

const NoVideo = styled.div`
  width: 450px;
  height: 253.13px;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px 40px;
  @media screen and (max-width: 1279px) {
    margin-top: 40px;
  }
  @media screen and (max-width: 767px) {
    width: 350px;
  }
  @media screen and (max-width: 575px) {
    width: 250px;
  }
`;

const TrainingOutsideTwoBottom = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 1279px) {
    flex-direction: column-reverse;
  }
`;

const TurnLeft = styled.div`
  cursor: pointer;
  margin-right: auto;
  margin-left: 13px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 30px;
  &:hover {
    color: #74c6cc;
  }
`;

const TurnOutside = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ToEmail = styled.input`
  display: none;
`;

const ToName = styled.input`
  display: none;
`;

const TrainingBackground = styled.div`
  background: black;
  top: 0;
  opacity: 50%;
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;

const CompeleteTrainingSettingOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #74c6cc;
  width: 140px;
  margin-top: 15px;
  margin-bottom: 10px;
  margin-left: auto;
  margin-right: auto;
  color: black;
  cursor: pointer;
  &:hover {
    background: white;
    color: black;
  }
`;

const CompeleteTrainingSetting = styled.div`
  cursor: pointer;
  padding: 8px;
  font-size: 18px;
  letter-spacing: 1.2px;
  font-weight: 600;
`;
