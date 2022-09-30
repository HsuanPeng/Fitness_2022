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
  getDoc,
  startAfter,
  limit,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

//components
import UserContext from '../../contexts/UserContext';
import HistoryZone from './HistoryZone';
import OpenHistoryZone from './OpenHistoryZone';
import ChoiceActionOutsideZone from './ChoiceActionOutsideZone';
import PromoteActionOutsideZone from './PromoteActionOutsideZone';
import CalculationShowZone from './CalculationShowZone';
import FavoritePage from './FavoritePage';
import SkeletonPage from './SkeletonPage';

//引入動作菜單
import ACTIONS from './allActionsLists';

//寄信
import emailjs from 'emailjs-com';

//chart.js
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

//pic
import trainingBanner from '../../images/Beautiful-woman-holding-heavy-604970.jpg';
import pageOnePic from '../../images/Empty-gym-in-sunlight-397510.jpg';
import logo from '../../images/高畫質logo_藍色2.png';

//FontAwesomeIcon
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleArrowRight,
  faCircleArrowLeft,
  faCircleXmark,
  faCalendarDays,
  faHandPointUp,
  faDumbbell,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import {} from '@fortawesome/free-brands-svg-icons';

//loading animation
import { Blocks } from 'react-loader-spinner';

//uuid
import { v4 as uuid } from 'uuid';

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
  const [trainingData, setTrainingData] = useState([]);

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
  const [choiceWeight, setChoiceWeight] = useState(0);
  const [choiceTimes, setChoiceTimes] = useState(0);

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
  const [historyIndex, setHistoryIndex] = useState();

  //上傳照片
  const [imageUpload, setImageUpload] = useState();
  const [imageList, setImageList] = useState('');
  const [pickHistory, setPickHistory] = useState();
  const [showPicture, setShowPicture] = useState(true);

  //點擊顯示影片
  const [videoUrl, setVideoUrl] = useState('');
  const [videoShow, setVideoShow] = useState(false);
  const [playing, setPlaying] = useState();

  //loading動畫
  const [loading, setLoading] = useState(false);
  const [skeleton, setSkeleton] = useState(false);
  const [uploadSkeleton, setUploadSkeleton] = useState(false);

  //喜愛動作
  const [favoriteTrainings, setFavoriteTrainings] = useState([]);
  const [favoriteChoice, setFavoriteChoice] = useState(null);

  //打開喜愛菜單
  const [openFavorite, setOpenFavorite] = useState(false);
  const [pickActions, setPickActions] = useState([]);
  const [pickFavorite, setPickFavorite] = useState(null);
  const [pickID, setPickID] = useState();

  //確認刪除
  const [deleteAlert, setDeleteAlert] = useState(false);

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
      setImageList('');
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
    if (title !== '' && date !== '' && description !== '') {
      setOpenTrainingOne(false);
      setOpenTrainingTwo(true);
      setPageTwo(true);
      setPart('肩');
    } else {
      alertPop();
      setContent('請填寫完整資料');
    }
  }

  //點擊右上角XX
  function closeAddTraining() {
    setOpenTrainingInput(false);
    setOpenTrainingOne(false);
    setOpenTrainingTwo(false);
    setOpenCompleteSetting(false);
    setShowHistoryBackground(false);
    setTitle('');
    setDate('');
    setDescription('');
    setChoiceAction([]);
    setTotalWeight(0);
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
      const docRef = await doc(db, 'users', uid, 'trainingTables', pickHistory);
      const data = {
        complete: '已完成',
      };
      await updateDoc(docRef, data);
      const newArr = [...trainingData];
      newArr[historyIndex].complete = '已完成';
      setTrainingData(newArr);
      setShowHistory(newArr[historyIndex]);
    } catch (e) {
      console.log(e);
    }
  }

  //可以刪除菜單
  async function deleteTrainingItem() {
    setDeleteAlert(true);
  }

  //真的刪除
  async function confirmDeleteTrainingItem() {
    setLoading(true);
    try {
      const docRef = await doc(db, 'users', uid, 'trainingTables', pickHistory);
      await deleteDoc(docRef);
      setShowHistoryToggle(false);
      setShowHistoryBackground(false);
      setLoading(false);
      alertPop();
      setContent('成功刪除菜單');
      setDeleteAlert(false);
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
    setChoiceAction((pre) => {
      const addAction = { ...promoteActions[e.target.id] };
      pre.forEach((action) => {
        if (action.id === addAction.id) {
          addAction.id = uuid();
        }
      });
      const newArr = [...pre, addAction];
      return newArr;
    });
  }

  //左邊的可以刪除
  function deleteItem(id) {
    const newNextChoiceAction = choiceAction.filter((item, index) => {
      return index !== id;
    });
    setChoiceAction(newNextChoiceAction);
  }

  //加總每個動作的重量
  useEffect(() => {
    let re = /^[0-9]+.?[0-9]*$/;
    const total = choiceAction.reduce((prev, item) => prev + item.weight * item.times, 0);
    if (!re.test(total)) {
      alertPop();
      setContent('請輸入數字');
    } else {
      setTotalWeight(Number(total.toFixed(1)));
    }
  }, [choiceAction, choiceWeight, choiceTimes]);

  // ＝＝＝＝＝＝＝＝＝＝加入動作＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝寫入菜單＝＝＝＝＝＝＝＝＝＝＝

  //點擊完成菜單設定，寫入菜單
  async function compeleteTrainingSetting() {
    try {
      if (totalWeight !== 0.0 && choiceAction.length > 0) {
        const docRef = doc(collection(db, 'users', uid, 'trainingTables'));
        const data = {
          docID: docRef.id,
          complete: '未完成',
          picture: imageList,
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
        setContent('完成設定並寄信通知');
        setTitle('');
        setDate('');
        setDescription('');
      } else if (!choiceAction.length > 0) {
        alertPop();
        setContent('請加入動作');
      } else {
        alertPop();
        setContent('請輸入數字');
      }
    } catch (e) {
      console.log(e);
    }
  }

  // ＝＝＝＝＝＝＝＝＝＝寫入菜單＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝即時抓出每筆菜單資料＝＝＝＝＝＝＝＝＝＝＝

  useEffect(() => {
    if (isLoggedIn == false) {
      setTrainingData([]);
    } else {
      async function getTrainingTables() {
        const docRef = query(collection(db, 'users', uid, 'trainingTables'), orderBy('trainingDate'));
        setSkeleton(true);
        onSnapshot(docRef, (item) => {
          const newData = [];
          item.forEach((doc) => {
            newData.push(doc.data());
          });
          const reverseNewData = newData.reverse();
          setTrainingData(reverseNewData);
        });
        setTimeout(() => {
          setSkeleton(false);
        }, 1300);
      }
      getTrainingTables();
    }
  }, [isLoggedIn]);

  // ＝＝＝＝＝＝＝＝＝＝即時抓出每筆菜單資料＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝點擊個別菜單打開內容＝＝＝＝＝＝＝＝＝＝＝

  function openHistory(index) {
    setLoading(true);
    setHistoryIndex(index);
    setShowHistory(trainingData[index]);
    setShowHistoryActions(trainingData[index].actions);
    setShowHistoryToggle(true);
    setPickHistory(trainingData[index].docID);
    setImageList(trainingData[index].picture);
    setShowPicture((prevShowPicture) => !prevShowPicture);
    setShowHistoryBackground(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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
  useEffect(() => {
    if (imageUpload == null) return;
    setUploadSkeleton(true);
    const imageRef = ref(storage, `${uid}/${pickHistory}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageList(url);
        const docRef = doc(db, 'users', uid, 'trainingTables', pickHistory);
        const data = {
          picture: url,
        };
        updateDoc(docRef, data);
        alertPop();
        setContent('照片上傳成功');
        setTimeout(() => {
          setUploadSkeleton(false);
        }, 1500);
      });
    });
  }, [imageUpload]);

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
    setPlaying(null);
  }

  // ＝＝＝＝＝＝＝＝＝＝關閉影片＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝喜愛動作功能＝＝＝＝＝＝＝＝＝＝＝

  //把喜愛動作資料從雲端抓下來
  async function getFavoriteTrainings() {
    if (isLoggedIn == false) {
      setFavoriteTrainings([]);
    } else {
      const docRef = query(collection(db, 'users', uid, 'favoriteTrainings'), orderBy('setDate'));
      onSnapshot(docRef, (item) => {
        const newData = [];
        item.forEach((doc) => {
          newData.push(doc.data());
        });
        setFavoriteTrainings(newData);
      });
    }
  }

  //map出選到的喜愛動作
  useEffect(() => {
    const showFavoriteTrainings = async () => {
      const docRef = doc(db, 'users', uid, 'favoriteTrainings', favoriteChoice);
      const docSnap = await getDoc(docRef);
      setTitle(docSnap.data().title);
      setDescription(docSnap.data().description);
      setChoiceAction(docSnap.data().actions);
      alertPop();
      setContent('成功套用喜愛菜單');
    };
    showFavoriteTrainings();
  }, [favoriteChoice]);

  //點擊管理喜愛菜單
  async function manageFavoriteTraining() {
    if (isLoggedIn) {
      setOpenFavorite(true);
      const docRef = await query(collection(db, 'users', uid, 'favoriteTrainings'), orderBy('setDate'));
      onSnapshot(docRef, (item) => {
        const newData = [];
        item.forEach((doc) => {
          newData.push(doc.data());
        });
        setFavoriteTrainings(newData);
      });
    } else {
      signIn();
    }
  }

  // ＝＝＝＝＝＝＝＝＝＝喜愛動作功能＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝歷史菜單編輯功能＝＝＝＝＝＝＝＝＝＝＝

  async function editTraining() {
    setChoiceAction(showHistory.actions);
    setTitle(showHistory.title);
    setDescription(showHistory.description);
    setDate(showHistory.trainingDate);
    setShowHistoryToggle(false);
    setOpenTrainingInput(true);
    setOpenTrainingOne(true);
    setImageList(showHistory.picture);
    console.log(showHistory.docID);
    const docRef = await doc(db, 'users', uid, 'trainingTables', showHistory.docID);
    deleteDoc(docRef);
  }

  // ＝＝＝＝＝＝＝＝＝＝歷史菜單編輯功能＝＝＝＝＝＝＝＝＝＝＝

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
      {deleteAlert && (
        <>
          <DeleteAlertOutside>
            <DeleteContent>
              <DeletePic>
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </DeletePic>
              確定執行刪除？
            </DeleteContent>
            <DeleteButton>
              <YesOutside onClick={confirmDeleteTrainingItem}>
                <Yes>YES</Yes>
              </YesOutside>
              <NoOutside
                onClick={() => {
                  setDeleteAlert(false);
                }}
              >
                <No>NO</No>
              </NoOutside>
            </DeleteButton>
          </DeleteAlertOutside>
          <DeleteBackground />
        </>
      )}
      <Wrapper>
        <BannerOutside>
          <Banner>
            <BannerText>開始我的記錄！</BannerText>
          </Banner>
        </BannerOutside>
        <TrainingZone>
          <TrainingButtons>
            <AddTrainingTableOutside>
              <AddTrainingTable
                onClick={() => {
                  addTraining();
                  getFavoriteTrainings();
                }}
              >
                建立菜單
              </AddTrainingTable>
            </AddTrainingTableOutside>
            <ManageFavoriteTrainingOutside>
              <ManageFavoriteTraining onClick={manageFavoriteTraining}>喜愛菜單</ManageFavoriteTraining>
            </ManageFavoriteTrainingOutside>
          </TrainingButtons>
          <FavoritePage
            openFavorite={openFavorite}
            setOpenFavorite={setOpenFavorite}
            favoriteTrainings={favoriteTrainings}
            setFavoriteTrainings={setFavoriteTrainings}
            pickFavorite={pickFavorite}
            setPickFavorite={setPickFavorite}
            pickActions={pickActions}
            setPickActions={setPickActions}
            pickID={pickID}
            setPickID={setPickID}
          />
          {skeleton && (
            <>
              <SkeletonPage />
            </>
          )}
          {trainingData.length > 0 ? (
            <>
              {!skeleton && (
                <>
                  <HistoryZone trainingData={trainingData} openHistory={openHistory} />
                </>
              )}
            </>
          ) : (
            <NoHistory>尚未建立菜單</NoHistory>
          )}
        </TrainingZone>
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
          deleteTrainingItem={deleteTrainingItem}
          choiceAction={choiceAction}
          data={data}
          editTraining={editTraining}
          uploadSkeleton={uploadSkeleton}
          setUploadSkeleton={setUploadSkeleton}
        />
        {openTrainingInput && (
          <>
            <TrainingOutside $isHide={openTrainingInput} $isActive={pageTwo}>
              <TrainingOutsideOne $isHide={openTrainingOne}>
                <PageOneDetail>
                  <Close onClick={closeAddTraining}>
                    <FontAwesomeIcon icon={faCircleXmark} />
                  </Close>
                  <form ref={form}>
                    <PageOneDetailContent>
                      <TitleInputText>
                        <FavoriteTitle>
                          <Title>
                            <FaDumbbell>
                              <FontAwesomeIcon icon={faDumbbell} />
                            </FaDumbbell>
                            主題
                          </Title>

                          <FavoriteSelectOutside
                            onChange={(e) => setFavoriteChoice(e.target.value)}
                            defaultValue={null}
                          >
                            {favoriteTrainings.length > 0 ? (
                              <>
                                <option disabled selected>
                                  套用喜愛菜單
                                </option>
                                {favoriteTrainings.map((item, index) => (
                                  <option index={index} value={item.docID}>
                                    {item.title}
                                  </option>
                                ))}
                              </>
                            ) : (
                              <option disabled selected>
                                無喜愛菜單
                              </option>
                            )}
                          </FavoriteSelectOutside>
                        </FavoriteTitle>
                        <TitleInputLine />
                        <TitleInput
                          onChange={(e) => setTitle(e.target.value)}
                          name="to_title"
                          value={title}
                          maxLength={10}
                        ></TitleInput>
                      </TitleInputText>
                      <TitleRemind>＊最多輸入10字</TitleRemind>
                      <DateInputText>
                        <DateInputTop>
                          <FaCalendarDays>
                            <FontAwesomeIcon icon={faCalendarDays} />
                          </FaCalendarDays>
                          日期
                        </DateInputTop>
                        <DateInputLine />
                        <DateInput
                          type="date"
                          onChange={(e) => setDate(e.target.value)}
                          name="to_date"
                          value={date}
                        ></DateInput>
                      </DateInputText>
                      <DescriptionText>
                        <DescriptionTop>
                          <FaHandPointUp>
                            <FontAwesomeIcon icon={faHandPointUp} />
                          </FaHandPointUp>
                          本次訓練重點
                        </DescriptionTop>
                        <DescriptionLine />
                        <DescriptionInput
                          name="to_description"
                          onChange={(e) => setDescription(e.target.value)}
                          value={description}
                          maxLength={30}
                        ></DescriptionInput>
                      </DescriptionText>
                      <DescriptionRemind>＊最多輸入30字</DescriptionRemind>
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
                <Close onClick={closeAddTraining}>
                  <FontAwesomeIcon icon={faCircleXmark} />
                </Close>
                <ActionText>
                  <ActionTop>
                    <ActionPicOutside>
                      <ActionPic src={logo} />
                    </ActionPicOutside>
                    <ActionTitle> 加入菜單動作</ActionTitle>
                  </ActionTop>
                  <ActionLine />
                </ActionText>
                <ActionOutside>
                  <ChoiceActionOutsideZone
                    choiceAction={choiceAction}
                    setChoiceAction={setChoiceAction}
                    deleteItem={deleteItem}
                    totalWeight={totalWeight}
                    choiceWeight={choiceWeight}
                    setChoiceWeight={setChoiceWeight}
                    choiceTimes={choiceTimes}
                    setChoiceTimes={setChoiceTimes}
                  />
                  <PromoteActionOutsideZone
                    setPart={setPart}
                    promoteActions={promoteActions}
                    addActionItem={addActionItem}
                    openVideo={openVideo}
                    playing={playing}
                    setPlaying={setPlaying}
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
                      <CloseVideo onClick={closeVideo}>
                        <FontAwesomeIcon icon={faCircleXmark} />
                      </CloseVideo>
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
            <TrainingBackground $isHide={showHistoryBackground} />
          </>
        )}
      </Wrapper>
    </>
  );
};

export default Training;

const Center = styled.div`
  width: 1px;
  height: 200px;
  margin: 0 auto;
  background: red;
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 300;
`;

const LoadingOutside = styled.div`
  position: fixed;
  z-index: 2000;
  background: #475260;
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

const DeleteAlertOutside = styled.div`
  display: flex;
  padding: 15px;
  width: 400px;
  background: #475260;
  border: 5px solid #74c6cc;
  border-radius: 20px;
  position: absolute;
  top: 35%;
  left: calc(50% - 200px);
  z-index: 100;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  @media screen and (max-width: 767px) {
    padding: 10px;
    width: 300px;
    left: calc(50% - 150px);
  }
`;

const DeletePic = styled.div`
  color: #ffd700;
  font-size: 40px;
  margin-right: 20px;
`;

const DeleteContent = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-size: 30px;
  margin-top: 10px;
  letter-spacing: 6px;
  @media screen and (max-width: 767px) {
    margin-top: 0px;
    font-size: 25px;
    letter-spacing: 4px;
  }
`;
const DeleteButton = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 10px;
`;

const YesOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #74c6cc;
  width: 50px;
  color: black;
  cursor: pointer;
  border-radius: 10px;
  margin-right: 30px;
  &:hover {
    background: red;
    color: black;
  }
`;

const Yes = styled.div`
  padding: 3px;
  font-size: 20px;
  letter-spacing: 2px;
  font-weight: 600;
`;

const NoOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #74c6cc;
  width: 50px;
  color: black;
  cursor: pointer;
  border-radius: 10px;
  &:hover {
    background: white;
    color: black;
  }
`;

const No = styled.div`
  padding: 3px;
  font-size: 20px;
  letter-spacing: 2px;
  font-weight: 600;
`;

const DeleteBackground = styled.div`
  background: black;
  top: 0;
  opacity: 50%;
  z-index: 60;
  position: fixed;
  width: 100vw;
  height: 100vh;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  font-size: 20px;
  position: relative;
  padding-top: 90px;
`;

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

const TrainingZone = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
`;

const TrainingButtons = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 0 auto;
`;

const AddTrainingTableOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #74c6cc;
  width: 180px;
  margin: 40px 20px 40px auto;
  color: black;
  cursor: pointer;
  transition: ease-in-out 0.2s;
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
  @media screen and (max-width: 767px) {
    width: 120px;
    margin: 40px 20px 40px 0px;
  }
`;

const AddTrainingTable = styled.div`
  padding: 10px;
  font-size: 25px;
  letter-spacing: 2px;
  font-weight: 600;
  @media screen and (max-width: 767px) {
    font-size: 18px;
  }
`;

const ManageFavoriteTrainingOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #74c6cc;
  width: 180px;
  margin: 40px auto 40px 20px;
  color: black;
  cursor: pointer;
  transition: ease-in-out 0.2s;
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
  @media screen and (max-width: 767px) {
    width: 120px;
  }
`;

const ManageFavoriteTraining = styled.div`
  padding: 10px;
  font-size: 25px;
  letter-spacing: 2px;
  font-weight: 600;
  @media screen and (max-width: 767px) {
    font-size: 18px;
  }
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
  left: ${(props) => (props.$isActive ? 'calc(50% - 500px)' : 'calc(50% - 280px)')};
  top: ${(props) => (props.$isActive ? '7%' : '10%')};
  z-index: 20;
  display: ${(props) => (props.$isHide ? 'block' : 'none')};
  background: #475260;
  max-width: ${(props) => (props.$isActive ? '1000px' : '700px')};
  margin-bottom: 100px;
  margin-top: 100px;
  color: white;
  border-top: 0.5rem solid #74c6cc;
  @media screen and (max-width: 1279px) {
    left: ${(props) => (props.$isActive ? 'calc(50% - 350px)' : 'calc(50% - 280px)')};
    top: ${(props) => (props.$isActive ? '4%' : '5%')};
  }
  @media screen and (max-width: 767px) {
    left: ${(props) => (props.$isActive ? 'calc(50% - 275px)' : 'calc(50% - 220px)')};
    top: ${(props) => (props.$isActive ? '2%' : '2%')};
  }
  @media screen and (max-width: 575px) {
    left: ${(props) => (props.$isActive ? 'calc(50% - 165px)' : 'calc(50% - 220px)')};
  }
  @media screen and (max-width: 500px) {
    left: ${(props) => (props.$isActive ? 'calc(50% - 165px)' : 'calc(50% - 170px)')};
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

const FavoriteSelectOutside = styled.select`
  width: 25%;
  height: 30px;
  background: white;
  color: gray;
  padding-left: 5px;
  font-size: 14px;
  border-radius: 6px;
  option {
    color: black;
    background: white;
    display: flex;
    white-space: pre;
    min-height: 20px;
  }
  @media screen and (max-width: 575px) {
    width: 30%;
  }
`;

const Title = styled.div`
  font-weight: 600;
  letter-spacing: 3px;
  margin-right: 20px;
  display: flex;
  @media screen and (max-width: 767px) {
    font-size: 20px;
  }
`;

const TitleRemind = styled.div`
  color: #cd5c5c;
  font-size: 16px;
  letter-spacing: 2px;
  margin-top: 4px;
`;

const FaDumbbell = styled.div`
  margin-right: 10px;
`;

const FavoriteTitle = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const TitleInputText = styled.div``;

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
  @media screen and (max-width: 500px) {
    height: 30px;
    margin-top: 0px;
    width: 300px;
  }
`;

const DateInputText = styled.div`
  margin-top: 25px;
  font-weight: 600;
  letter-spacing: 3px;
  @media screen and (max-width: 767px) {
    font-size: 20px;
  }
`;

const DateInputTop = styled.div`
  display: flex;
`;

const FaCalendarDays = styled.div`
  margin-right: 15px;
  margin-left: 3px;
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
  font-weight: 600;
  letter-spacing: 3px;
  @media screen and (max-width: 767px) {
    font-size: 20px;
  }
`;

const DescriptionRemind = styled.div`
  color: #cd5c5c;
  font-size: 16px;
  letter-spacing: 2px;
  margin-top: -3px;
`;

const DescriptionTop = styled.div`
  display: flex;
`;

const FaHandPointUp = styled.div`
  margin-right: 15px;
  margin-left: 3px;
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
  font-weight: 600;
  letter-spacing: 3px;

  @media screen and (max-width: 767px) {
    padding-bottom: 0px;
  }
`;

const ActionTop = styled.div`
  display: flex;
  align-items: center;
`;

const ActionPicOutside = styled.div``;

const ActionPic = styled.img`
  width: 70px;
  margin-right: 15px;
  padding-top: 10px;
`;

const ActionTitle = styled.div``;

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

const CloseVideo = styled.div`
  cursor: pointer;
  width: 30px;
  height: 30px;
  z-index: 90;
  position: absolute;
  scale: 1;
  right: 50px;
  color: #c14e4f;
  font-size: 30px;
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
  z-index: 11;
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: ${(props) => (props.$isHide ? 'block' : 'none')};
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
