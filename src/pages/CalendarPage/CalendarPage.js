import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';

//日曆
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

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

//components
import UserContext from '../../contexts/UserContext';

function CalendarPage() {
  //UserContext拿資料
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);

  //抓出localstorage資料
  const uid = localStorage.getItem('uid');

  //日曆
  const localizer = momentLocalizer(moment);

  //抓菜單
  const [trainingData, setTrainingData] = useState([]);
  const [trainingItem, setTrainingItem] = useState([]);

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

  // ＝＝＝＝＝＝＝＝＝＝即時抓出每筆菜單資料＝＝＝＝＝＝＝＝＝＝＝

  //從firebase上即時抓資料
  useEffect(() => {
    async function getTrainingTables() {
      const docRef = query(collection(db, 'users', uid, 'trainingTables'), orderBy('trainingDate'));
      onSnapshot(docRef, (item) => {
        const newData = [];
        item.forEach((doc) => {
          newData.push(doc.data());
          setTrainingItem(newData);
        });
      });
    }
    getTrainingTables();
  }, [isLoggedIn, uid]);

  //map成日曆需要的格式
  useEffect(() => {
    if (trainingItem.length > 0) {
      const events = trainingItem.map((item) => {
        return {
          name: `健人行程：${item.title}`,
          description: item.description,
          complete: `狀態：${item.complete}`,
          start: new Date([item.trainingDate, null]),
          end: new Date([item.trainingDate, null]),
        };
      });
      setTrainingData(events);
    }
  }, [trainingItem]);

  const events = trainingData;

  // ＝＝＝＝＝＝＝＝＝＝即時抓出每筆菜單資料＝＝＝＝＝＝＝＝＝＝＝

  const NewHOC = (PassedComponent) => {
    return class extends React.Component {
      render() {
        return (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            showMultiDayTimes
            style={{ minHeight: 580 }}
            components={{
              event: event,
            }}
          />
        );
      }
    };
  };

  const event = ({ event }) => {
    return (
      <div>
        {event.name} <br /> <small>{event.description}</small>
        <br />
        <small>{event.complete}</small>
      </div>
    );
  };

  const NewComponent = NewHOC(event);

  return (
    <Wrapper>
      <NewComponent />
    </Wrapper>
  );
}

export default CalendarPage;

const Wrapper = styled.div`
  padding: 30px;
`;
