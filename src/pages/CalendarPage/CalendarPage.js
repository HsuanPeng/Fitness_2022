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

//pic
import trainingBanner from '../../images/Strong-man-doing-bench-press-in-gym-400451.jpg';

function CalendarPage() {
  //UserContext拿資料
  const { isLoggedIn, setIsLoggedIn, userSignOut, signInWithGoogle, uid, displayName, email, signIn } =
    useContext(UserContext);

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
            // startAccessor="start"
            // endAccessor="end"
            // showMultiDayTimes
            style={{ minHeight: 580, background: 'white', borderRadius: '12px', padding: '20px' }}
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
      <BannerOutside>
        <Banner>
          <BannerText>讓健身成為生活的一部分！</BannerText>
        </Banner>
      </BannerOutside>
      <CalendarOutside>
        <NewComponent />
      </CalendarOutside>
    </Wrapper>
  );
}

export default CalendarPage;

const Wrapper = styled.div``;

const BannerOutside = styled.div`
  height: 320px;
  margin-top: 90px;
  @media screen and (max-width: 1279px) {
    height: 200px;
  }
`;

const Banner = styled.div`
  background-image: url(${trainingBanner});
  background-size: cover;
  background-position: 0% 50%;
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

const CalendarOutside = styled.div`
  padding: 80px 150px 150px 150px;
  @media screen and (max-width: 1279px) {
    padding: 80px 80px 80px 80px;
  }
`;
