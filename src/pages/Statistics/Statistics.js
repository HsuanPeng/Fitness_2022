import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import UserContext from '../../contexts/UserContext';
import BodyFatPage from './BodyFatPage';
import BodyWeightPage from './BodyWeightPage';

import { doc, setDoc, collection, onSnapshot, query, orderBy, deleteDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';

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

import trainingBanner from '../../images/Athlete-preparing-for-training.jpg';

const Statistics = () => {
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
  ChartJS.defaults.font.size = 20;
  ChartJS.defaults.color = 'white';

  const { isLoggedIn, uid, signIn, alertPop, setContent } = useContext(UserContext);

  const [showFatRecord, setShowFatRecord] = useState(true);

  const [fatRecord, setFatRecord] = useState([]);
  const [fatDateInput, setFatDateInput] = useState();
  const [fatNumberInput, setFatNumberInput] = useState();

  const [fatDateLine, setFatDateLine] = useState([]);
  const [fatNumberLine, setFatNumberLine] = useState([]);

  const [weightRecord, setWeightRecord] = useState([]);
  const [weightDateInput, setWeightDateInput] = useState();
  const [weightNumberInput, setWeightNumberInput] = useState();

  const [weightDateLine, setWeightDateLine] = useState([]);
  const [weightNumberLine, setWeightNumberLine] = useState([]);

  const lineData = {
    labels: showFatRecord ? fatDateLine : weightDateLine,
    datasets: [
      {
        label: showFatRecord ? '體脂肪率' : '體重',
        data: showFatRecord ? fatNumberLine : weightNumberLine,
        fill: true,
        backgroundColor: showFatRecord ? 'rgba(238,141,71,0.2)' : 'rgba(255,183,3,0.2)',
        borderColor: showFatRecord ? 'rgba(238,141,71,1)' : 'rgba(255,183,3,1)',
        borderWidth: '5',
      },
    ],
  };

  const dataOptions = {
    scales: {
      y: {
        ticks: {
          padding: 15,
          color: 'white',
        },
      },
      x: {
        ticks: { padding: 15, color: 'white' },
      },
    },
  };

  const dataNull = {
    labels: null,
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

  useEffect(() => {
    if (isLoggedIn === false) {
      setFatRecord([]);
    } else {
      async function getFatRecord() {
        const docRef = await query(collection(db, 'users', uid, 'fatRecords'), orderBy('measureDate'));
        onSnapshot(docRef, (item) => {
          const newData = [];
          item.forEach((doc) => {
            newData.push(doc.data());
          });
          setFatRecord(newData);
          const newFatNumberData = [];
          item.forEach((doc) => {
            newFatNumberData.push(doc.data().bodyFat);
          });
          setFatNumberLine(newFatNumberData);
          const newFatDateData = [];
          item.forEach((doc) => {
            newFatDateData.push(doc.data().measureDate);
          });
          setFatDateLine(newFatDateData);
        });
      }
      getFatRecord();
    }
  }, [isLoggedIn, showFatRecord, uid]);

  async function writeBodyFat(index) {
    if (isLoggedIn) {
      try {
        let re = /^[0-9]+.?[0-9]*$/;
        if (!re.test(fatNumberInput)) {
          alertPop();
          setContent('請輸入數字');
        } else if (fatNumberInput > 99 || fatNumberInput === 0) {
          alertPop();
          setContent('數據不實');
        } else {
          if (fatDateInput !== undefined && fatNumberInput !== undefined && fatDateInput !== '') {
            setFatNumberInput('');
            setFatDateInput('');
            const docRef = await doc(collection(db, 'users', uid, 'fatRecords'));
            const data = {
              measureDate: fatDateInput,
              bodyFat: Number(fatNumberInput).toFixed(1),
              docID: docRef.id,
            };
            await setDoc(docRef, data);
          } else {
            alertPop();
            setContent('請填寫完整資料');
          }
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      signIn();
    }
  }

  async function deleteFatRecord(id) {
    const newFatRecord = fatRecord.filter((item, index) => {
      return id !== index;
    });
    setFatRecord(newFatRecord);
    const docRef = await doc(db, 'users', uid, 'fatRecords', fatRecord[id].docID);
    deleteDoc(docRef);
  }

  useEffect(() => {
    if (isLoggedIn === false) {
      setWeightRecord([]);
    } else {
      async function getWeightRecord() {
        const docRef = await query(collection(db, 'users', uid, 'weightRecords'), orderBy('measureDate'));
        onSnapshot(docRef, (item) => {
          const newData = [];
          item.forEach((doc) => {
            newData.push(doc.data());
          });
          setWeightRecord(newData);
          const newWeightNumberData = [];
          item.forEach((doc) => {
            newWeightNumberData.push(doc.data().bodyWeight);
          });
          setWeightNumberLine(newWeightNumberData);
          const newWeightDateData = [];
          item.forEach((doc) => {
            newWeightDateData.push(doc.data().measureDate);
          });
          setWeightDateLine(newWeightDateData);
        });
      }
      getWeightRecord();
    }
  }, [isLoggedIn, showFatRecord, uid]);

  async function writeBodyWeight(index) {
    if (isLoggedIn) {
      try {
        let re = /^[0-9]+.?[0-9]*$/;
        if (!re.test(weightNumberInput)) {
          alertPop();
          setContent('請填寫數字');
        } else if (weightNumberInput > 999 || weightNumberInput === 0) {
          alertPop();
          setContent('數據不實');
        } else {
          if (weightDateInput !== undefined && weightNumberInput !== undefined && weightDateInput !== '') {
            setWeightNumberInput('');
            setWeightDateInput('');
            const docRef = await doc(collection(db, 'users', uid, 'weightRecords'));
            const data = {
              measureDate: weightDateInput,
              bodyWeight: Number(weightNumberInput).toFixed(1),
              docID: docRef.id,
            };
            await setDoc(docRef, data);
          } else {
            alertPop();
            setContent('請填寫完整資料');
          }
        }
      } catch (e) {
        console.log(e);
      }
    } else {
      signIn();
    }
  }

  async function deleteWeightRecord(id) {
    const newWeightRecord = weightRecord.filter((item, index) => {
      return id !== index;
    });
    setWeightRecord(newWeightRecord);
    const docRef = await doc(db, 'users', uid, 'weightRecords', weightRecord[id].docID);
    deleteDoc(docRef);
  }

  return (
    <>
      <Wrapper>
        <BannerOutside>
          <Banner>
            <BannerText>追蹤自己的身體變化！</BannerText>
          </Banner>
        </BannerOutside>
        <ChangeOutside>
          <ChangeMenuZone>
            <GoBodyFatOutide
              onClick={() => {
                setShowFatRecord(true);
              }}
            >
              <GoBodyFat $showFatRecord={showFatRecord}>體脂肪率</GoBodyFat>
            </GoBodyFatOutide>
            <GoBodyWeightOutside
              onClick={() => {
                setShowFatRecord(false);
              }}
            >
              <GoBodyWeight $showFatRecord={showFatRecord}>體重</GoBodyWeight>
            </GoBodyWeightOutside>
          </ChangeMenuZone>
          {showFatRecord ? (
            <BodyFatZone>
              <BodyFatPage
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
                    <Line data={lineData} options={dataOptions} />
                  ) : (
                    <Line data={dataNull} options={{ color: 'white' }} />
                  )}
                </BodyFatLineOutside>
              </BodyFatLinePageZone>
            </BodyFatZone>
          ) : (
            <BodyWeightZone>
              <BodyWeightPage
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
                    <Line data={lineData} options={dataOptions} />
                  ) : (
                    <Line data={dataNull} options={{ color: 'white' }} />
                  )}
                </BodyWeightLineOutside>
              </BodyWeightLinePageZone>
            </BodyWeightZone>
          )}
        </ChangeOutside>
      </Wrapper>
    </>
  );
};

