import React, { useContext, useEffect, useState, useRef } from "react";
import styled from "styled-components";

import { useScript } from "../../../Hooks/useScript";
import UserContext from "../../../contexts/UserContext";
import OpenHistoryZoneTop from "./OpenHistoryTop";
import OpenHistoryZoneBottom from "./OpenHistoryBottom";
import OpenHistoryActions from "./OpenHistoryActions";
import OpenHistoryMiddle from "./OpenHistoryMiddle";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../../utils/firebase";

import { bodyPartsArray, bodyPartsLabel } from "../../../constants/app";

const OpenHistoryZone = (props) => {
  const { uid, alertPop, setContent } = useContext(UserContext);

  const API = useScript("https://apis.google.com/js/api.js");
  const Accounts = useScript("https://accounts.google.com/gsi/client");

  const [alreadyLoad, setAlreadyLoad] = useState(false);

  ChartJS.register(ArcElement, Tooltip, Legend);

  const bodyPartsForChart = bodyPartsArray.map((part) => bodyPartsLabel[part]);

  const bodyPartCounts = {};
  const bodyPartPercents = {};

  bodyPartsForChart.forEach((part) => {
    const count = props.showHistoryActions.filter(
      (item) => item.bodyPart === part
    ).length;
    bodyPartCounts[part] = count;
    bodyPartPercents[part] = count / props.showHistoryActions.length;
  });

  const data = {
    datasets: [
      {
        data: bodyPartsForChart,
        backgroundColor: [
          "#f1f2f6",
          "#8ecae6",
          "#219ebc",
          "#74c6cc",
          "#ffb703",
          "#fb8500",
        ],
        borderColor: [
          "rgba(0, 0, 0, 1)",
          "rgba(0, 0, 0, 1)",
          "rgba(0, 0, 0, 1)",
          "rgba(0, 0, 0, 1)",
          "rgba(0, 0, 0, 1)",
          "rgba(0, 0, 0, 1)",
        ],
        borderWidth: 0,
      },
    ],
    labels: bodyPartsForChart,
  };

  const dataNull = {
    datasets: [
      {
        data: [1],
        backgroundColor: ["grey"],
        borderColor: ["rgba(0, 0, 0, 1)"],
        borderWidth: 0,
      },
    ],
    labels: ["無資料"],
  };

  useEffect(() => {
    if (API === "ready" && alreadyLoad === false) {
      gapiLoaded();
      setAlreadyLoad(true);
    }
  }, [props.openHistory]);

  useEffect(() => {
    if (Accounts === "ready" && alreadyLoad === false) {
      gisLoaded();
      setAlreadyLoad(true);
    }
  }, [props.openHistory]);

  const DISCOVERY_DOC =
    "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
  const SCOPES = "https://www.googleapis.com/auth/calendar";

  let tokenClient = useRef();
  let gapiInited = false;
  let gisInited = false;

  async function gapiLoaded() {
    await window.gapi.load("client", intializeGapiClient);
  }

  async function intializeGapiClient() {
    await window.gapi.client.init({
      apiKey: process.env.REACT_APP_API_KEY,
      discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
  }

  async function gisLoaded() {
    tokenClient.current = await window.google.accounts.oauth2.initTokenClient({
      client_id: process.env.REACT_APP_CLIENT_ID,
      scope: SCOPES,
      callback: "",
    });
    gisInited = true;
  }

  async function handleAuthClick() {
    tokenClient.current.callback = async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }
      await listUpcomingEvents();
    };
    if (window.gapi.client.getToken() === null) {
      tokenClient.current.requestAccessToken({ prompt: "consent" });
    } else {
      tokenClient.current.requestAccessToken({ prompt: "" });
    }
  }

  async function listUpcomingEvents() {
    let response;
    try {
      const request = {
        calendarId: "primary",
        timeMin: new window.Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      };
      response = await window.gapi.client.calendar.events.list(request);
    } catch (err) {
      console.log(err);
      return;
    }
    insertEvent();
  }

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
      calendarId: "primary",
      resource: event,
    });
    request.execute(function (event) {});
    alertPop();
    setContent("成功加入google日曆");
  }

  async function addFavoriteTraining() {
    try {
      const query = await getDocs(
        collection(db, "users", uid, "favoriteTrainings")
      );
      query.forEach((doc) => {
        if (doc.data().title === props.showHistory.title) {
          alertPop();
          setContent("您已加入過本菜單");
        }
      });
      const docRef = doc(collection(db, "users", uid, "favoriteTrainings"));
      const data = {
        docID: docRef.id,
        complete: "未完成",
        picture: "",
        title: props.showHistory.title,
        description: props.showHistory.description,
        totalActions: props.showHistoryActions.length,
        totalWeight: props.showHistory.totalWeight,
        trainingDate: props.showHistory.trainingDate,
        setDate: new window.Date(),
        actions: props.showHistoryActions,
      };
      setDoc(docRef, data);
      alertPop();
      setContent("成功加入喜愛菜單");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <>
      <OpenHistory $isActive={props.showHistoryToggle}>
        <Close
          onClick={() => {
            props.setShowHistoryToggle(false);
          }}
        >
          <FontAwesomeIcon icon={faCircleXmark} />
        </Close>
        {props.showHistory && (
          <>
            <OpenHistoryZoneTop
              handleAuthClick={handleAuthClick}
              addFavoriteTraining={addFavoriteTraining}
              showHistory={props.showHistory}
            />
            <OpenHistoryActions showHistoryActions={props.showHistoryActions} />
            <OpenHistoryMiddle
              data={data}
              dataNull={dataNull}
              showHistoryActions={props.showHistoryActions}
              setImageUpload={props.setImageUpload}
              imageList={props.imageList}
              uploadSkeleton={props.uploadSkeleton}
            />
            <OpenHistoryZoneBottom
              showHistory={props.showHistory}
              editTraining={props.editTraining}
              completeTraining={props.completeTraining}
              setDeleteAlert={props.setDeleteAlert}
            />
          </>
        )}
      </OpenHistory>
      <Background $isActive={props.showHistoryToggle} />
    </>
  );
};

export default OpenHistoryZone;

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

const OpenHistory = styled.div`
  position: absolute;
  top: -13%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 15;
  display: ${(props) => (props.$isActive ? "block" : "none")};
  background: #475260;
  max-width: 1000px;
  padding-top: 10px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 15px;
  margin-bottom: 40px;
  color: white;
  border-top: 0.5rem solid #74c6cc;
  @media screen and (max-width: 1279px) {
    top: -5%;
    max-width: 700px;
  }
  @media screen and (max-width: 767px) {
    top: -3.2%;
    max-width: 320px;
    padding-left: 15px;
    padding-right: 15px;
  }
`;

const Background = styled.div`
  background: black;
  top: 0;
  opacity: 50%;
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: ${(props) => (props.$isActive ? "block" : "none")};
`;
