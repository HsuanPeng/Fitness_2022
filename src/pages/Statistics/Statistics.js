import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

//components
import UserContext from '../../contexts/UserContext';
import BodyFatDataPage from './BodyFatDataPage';
import BodyWeightDataPage from './BodyWeightDataPage';

//firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, collection, onSnapshot, query, orderBy, deleteDoc } from 'firebase/firestore';

//chart.js
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

//pic
import trainingBanner from '../../images/Athlete-preparing-for-training-467612.jpg';

//loading animation
import { Blocks } from 'react-loader-spinner';

const Statistics = () => {
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

  //控制顯示體脂肪or體重
  const [showFatRecord, setShowFatRecord] = useState(true);
  const [showWeightRecord, setShowWeightRecord] = useState(false);

  //抓出體脂肪歷史＋寫入＋刪除
  const [fatRecord, setFatRecord] = useState([]);
  const [fatDateInput, setFatDateInput] = useState();
  const [fatNumberInput, setFatNumberInput] = useState();

  //體脂肪率折線圖
  const [fatDateLine, setFatDateLine] = useState([]);
  const [fatNumberLine, setFatNumberLine] = useState([]);

  //抓出體重歷史＋寫入＋刪除
  const [weightRecord, setWeightRecord] = useState([]);
  const [weightDateInput, setWeightDateInput] = useState();
  const [weightNumberInput, setWeightNumberInput] = useState();

  //體重率折線圖
  const [weightDateLine, setWeightDateLine] = useState([]);
  const [weightNumberLine, setWeightNumberLine] = useState([]);

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

  // ＝＝＝＝＝＝＝＝＝＝＝啟動firebase＝＝＝＝＝＝＝＝＝＝＝

  //＝＝＝＝＝＝＝＝＝＝＝體脂歷史資料＝＝＝＝＝＝＝＝＝＝＝

  //即時map出歷史資料
  useEffect(() => {
    if (isLoggedIn == false) {
      setFatRecord([]);
    } else {
      async function getFatRecord() {
        const docRef = await query(collection(db, 'users', uid, 'fatRecords'), orderBy('measureDate'));
        setLoading(true);
        onSnapshot(docRef, (item) => {
          const newData = [];
          item.forEach((doc) => {
            newData.push(doc.data());
            setFatRecord(newData);
          });
          const newFatNumberData = [];
          item.forEach((doc) => {
            newFatNumberData.push(doc.data().bodyFat);
            setFatNumberLine(newFatNumberData);
          });
          const newFatDateData = [];
          item.forEach((doc) => {
            newFatDateData.push(doc.data().measureDate);
            setFatDateLine(newFatDateData);
          });
        });
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
      getFatRecord();
    }
  }, [isLoggedIn, showFatRecord, showWeightRecord]);

  //登錄資料
  async function writeBodyFat(index) {
    if (isLoggedIn) {
      try {
        if (fatDateInput !== undefined && fatNumberInput !== undefined) {
          const docRef = await doc(collection(db, 'users', uid, 'fatRecords'));
          const data = {
            measureDate: fatDateInput,
            bodyFat: Number(fatNumberInput),
            docID: docRef.id,
          };
          await setDoc(docRef, data);
          setFatNumberInput('');
          setFatDateInput('');
        } else {
          alertPop();
          setContent('請填寫完整資料');
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      signIn();
    }
  }

  //刪除個別資料
  async function deleteFatRecord(id) {
    const newFatRecord = fatRecord.filter((item, index) => {
      return id != index;
    });
    setFatRecord(newFatRecord);
    updateFatRecord(id);
  }

  //刪除以後更新資料庫
  async function updateFatRecord(id) {
    const docRef = await doc(db, 'users', uid, 'fatRecords', fatRecord[id].docID);
    await deleteDoc(docRef);
  }

  //＝＝＝＝＝＝＝＝＝＝＝體脂歷史資料＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝＝體脂chart.js＝＝＝＝＝＝＝＝＝＝＝

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  const BodyFatData = {
    labels: fatDateLine,
    datasets: [
      {
        label: '體脂肪率',
        data: fatNumberLine,
        fill: true,
        backgroundColor: 'rgba(238,141,71,0.2)',
        borderColor: 'rgba(238,141,71,1)',
      },
    ],
  };

  const dataNull = {
    labels: fatDateLine,
    datasets: [
      {
        label: '無資料',
        data: [0],
        fill: true,
        backgroundColor: 'grey',
        borderColor: 'grey',
      },
    ],
  };

  // ＝＝＝＝＝＝＝＝＝＝＝體脂chart.js＝＝＝＝＝＝＝＝＝＝＝

  //＝＝＝＝＝＝＝＝＝＝＝體重歷史資料＝＝＝＝＝＝＝＝＝＝＝

  //即時map出歷史資料
  useEffect(() => {
    if (isLoggedIn == false) {
      setWeightRecord([]);
    } else {
      async function getWeightRecord() {
        const docRef = await query(collection(db, 'users', uid, 'weightRecords'), orderBy('measureDate'));
        onSnapshot(docRef, (item) => {
          const newData = [];
          item.forEach((doc) => {
            newData.push(doc.data());
            setWeightRecord(newData);
          });
          const newWeightNumberData = [];
          item.forEach((doc) => {
            newWeightNumberData.push(doc.data().bodyWeight);
            setWeightNumberLine(newWeightNumberData);
          });
          const newWeightDateData = [];
          item.forEach((doc) => {
            newWeightDateData.push(doc.data().measureDate);
            setWeightDateLine(newWeightDateData);
          });
        });
      }
      getWeightRecord();
    }
  }, [isLoggedIn, showFatRecord, showWeightRecord]);

  //登錄資料
  async function writeBodyWeight(index) {
    if (isLoggedIn) {
      try {
        if (weightDateInput !== undefined && weightNumberInput !== undefined) {
          const docRef = await doc(collection(db, 'users', uid, 'weightRecords'));
          const data = {
            measureDate: weightDateInput,
            bodyWeight: Number(weightNumberInput),
            docID: docRef.id,
          };
          await setDoc(docRef, data);
          setWeightNumberInput('');
          setWeightDateInput('');
        } else {
          alertPop();
          setContent('請填寫完整資料');
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      signIn();
    }
  }

  //刪除個別資料
  async function deleteWeightRecord(id) {
    const newWeightRecord = weightRecord.filter((item, index) => {
      return id != index;
    });
    setWeightRecord(newWeightRecord);
    updateWeightRecord(id);
  }

  //刪除以後更新資料庫
  async function updateWeightRecord(id) {
    const docRef = await doc(db, 'users', uid, 'weightRecords', weightRecord[id].docID);
    await deleteDoc(docRef);
  }

  //＝＝＝＝＝＝＝＝＝＝＝體重歷史資料＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝＝體重chart.js＝＝＝＝＝＝＝＝＝＝＝

  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

  const BodyWeightData = {
    labels: weightDateLine,
    datasets: [
      {
        label: '體重',
        data: weightNumberLine,
        fill: true,
        backgroundColor: 'rgba(238,141,71,0.2)',
        borderColor: 'rgba(238,141,71,1)',
      },
    ],
  };

  // ＝＝＝＝＝＝＝＝＝＝＝體重chart.js＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝＝頁面切換＝＝＝＝＝＝＝＝＝＝＝

  function goBodyFatPage() {
    setShowFatRecord(true);
    setShowWeightRecord(false);
  }

  function goBodyWeightPage() {
    setShowFatRecord(false);
    setShowWeightRecord(true);
  }

  // ＝＝＝＝＝＝＝＝＝＝＝頁面切換＝＝＝＝＝＝＝＝＝＝＝

  return (
    <>
      {' '}
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
            <BannerText>追蹤自己的身體變化！</BannerText>
          </Banner>
        </BannerOutside>
        <ChangeOutside>
          <ChangeMenuZone>
            <GoBodyFatOutide onClick={goBodyFatPage}>
              <GoBodyFat $isActive={showFatRecord}>體脂肪率</GoBodyFat>
            </GoBodyFatOutide>
            <GoBodyWeightOutside onClick={goBodyWeightPage}>
              <GoBodyWeight $isActive={showWeightRecord}>體重</GoBodyWeight>
            </GoBodyWeightOutside>
          </ChangeMenuZone>
          <ChangeToBodyFat $isHide={showFatRecord}>
            <BodyFatZone>
              <BodyFatDataPage
                setFatDateInput={setFatDateInput}
                fatNumberInput={fatNumberInput}
                setFatNumberInput={setFatNumberInput}
                writeBodyFat={writeBodyFat}
                fatRecord={fatRecord}
                fatNumberLine={fatNumberLine}
                deleteFatRecord={deleteFatRecord}
                fatDateInput={fatDateInput}
              />
              <BodyFatLinePageZone>
                <BodyFatLineOutside>
                  {fatRecord.length > 0 ? (
                    <Line data={BodyFatData} options={{ color: 'white' }} />
                  ) : (
                    <Line data={dataNull} options={{ color: 'white' }} />
                  )}
                </BodyFatLineOutside>
              </BodyFatLinePageZone>
            </BodyFatZone>
          </ChangeToBodyFat>
          <ChangeToBodyWeight $isHide={showWeightRecord}>
            <BodyWeightZone>
              <BodyWeightDataPage
                setWeightDateInput={setWeightDateInput}
                setWeightNumberInput={setWeightNumberInput}
                weightNumberInput={weightNumberInput}
                writeBodyWeight={writeBodyWeight}
                weightRecord={weightRecord}
                weightNumberLine={weightNumberLine}
                deleteWeightRecord={deleteWeightRecord}
                weightDateInput={weightDateInput}
              />
              <BodyWeightLinePageZone>
                <BodyWeightLineOutside>
                  {weightRecord.length > 0 ? (
                    <Line data={BodyWeightData} options={{ color: 'white' }} />
                  ) : (
                    <Line data={dataNull} options={{ color: 'white' }} />
                  )}
                </BodyWeightLineOutside>
              </BodyWeightLinePageZone>
            </BodyWeightZone>
          </ChangeToBodyWeight>
        </ChangeOutside>
      </Wrapper>
    </>
  );
};

export default Statistics;

const LoadingOutside = styled.div`
  position: absolute;
  z-index: 2000;
  top: 0%;
  background: rgba(49, 50, 55, 1);
  height: 100vh;
  width: 100vw;
  display: ${(props) => (props.$isActive ? 'block' : 'none')};
`;

const LoadingBlocks = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Wrapper = styled.div`
  margin: 0 auto;
  color: white;
  padding-top: 90px;
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
  background-position: 0% 45%;
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

const ChangeOutside = styled.div`
  max-width: 1200px;
  margin: 0px auto 50px auto;
  @media screen and (max-width: 1279px) {
    padding: 0px 30px;
    max-width: 800px;
  }
`;

const ChangeMenuZone = styled.div`
  display: flex;
  justify-content: start;
  margin-top: 25px;
  @media screen and (max-width: 767px) {
    justify-content: center;
  }
`;

const GoBodyFatOutide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
`;

const GoBodyFat = styled.div`
  cursor: pointer;
  padding: 5px 15px;
  background: #313237;
  border-radius: 7px;
  color: white;
  font-size: 20px;
  letter-spacing: 2px;
  font-weight: 500;
  background: ${(props) => (props.$isActive ? '#74c6cc;' : '#313237;')};
  &:hover {
    background: #74c6cc;
  }
`;

const GoBodyWeightOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
`;

const GoBodyWeight = styled.div`
  cursor: pointer;
  padding: 5px 15px;
  border-radius: 7px;
  color: white;
  font-size: 20px;
  letter-spacing: 2px;
  font-weight: 500;
  background: ${(props) => (props.$isActive ? '#74c6cc;' : '#313237;')};
  &:hover {
    background: #74c6cc;
  }
`;

// ＝＝＝＝＝＝＝＝＝＝＝體脂肪區＝＝＝＝＝＝＝＝＝＝＝

const ChangeToBodyFat = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;

const BodyFatZone = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #313237;
  padding-bottom: 30px;
  margin-top: 20px;
  border-top: 0.5rem solid #74c6cc;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
  }
`;

// ＝＝＝＝＝＝＝＝＝＝＝體脂肪區＝＝＝＝＝＝＝＝＝＝＝

// ＝＝＝＝＝＝＝＝＝＝＝體脂肪折線圖區＝＝＝＝＝＝＝＝＝＝＝

const BodyFatLinePageZone = styled.div``;

const BodyFatLineOutside = styled.div`
  width: 500px;
  margin: 40px auto 0px auto;
  @media screen and (max-width: 1279px) {
    margin: 50px auto;
    margin-right: 55px;
  }
  @media screen and (max-width: 767px) {
    width: 450px;
    margin-right: 10px;
  }
  @media screen and (max-width: 550px) {
    width: 350px;
    margin-right: 10px;
  }
  @media screen and (max-width: 450px) {
    width: 280px;
    margin-right: 10px;
  }
`;

// ＝＝＝＝＝＝＝＝＝＝＝體脂肪折線圖區＝＝＝＝＝＝＝＝＝＝＝

// ＝＝＝＝＝＝＝＝＝＝＝體重區＝＝＝＝＝＝＝＝＝＝＝

const ChangeToBodyWeight = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;

const BodyWeightZone = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #313237;
  padding-bottom: 30px;
  margin-top: 20px;
  border-top: 0.5rem solid #74c6cc;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
  }
`;

// ＝＝＝＝＝＝＝＝＝＝＝體重區＝＝＝＝＝＝＝＝＝＝＝

// ＝＝＝＝＝＝＝＝＝＝＝體重折線圖區＝＝＝＝＝＝＝＝＝＝＝

const BodyWeightLinePageZone = styled.div``;

const BodyWeightLineOutside = styled.div`
  width: 500px;
  margin: 40px auto 0px auto;
  @media screen and (max-width: 1279px) {
    margin: 50px auto;
    margin-right: 55px;
  }
  @media screen and (max-width: 767px) {
    width: 450px;
    margin-right: 10px;
  }
  @media screen and (max-width: 550px) {
    width: 350px;
    margin-right: 10px;
  }
  @media screen and (max-width: 450px) {
    width: 280px;
    margin-right: 10px;
  }
`;

// ＝＝＝＝＝＝＝＝＝＝＝體重折線圖區＝＝＝＝＝＝＝＝＝＝＝
