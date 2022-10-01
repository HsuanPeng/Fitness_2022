import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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
import detailBanner from '../../images/Blue-gymnast-rings-1044340.jpg';
import armMuscle from '../../images/armMuscle.png';

//FontAwesomeIcon
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faClock, faFire, faDumbbell, faWeightHanging } from '@fortawesome/free-solid-svg-icons';

function CalendarPage() {
  //UserContext拿資料
  const { isLoggedIn, setIsLoggedIn, userSignOut, signInWithGoogle, uid, displayName, email, signIn } =
    useContext(UserContext);

  //日曆
  const localizer = momentLocalizer(moment);

  //抓菜單
  const [trainingData, setTrainingData] = useState([]);
  const [trainingItem, setTrainingItem] = useState([]);

  //點行程抓資料
  const [detail, setDetail] = useState();

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
        });
        setTrainingItem(newData);
      });
    }
    getTrainingTables();
  }, [isLoggedIn, uid]);

  //map成日曆需要的格式
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
      <Events
        onClick={() => {
          setDetail(event);
        }}
      >
        <EventName>{event.title} </EventName>
        <EventDescription>{event.description}</EventDescription>
      </Events>
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
      {detail ? (
        <>
          <DetailOutside>
            <Close
              onClick={() => {
                setDetail(null);
              }}
            >
              <FontAwesomeIcon icon={faCircleXmark} />
            </Close>
            <Top>
              <DetailTitle>
                <TitlePic>
                  <FontAwesomeIcon icon={faFire} />
                </TitlePic>
                {detail.title}
              </DetailTitle>
              <Line />
              <DetailActionsOutside>
                {detail.actions.map((item, index) => (
                  <ActionItem>
                    <ActionBodyPart>
                      <BodyPartPic src={armMuscle} />
                      {item.bodyPart}
                    </ActionBodyPart>
                    <ActionName>
                      <FaDumbbellName>
                        <FontAwesomeIcon icon={faDumbbell} />
                      </FaDumbbellName>
                      {item.actionName}
                    </ActionName>
                    <Weight>
                      <FaDumbbellWeight>
                        <FontAwesomeIcon icon={faWeightHanging} />
                      </FaDumbbellWeight>
                      {item.weight}KG
                    </Weight>
                    <Times>
                      <FaDumbbellTimes>
                        <FontAwesomeIcon icon={faClock} />
                      </FaDumbbellTimes>
                      {item.times}次
                    </Times>
                  </ActionItem>
                ))}
              </DetailActionsOutside>
            </Top>
            <PicOutside>
              <Pic />
            </PicOutside>
          </DetailOutside>{' '}
          <Background $isActive={detail} />
        </>
      ) : null}
      <CalendarOutside>
        <NewComponent />
      </CalendarOutside>
    </Wrapper>
  );
}

export default CalendarPage;

const DetailOutside = styled.div`
  margin: 0 auto;
  position: absolute;
  top: 13%;
  left: calc(50% - 346px);
  z-index: 15;
  background: #475260;
  max-width: 1000px;
  color: white;
  border-top: 0.5rem solid #74c6cc;
  z-index: 20;
  @media screen and (max-width: 767px) {
    max-width: 320px;
    left: calc(50% - 160px);
  }
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

const Top = styled.div`
  padding: 0px 20px;
`;

const TitlePic = styled.div`
  margin-right: 12px;
`;

const DetailTitle = styled.div`
  display: flex;
  margin-top: 45px;
  font-weight: 600;
  letter-spacing: 3px;
  color: #74c6cc;
  font-size: 25px;
`;

const Line = styled.div`
  border-bottom: 2px solid #74c6cc;
  margin-top: 15px;
  margin-bottom: 15px;
`;

const DetailActionsOutside = styled.div`
  font-size: 20px;
`;

const ActionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: black;
  border: 1px solid #818a8e;
  margin: 10px 0px;
  border: 1px solid #818a8e;
  padding: 5px 10px 5px 10px;
  background: rgba(255, 255, 255, 0.5);
  @media screen and (max-width: 1279px) {
    flex-wrap: wrap;
  }
`;

const BodyPartPic = styled.img`
  object: fit;
  width: 25px;
  margin-right: 10px;
  @media screen and (max-width: 767px) {
    width: 25px;
    margin-right: 10px;
  }
`;

const ActionBodyPart = styled.div`
  width: 150px;
  display: flex;
  @media screen and (max-width: 767px) {
    width: 200px;
    margin: 5px 0px;
  }
`;

const FaDumbbellName = styled.div`
  margin-right: 10px;
  color: white;
`;

const ActionName = styled.div`
  width: 250px;
  display: flex;
  @media screen and (max-width: 767px) {
    margin: 5px 0px;
  }
`;

const FaDumbbellWeight = styled.div`
  margin-right: 14px;
  color: white;
`;

const Weight = styled.div`
  width: 150px;
  display: flex;
  @media screen and (max-width: 767px) {
    width: 200px;
    margin: 5px 0px;
  }
`;

const FaDumbbellTimes = styled.div`
  margin-right: 13px;
  color: white;
`;

const Times = styled.div`
  width: 80px;
  display: flex;
  margin: 5px 0px;
`;

const PicOutside = styled.div`
  width: 100%;
  height: 200px;
  margin: 20px 0px 40px 0px;
`;

const Pic = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${detailBanner});
  background-size: cover;
  background-position: 30% 50%;
  background-repeat: no-repeat;
`;

const Background = styled.div`
  background: black;
  top: 0;
  opacity: 50%;
  position: fixed;
  width: 100vw;
  height: 100vh;
  z-index: 10;
  display: ${(props) => (props.$isActive ? 'block;' : 'none;')};
`;

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

const Events = styled.div``;

const EventName = styled.div``;

const EventDescription = styled.div``;