export default Statistics;

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
  max-width: 1300px;
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
  border-radius: 7px;
  color: black;
  font-size: 24px;
  letter-spacing: 2px;
  font-weight: 600;
  background: ${(props) => (props.$showFatRecord ? '#74c6cc' : '#475260')};
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
  color: black;
  font-size: 24px;
  letter-spacing: 2px;
  font-weight: 600;
  background: ${(props) => (props.$showFatRecord ? '#475260' : '#74c6cc')};
  &:hover {
    background: #74c6cc;
  }
`;

const BodyFatZone = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #475260;
  padding-bottom: 30px;
  margin-top: 20px;
  border-top: 0.5rem solid #74c6cc;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
  }
`;

const BodyFatLinePageZone = styled.div``;

const BodyFatLineOutside = styled.div`
  width: 600px;
  margin: 40px auto 0px auto;
  pointer-events: none;
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

const BodyWeightZone = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #475260;
  padding-bottom: 30px;
  margin-top: 20px;
  border-top: 0.5rem solid #74c6cc;
  @media screen and (max-width: 1279px) {
    flex-direction: column;
  }
`;

const BodyWeightLinePageZone = styled.div``;

const BodyWeightLineOutside = styled.div`
  width: 600px;
  margin: 40px auto 0px auto;
  pointer-events: none;
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
