import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../utils/firebase';

import UserContext from '../../contexts/UserContext';
import CalendarDetail from './CalendarDetail';

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
      {detail && <CalendarDetail detail={detail} setDetail={setDetail} />}
      <CalendarOutside>
        <NewComponent />
      </CalendarOutside>
    </>
  );
}

export default CalendarPage;

const CalendarOutside = styled.div`
  padding: 80px 150px 150px 150px;
  @media screen and (max-width: 1279px) {
    padding: 80px 80px 80px 80px;
  }
`;
