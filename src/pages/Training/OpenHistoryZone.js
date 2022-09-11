import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

//calendar
import { useScript } from '../../Hooks/useScript';

//components
import UserContext from '../../contexts/UserContext';

//chart.js
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

const OpenHistoryZone = (props) => {
  //UserContext拿資料
  const { isLoggedIn, setIsLoggedIn } = useContext(UserContext);

  //點擊過完成鍛鍊後，該按鈕消失
  const [showCompleteTrainingButton, setShowCompleteTrainingButton] = useState(true);

  //從useScript拿
  const API = useScript('https://apis.google.com/js/api.js');
  const Accounts = useScript('https://accounts.google.com/gsi/client');

  //身體部位佔比
  const [shoulderPercent, setShoulderPercent] = useState(0);
  const [armPercent, setArmPercent] = useState(0);
  const [chestPercent, setChestPercent] = useState(0);
  const [backPercent, setBackPercent] = useState(0);
  const [buttLegPercent, setButtLegPercent] = useState(0);
  const [corePercent, setCorePercent] = useState(0);

  // ＝＝＝＝＝＝＝＝＝＝＝chart.js＝＝＝＝＝＝＝＝＝＝＝

  ChartJS.register(ArcElement, Tooltip, Legend);

  const data = {
    datasets: [
      {
        label: '# of Votes',
        data: [shoulderPercent, armPercent, chestPercent, backPercent, buttLegPercent, corePercent],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
    labels: ['肩', '手臂', '胸', '背', '臀腿', '核心'],
  };

  const dataNull = {
    datasets: [
      {
        label: '# of Votes',
        data: [0, 0, 0, 0, 0, 0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
    labels: ['肩', '手臂', '胸', '背', '臀腿', '核心'],
  };

  useEffect(() => {
    const shoulderNumber = props.showHistoryActions.filter((item) => item.bodyPart == '肩').length;
    const armNumber = props.showHistoryActions.filter((item) => item.bodyPart == '手臂').length;
    const chestNumber = props.showHistoryActions.filter((item) => item.bodyPart == '胸').length;
    const backNumber = props.showHistoryActions.filter((item) => item.bodyPart == '背').length;
    const buttLegNumber = props.showHistoryActions.filter((item) => item.bodyPart == '臀腿').length;
    const coreNumber = props.showHistoryActions.filter((item) => item.bodyPart == '核心').length;
    setShoulderPercent(shoulderNumber / props.showHistoryActions.length);
    setArmPercent(armNumber / props.showHistoryActions.length);
    setChestPercent(chestNumber / props.showHistoryActions.length);
    setBackPercent(backNumber / props.showHistoryActions.length);
    setButtLegPercent(buttLegNumber / props.showHistoryActions.length);
    setCorePercent(coreNumber / props.showHistoryActions.length);
  });

  // ＝＝＝＝＝＝＝＝＝＝＝chart.js＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝＝Google日曆＝＝＝＝＝＝＝＝＝＝＝

  //讓script onload
  useEffect(() => {
    if (API === 'ready') {
      gapiLoaded();
    }
  }, [props.openHistory]);

  useEffect(() => {
    if (Accounts === 'ready') {
      gisLoaded();
    }
  }, [props.openHistory]);

  const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
  const SCOPES = 'https://www.googleapis.com/auth/calendar';

  let tokenClient;
  let gapiInited = false;
  let gisInited = false;

  async function gapiLoaded() {
    await window.gapi.load('client', intializeGapiClient);
  }

  async function intializeGapiClient() {
    await window.gapi.client.init({
      apiKey: process.env.REACT_APP_API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
  }

  async function gisLoaded() {
    tokenClient = await window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.REACT_APP_CLIENT_ID,
      scope: SCOPES,
      callback: '', // defined later
    });
    gisInited = true;
  }

  function handleAuthClick() {
    tokenClient.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      await listUpcomingEvents();
    };

    if (window.gapi.client.getToken() === null) {
      tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  }

  async function listUpcomingEvents() {
    let response;
    try {
      const request = {
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: 'startTime',
      };
      response = await window.gapi.client.calendar.events.list(request);
    } catch (err) {
      document.getElementById('content').innerText = err.message;
      return;
    }
    insertEvent();
  }

  //加入事件
  async function insertEvent() {
    var event = {
      summary: `健人行程：${props.showHistory.title}`,
      description: `${props.showHistory.description}`,
      start: {
        date: `${props.showHistory.trainingDate}`,
      },
      end: {
        date: `${props.showHistory.trainingDate}`,
      },
    };

    var request = window.gapi.client.calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    request.execute(function (event) {});
    alert('已加入google日曆！');
  }

  // ＝＝＝＝＝＝＝＝＝＝＝Google日曆＝＝＝＝＝＝＝＝＝＝＝

  return (
    <OpenHistory $isHide={props.showHistoryToggle}>
      <Close onClick={props.closeHistory}>X</Close>
      <HistoryTop>
        <div>主題：{props.showHistory.title}</div>
        <div>訓練日期：{props.showHistory.trainingDate}</div>
        <div>本次訓練重點：{props.showHistory.description}</div>
        <div>總重量：{props.showHistory.totalWeight} KG</div>
        <div>總動作數：{props.showHistory.totalActions} 個</div>
        <div>狀態：{props.showHistory.complete}</div>
      </HistoryTop>
      {props.showHistoryActions.map((item) => {
        return (
          <HistoryActions key={uuidv4()}>
            <div>部位：{item.bodyPart}</div>
            <div>動作：{item.actionName}</div>
            <div>重量：{item.weight} KG</div>
            <div>次數：{item.times} 次</div>
          </HistoryActions>
        );
      })}
      <PieOutside>{props.showHistoryActions.length > 0 ? <Pie data={data} /> : <Pie data={dataNull} />}</PieOutside>
      {props.imageList ? <HistoryImage src={props.imageList} /> : <HistoryImageAlert>趕快上傳照片吧</HistoryImageAlert>}
      <AddPhoto>
        <input
          type="file"
          onChange={(event) => {
            props.setImageUpload(event.target.files[0]);
          }}
        />
        <button
          onClick={(e) => {
            props.uploadImage(e);
          }}
        >
          上傳照片
        </button>
      </AddPhoto>
      {props.showHistory.complete === '已完成' ? null : (
        <CompleteTraining onClick={props.completeTraining} $isHide={props.showCompleteTrainingButton}>
          完成本鍛鍊
        </CompleteTraining>
      )}
      <DeleteTrainingItem onClick={props.deleteTrainingItem}>刪除本菜單</DeleteTrainingItem>
      <button id="authorize_button" onClick={handleAuthClick}>
        將行程加入google日曆
      </button>
    </OpenHistory>
  );
};

export default OpenHistoryZone;

const Close = styled.div``;

const OpenHistory = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
  margin: 0 auto;
  background: #dcdcdc;
  margin-bottom: 20px;
  width: 800px;
  padding: 10px;
`;

const HistoryActions = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HistoryTop = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HistoryImage = styled.img`
  width: 200px;
  height: auto;
`;

const HistoryImageAlert = styled.div``;

const AddPhoto = styled.button``;

const CompleteTraining = styled.button``;

const DeleteTrainingItem = styled.div`
  cursor: pointer;
`;

const PieOutside = styled.div`
  max-width: 350px;
  padding: 10px;
  margin: 0 auto;
`;
