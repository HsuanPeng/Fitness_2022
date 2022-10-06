import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../utils/firebase';

import UserContext from '../../contexts/UserContext';
import CalendarDetail from './CalendarDetail';

import trainingBanner from '../../images/Strong-man-doing-bench-press-in-gym.jpg';

function CalendarPage() {
  const { isLoggedIn, uid } = useContext(UserContext);

  const localizer = momentLocalizer(moment);

  const [trainingData, setTrainingData] = useState([]);
  const [trainingItem, setTrainingItem] = useState([]);

  const [detail, setDetail] = useState();

  useEffect(() => {
    async function getTrainingTables() {
      const docRef = query(collection(db, 'users', uid, 'trainingTables'), orderBy('trainingDate'));
      onSnapshot(docRef, (item) => {
        const newData = [];
        item.forEach((doc) => {
          newData.push(doc.data());
        });
        setTrainingItem(newData);
      });
    }
    getTrainingTables();
  }, [isLoggedIn, uid]);

  useEffect(() => {
    if (trainingItem.length > 0) {
      const events = trainingItem.map((item, index) => {
        return {
          docID: item.docID,
          index: index,
          actions: item.actions,
          title: `健人行程：${item.title}`,
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

  const NewHOC = (PassedComponent) => {
    return class extends React.Component {
      render() {
        return (
          <Calendar
            localizer={localizer}
            events={events}
            style={{ minHeight: 900, background: '#F5F5F5', borderRadius: '12px', padding: '20px' }}
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
      <div
        onClick={() => {
          setDetail(event);
        }}
      >
        <div>{event.title} </div>
        <div>{event.description}</div>
      </div>
    );
  };

  const NewComponent = NewHOC(event);

  return (
    <>
      <BannerOutside>
        <Banner>
          <BannerText>讓健身成為生活的一部分！</BannerText>
        </Banner>
      </BannerOutside>
      {detail && <CalendarDetail detail={detail} setDetail={setDetail} />}
      <CalendarOutside>
        <NewComponent />
      </CalendarOutside>
    </>
  );
}

export default CalendarPage;

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
