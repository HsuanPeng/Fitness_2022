import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

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

const Statistics = () => {
  //UserContext拿資料
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);

  //抓出localstorage資料
  const uid = localStorage.getItem('uid');

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
    async function getFatRecord() {
      const docRef = await query(collection(db, 'users', uid, 'fatRecords'), orderBy('measureDate'));
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
    }
    getFatRecord();
  }, [isLoggedIn, uid]);

  //登錄資料
  async function writeBodyFat(index) {
    try {
      if (fatDateInput !== undefined && fatNumberInput !== undefined) {
        const docRef = await doc(collection(db, 'users', uid, 'fatRecords'));
        const data = {
          measureDate: fatDateInput,
          bodyFat: Number(fatNumberInput),
          docID: docRef.id,
        };
        await setDoc(docRef, data);
      } else {
        alert('請填寫完整資料');
      }
    } catch (e) {
      console.log(e);
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
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  // ＝＝＝＝＝＝＝＝＝＝＝體脂chart.js＝＝＝＝＝＝＝＝＝＝＝

  //＝＝＝＝＝＝＝＝＝＝＝體重歷史資料＝＝＝＝＝＝＝＝＝＝＝

  //即時map出歷史資料
  useEffect(() => {
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
  }, [isLoggedIn, uid]);

  //登錄資料
  async function writeBodyWeight(index) {
    try {
      if (weightDateInput !== undefined && weightNumberInput !== undefined) {
        const docRef = await doc(collection(db, 'users', uid, 'weightRecords'));
        const data = {
          measureDate: weightDateInput,
          bodyWeight: Number(weightNumberInput),
          docID: docRef.id,
        };
        await setDoc(docRef, data);
      } else {
        alert('請填寫完整資料');
      }
    } catch (e) {
      console.log(e);
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

  if (!fatRecord) {
    return null;
  }

  return (
    <Wrapper>
      <ChangeMenuZone>
        <GoBodyFat onClick={goBodyFatPage}>體脂肪率</GoBodyFat>
        <GoBodyWeight onClick={goBodyWeightPage}>體重</GoBodyWeight>
      </ChangeMenuZone>
      <ChangeToBodyFat $isHide={showFatRecord}>
        <BodyFatDataPage
          setFatDateInput={setFatDateInput}
          setFatNumberInput={setFatNumberInput}
          writeBodyFat={writeBodyFat}
          fatRecord={fatRecord}
          fatNumberLine={fatNumberLine}
          deleteFatRecord={deleteFatRecord}
        />
        <BodyFatLinePageZone>
          <BodyFatLinePageTitle>變化趨勢</BodyFatLinePageTitle>
          <BodyFatLineOutside>
            <Line data={BodyFatData} />
          </BodyFatLineOutside>
        </BodyFatLinePageZone>
      </ChangeToBodyFat>
      <ChangeToBodyWeight $isHide={showWeightRecord}>
        <BodyWeightDataPage
          setWeightDateInput={setWeightDateInput}
          setWeightNumberInput={setWeightNumberInput}
          writeBodyWeight={writeBodyWeight}
          weightRecord={weightRecord}
          weightNumberLine={weightNumberLine}
          deleteWeightRecord={deleteWeightRecord}
        />
        <BodyWeightLinePageZone>
          <BodyWeightLinePageTitle>變化趨勢</BodyWeightLinePageTitle>
          <BodyWeightLineOutside>
            <Line data={BodyWeightData} />
          </BodyWeightLineOutside>
        </BodyWeightLinePageZone>
      </ChangeToBodyWeight>
    </Wrapper>
  );
};

export default Statistics;

const Wrapper = styled.div`
  display: flex;
  margin: 0 auto;
  max-width: 1400px;
  justify-content: space-evenly;
`;

const ChangeMenuZone = styled.div``;

const GoBodyFat = styled.div`
  cursor: pointer;
`;

const GoBodyWeight = styled.div`
  cursor: pointer;
`;

// ＝＝＝＝＝＝＝＝＝＝＝體脂肪區＝＝＝＝＝＝＝＝＝＝＝

const ChangeToBodyFat = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;

// ＝＝＝＝＝＝＝＝＝＝＝體脂肪區＝＝＝＝＝＝＝＝＝＝＝

// ＝＝＝＝＝＝＝＝＝＝＝體脂肪折線圖區＝＝＝＝＝＝＝＝＝＝＝

const BodyFatLinePageZone = styled.div``;

const BodyFatLinePageTitle = styled.div``;

const BodyFatLineOutside = styled.div`
  padding-top: 100px;
  width: 500px;
  margin: 0 auto;
`;

// ＝＝＝＝＝＝＝＝＝＝＝體脂肪折線圖區＝＝＝＝＝＝＝＝＝＝＝

// ＝＝＝＝＝＝＝＝＝＝＝體重區＝＝＝＝＝＝＝＝＝＝＝

const ChangeToBodyWeight = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;

// ＝＝＝＝＝＝＝＝＝＝＝體重區＝＝＝＝＝＝＝＝＝＝＝

// ＝＝＝＝＝＝＝＝＝＝＝體重折線圖區＝＝＝＝＝＝＝＝＝＝＝

const BodyWeightLinePageZone = styled.div``;

const BodyWeightLinePageTitle = styled.div``;

const BodyWeightLineOutside = styled.div`
  padding-top: 100px;
  width: 500px;
  margin: 0 auto;
`;

// ＝＝＝＝＝＝＝＝＝＝＝體重折線圖區＝＝＝＝＝＝＝＝＝＝＝
