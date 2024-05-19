import React, { useContext, useEffect, useState, useRef } from "react";
import styled from "styled-components";

import {
  doc,
  setDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  startAfter,
  limit,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../utils/firebase";

import UserContext from "../../contexts/UserContext";
import HistoryZone from "./HistoryZone";
import OpenHistoryZone from "./OpenHistory/OpenHistoryZone";
import FavoritePage from "./Favorite/FavoritePage";
import SkeletonPage from "./SkeletonPage";
import TrainingOne from "./TrainingOne";
import TrainingTwo from "./TrainingTwo";
import DeleteZone from "./DeleteZone";
import TrainingButtonsZone from "./TrainingButtonsZone";

import {
  bodyPartsArray,
  bodyPartsLabel,
  bodyPartsOptionsEnum,
} from "../../constants/app";

import ACTIONS from "../../utils/allActionsLists";

import emailjs from "emailjs-com";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Blocks } from "react-loader-spinner";

import { v4 as uuid } from "uuid";

const Training = () => {
  const { isLoggedIn, uid, signIn, alertPop, setContent } =
    useContext(UserContext);

  const [trainingData, setTrainingData] = useState([]);
  const [pagination, setPagination] = useState([]);
  const [currentPage, setCurrentPgae] = useState(1);

  const [openTrainingInput, setOpenTrainingInput] = useState(false);
  const [openTrainingPage, setOpenTrainingPage] = useState(0);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [part, setPart] = useState("");
  const [promoteActions, setPromoteActions] = useState([]);
  const [choiceAction, setChoiceAction] = useState([]);

  const [showHistory, setShowHistory] = useState(null);
  const [showHistoryToggle, setShowHistoryToggle] = useState(false);
  const [showHistoryActions, setShowHistoryActions] = useState([]);
  const [historyIndex, setHistoryIndex] = useState();

  const [imageUpload, setImageUpload] = useState();
  const [imageList, setImageList] = useState("");
  const [pickHistory, setPickHistory] = useState();

  const [videoUrl, setVideoUrl] = useState(null);
  const [playing, setPlaying] = useState(null);

  const [loading, setLoading] = useState(false);
  const [skeleton, setSkeleton] = useState(false);
  const [uploadSkeleton, setUploadSkeleton] = useState(false);

  const [favoriteTrainings, setFavoriteTrainings] = useState([]);
  const [favoriteChoice, setFavoriteChoice] = useState(null);

  const [openFavorite, setOpenFavorite] = useState(false);
  const [pickActions, setPickActions] = useState([]);
  const [pickFavorite, setPickFavorite] = useState(null);
  const [pickID, setPickID] = useState();

  const [deleteAlert, setDeleteAlert] = useState(false);

  ChartJS.register(ArcElement, Tooltip, Legend);

  const bodyPartsForChart = bodyPartsArray.map((part) => bodyPartsLabel[part]);

  const backgroundColor = [
    "#f1f2f6",
    "#8ecae6",
    "#219ebc",
    "#74c6cc",
    "#ffb703",
    "#fb8500",
  ];
  const borderColor = Array(bodyPartsForChart.length).fill("rgba(0, 0, 0, 1)");

  const bodyPartCounts = {};
  const bodyPartPercents = {};

  bodyPartsForChart.forEach((part) => {
    const count = choiceAction.filter((item) => item.bodyPart === part).length;
    bodyPartCounts[part] = count;
    bodyPartPercents[part] = count / choiceAction.length;
  });

  const data = {
    datasets: [
      {
        data: bodyPartsForChart.map((part) => bodyPartPercents[part]),
        backgroundColor,
        borderColor,
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

  let re = /^[0-9]+.?[0-9]*$/;
  let totalWeight;
  const total = choiceAction.reduce(
    (prev, item) => prev + item.weight * item.times,
    0
  );
  if (!re.test(total)) {
    alertPop();
    setContent("請輸入數字");
  } else {
    totalWeight = Number(total.toFixed(1));
  }

  function addTraining() {
    if (isLoggedIn) {
      setOpenTrainingInput(true);
      setOpenTrainingPage(1);
      setImageList("");
      setShowHistory(null);
    } else {
      signIn();
    }
  }

  function getPageTwo() {
    if (title !== "" && date !== "" && description !== "") {
      setOpenTrainingPage(2);
      setPart(bodyPartsOptionsEnum.SHOULDER);
    } else {
      alertPop();
      setContent("請填寫完整資料");
    }
  }

  function closeAddTraining() {
    setOpenTrainingInput(false);
    setOpenTrainingPage(0);
    setTitle("");
    setDate("");
    setDescription("");
    setChoiceAction([]);
    setPlaying(null);
  }

  function completeTraining() {
    alertPop();
    setContent("恭喜完成本次鍛鍊");
    changeCompleteCondition();
  }

  async function changeCompleteCondition() {
    try {
      const docRef = await doc(db, "users", uid, "trainingTables", pickHistory);
      const data = {
        complete: "已完成",
      };
      await updateDoc(docRef, data);
      const newArr = [...trainingData];
      newArr[historyIndex].complete = "已完成";
      setTrainingData(newArr);
      setShowHistory(newArr[historyIndex]);
    } catch (e) {
      console.log(e);
    }
  }

  async function confirmDeleteTrainingItem() {
    setLoading(true);
    try {
      const docRef = await doc(db, "users", uid, "trainingTables", pickHistory);
      await deleteDoc(docRef);
      setShowHistoryToggle(false);
      setLoading(false);
      alertPop();
      setContent("成功刪除菜單");
      setDeleteAlert(false);
      setCurrentPgae(1);
      setShowHistory(null);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (part === bodyPartsOptionsEnum.BACK) {
      setPromoteActions(ACTIONS.BACK);
    } else if (part === bodyPartsOptionsEnum.ARM) {
      setPromoteActions(ACTIONS.ARM);
    } else if (part === bodyPartsOptionsEnum.CHEST) {
      setPromoteActions(ACTIONS.CHEST);
    } else if (part === bodyPartsOptionsEnum.LEG) {
      setPromoteActions(ACTIONS.LEG);
    } else if (part === bodyPartsOptionsEnum.CORE) {
      setPromoteActions(ACTIONS.CORE);
    } else if (part === bodyPartsOptionsEnum.SHOULDER) {
      setPromoteActions(ACTIONS.SHOULDER);
    } else if (part === bodyPartsOptionsEnum.UPPERBODY) {
      setPromoteActions(ACTIONS.UPPERBODY);
    } else if (part === bodyPartsOptionsEnum.ALL) {
      setPromoteActions(ACTIONS.ALL);
    }
  }, [part]);

  function addActionItem(e) {
    setChoiceAction((pre) => {
      const addAction = { ...promoteActions[e.target.id] };
      pre.forEach((action) => {
        if (action.id === addAction.id) {
          addAction.id = uuid();
        }
      });
      const newArr = [...pre, addAction];
      return newArr;
    });
  }

  function deleteItem(id) {
    const newNextChoiceAction = choiceAction.filter((item, index) => {
      return index !== id;
    });
    setChoiceAction(newNextChoiceAction);
  }

  async function completeTrainingSetting() {
    try {
      if (totalWeight !== 0.0 && choiceAction.length > 0) {
        if (showHistory && showHistory.docID) {
          const docRef = await doc(
            db,
            "users",
            uid,
            "trainingTables",
            showHistory.docID
          );
          const data = {
            docID: docRef.id,
            complete: "未完成",
            picture: imageList,
            title: title,
            description: description,
            totalActions: choiceAction.length,
            totalWeight: totalWeight,
            trainingDate: date,
            setDate: new Date(),
            actions: choiceAction,
          };
          await updateDoc(docRef, data);
          setOpenTrainingPage(0);
          setOpenTrainingInput(false);
          setChoiceAction([]);
          sendEmail();
          alertPop();
          setContent("菜單更新成功");
          setTitle("");
          setDate("");
          setDescription("");
          setPlaying(null);
          setCurrentPgae(1);
        } else {
          const docRef = await doc(
            collection(db, "users", uid, "trainingTables")
          );
          const data = {
            docID: docRef.id,
            complete: "未完成",
            picture: imageList,
            title: title,
            description: description,
            totalActions: choiceAction.length,
            totalWeight: totalWeight,
            trainingDate: date,
            setDate: new Date(),
            actions: choiceAction,
          };
          await setDoc(docRef, data);
          setOpenTrainingPage(0);
          setOpenTrainingInput(false);
          setChoiceAction([]);
          sendEmail();
          alertPop();
          setContent("完成設定並寄信通知");
          setTitle("");
          setDate("");
          setDescription("");
          setPlaying(null);
          setCurrentPgae(1);
        }
      } else if (!choiceAction.length > 0) {
        alertPop();
        setContent("請加入動作");
      } else {
        alertPop();
        setContent("請輸入數字");
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    if (isLoggedIn === false) {
      setTrainingData([]);
    } else {
      async function getTrainingTables() {
        setSkeleton(true);
        if (currentPage === 1) {
          const first = await query(
            collection(db, "users", uid, "trainingTables"),
            orderBy("trainingDate", "desc"),
            limit(8)
          );
          onSnapshot(first, (item) => {
            const newData = [];
            item.forEach((doc) => {
              newData.push(doc.data());
            });
            setTrainingData(newData);
          });
          setTimeout(() => {
            setSkeleton(false);
          }, 1000);
        } else {
          const before = await query(
            collection(db, "users", uid, "trainingTables"),
            orderBy("trainingDate", "desc"),
            limit(8 * currentPage)
          );
          const documentSnapshots = await getDocs(before);
          const lastVisible = await documentSnapshots.docs[
            8 * (currentPage - 1) - 1
          ];
          const next = await query(
            collection(db, "users", uid, "trainingTables"),
            orderBy("trainingDate", "desc"),
            startAfter(lastVisible),
            limit(8)
          );
          onSnapshot(next, (item) => {
            const newData = [];
            item.forEach((doc) => {
              newData.push(doc.data());
            });
            setTrainingData(newData);
          });
          setTimeout(() => {
            setSkeleton(false);
          }, 1000);
        }
      }
      getTrainingTables();
    }
  }, [isLoggedIn, currentPage]);

  useEffect(() => {
    if (isLoggedIn === false) {
      setPagination([]);
    } else {
      async function getTrainingTablesPage() {
        const docRef = collection(db, "users", uid, "trainingTables");
        const querySnapshot = await getDocs(docRef);
        const arr = [];
        for (let i = 1; i <= Math.ceil(querySnapshot.size / 8); i++) {
          arr.push(i);
        }
        setPagination(arr);
      }
      getTrainingTablesPage();
    }
  }, [isLoggedIn, trainingData]);

  function openHistory(index) {
    setShowHistoryToggle(true);
    setLoading(true);
    setHistoryIndex(index);
    setShowHistory(trainingData[index]);
    setShowHistoryActions(trainingData[index].actions);
    setPickHistory(trainingData[index].docID);
    setImageList(trainingData[index].picture);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }

  useEffect(() => {
    if (imageUpload == null) return;
    setUploadSkeleton(true);
    const imageRef = ref(storage, `${uid}/${pickHistory}`);
    uploadBytes(imageRef, imageUpload).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageList(url);
        const docRef = doc(db, "users", uid, "trainingTables", pickHistory);
        const data = {
          picture: url,
        };
        updateDoc(docRef, data);
        alertPop();
        setContent("照片上傳成功");
        setTimeout(() => {
          setUploadSkeleton(false);
        }, 1500);
      });
    });
  }, [imageUpload]);

  const form = useRef();
  const sendEmail = () => {
    emailjs.sendForm(
      "service_aqtfkmw",
      "template_jq89u95",
      form.current,
      "c1RPxdcmtzncbu3Wv"
    );
  };

  async function getFavoriteTrainings() {
    if (isLoggedIn === false) {
      setFavoriteTrainings([]);
    } else {
      const docRef = await query(
        collection(db, "users", uid, "favoriteTrainings"),
        orderBy("setDate")
      );
      onSnapshot(docRef, (item) => {
        const newData = [];
        item.forEach((doc) => {
          newData.push(doc.data());
        });
        setFavoriteTrainings(newData);
      });
    }
  }

  useEffect(() => {
    const showFavoriteTrainings = async () => {
      const docRef = await doc(
        db,
        "users",
        uid,
        "favoriteTrainings",
        favoriteChoice
      );
      const docSnap = await getDoc(docRef);
      setTitle(docSnap.data().title);
      setDescription(docSnap.data().description);
      setChoiceAction(docSnap.data().actions);
      alertPop();
      setContent("成功套用喜愛菜單");
    };
    showFavoriteTrainings();
  }, [favoriteChoice]);

  async function manageFavoriteTraining() {
    if (isLoggedIn) {
      setOpenFavorite(true);
      const docRef = await query(
        collection(db, "users", uid, "favoriteTrainings"),
        orderBy("setDate")
      );
      onSnapshot(docRef, (item) => {
        const newData = [];
        item.forEach((doc) => {
          newData.push(doc.data());
        });
        setFavoriteTrainings(newData);
      });
    } else {
      signIn();
    }
  }

  async function editTraining() {
    setChoiceAction(showHistory.actions);
    setTitle(showHistory.title);
    setDescription(showHistory.description);
    setDate(showHistory.trainingDate);
    setOpenTrainingInput(true);
    setShowHistoryToggle(false);
    setOpenTrainingPage(1);
    setImageList(showHistory.picture);
  }

  return (
    <>
      {loading && (
        <LoadingOutside>
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
      )}
      {deleteAlert && (
        <DeleteZone
          setDeleteAlert={setDeleteAlert}
          confirmDeleteTrainingItem={confirmDeleteTrainingItem}
        />
      )}
      <Wrapper>
        <TrainingZone>
          <TrainingButtonsZone
            addTraining={addTraining}
            getFavoriteTrainings={getFavoriteTrainings}
            manageFavoriteTraining={manageFavoriteTraining}
          />
          <FavoritePage
            openFavorite={openFavorite}
            setOpenFavorite={setOpenFavorite}
            favoriteTrainings={favoriteTrainings}
            setFavoriteTrainings={setFavoriteTrainings}
            pickFavorite={pickFavorite}
            setPickFavorite={setPickFavorite}
            pickActions={pickActions}
            setPickActions={setPickActions}
            pickID={pickID}
            setPickID={setPickID}
          />
          {skeleton && <SkeletonPage />}
          {trainingData.length > 0 ? (
            <>
              {!skeleton && (
                <HistoryZone
                  trainingData={trainingData}
                  openHistory={openHistory}
                />
              )}
            </>
          ) : (
            <NoHistory>尚未建立菜單</NoHistory>
          )}
        </TrainingZone>
        {pagination.length > 0 && (
          <PaginationOutside>
            {pagination.map((item, index) => (
              <PaginationItem
                index={index}
                onClick={() => {
                  setCurrentPgae(index + 1);
                }}
                $isActive={index + 1 === currentPage}
              >
                {item}
              </PaginationItem>
            ))}
          </PaginationOutside>
        )}
        <OpenHistoryZone
          showHistory={showHistory}
          setShowHistory={setShowHistory}
          openHistory={openHistory}
          showHistoryActions={showHistoryActions}
          setShowHistoryActions={setShowHistoryActions}
          showHistoryToggle={showHistoryToggle}
          setShowHistoryToggle={setShowHistoryToggle}
          imageList={imageList}
          setImageList={setImageList}
          imageUpload={imageUpload}
          setImageUpload={setImageUpload}
          completeTraining={completeTraining}
          setDeleteAlert={setDeleteAlert}
          choiceAction={choiceAction}
          data={data}
          editTraining={editTraining}
          uploadSkeleton={uploadSkeleton}
          setUploadSkeleton={setUploadSkeleton}
        />
        {openTrainingInput && (
          <>
            <TrainingOutsideOne $isActive={openTrainingPage === 1}>
              <TrainingOne
                closeAddTraining={closeAddTraining}
                favoriteChoice={favoriteChoice}
                favoriteTrainings={favoriteTrainings}
                setFavoriteChoice={setFavoriteChoice}
                title={title}
                date={date}
                description={description}
                setTitle={setTitle}
                setDate={setDate}
                setDescription={setDescription}
                getPageTwo={getPageTwo}
                ref={form}
              />
            </TrainingOutsideOne>
            {openTrainingPage === 2 && (
              <TrainingOutsideTwo>
                <TrainingTwo
                  closeAddTraining={closeAddTraining}
                  choiceAction={choiceAction}
                  setChoiceAction={setChoiceAction}
                  deleteItem={deleteItem}
                  totalWeight={totalWeight}
                  setPart={setPart}
                  part={part}
                  promoteActions={promoteActions}
                  addActionItem={addActionItem}
                  playing={playing}
                  setPlaying={setPlaying}
                  setVideoUrl={setVideoUrl}
                  videoUrl={videoUrl}
                  data={data}
                  dataNull={dataNull}
                  completeTrainingSetting={completeTrainingSetting}
                  sendEmail={sendEmail}
                  setOpenTrainingPage={setOpenTrainingPage}
                />
              </TrainingOutsideTwo>
            )}{" "}
            <Background />
          </>
        )}
      </Wrapper>{" "}
    </>
  );
};

export default Training;

const PaginationOutside = styled.div`
  display: flex;
  margin: 0 auto;
  color: black;
  font-size: 24px;
  margin-bottom: 80px;
  font-weight: 700;
`;

const PaginationItem = styled.div`
  margin: 0 18px;
  background: ${(props) => (props.$isActive ? "white" : "#74c6cc")};
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 12px;
  &:hover {
    background: white;
  }
`;

const LoadingOutside = styled.div`
  top: 0px;
  position: fixed;
  z-index: 2000;
  background: #475260;
  height: 100%;
  width: 100%;
  display: block;
`;

const LoadingBlocks = styled.div`
  position: fixed;
  z-index: 2000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  font-size: 20px;
  position: relative;
`;

const TrainingZone = styled.div`
  display: flex;
  justify-content: center;
  align-items: start;
  flex-direction: column;
`;

const NoHistory = styled.div`
  max-width: 1200px;
  margin: auto;
  margin-bottom: 30px;
  color: white;
  border: 1px solid #818a8e;
  padding: 50px 150px;
  letter-spacing: 2px;
  @media screen and (max-width: 767px) {
    padding: 50px 50px;
  }
`;

const TrainingOutsideOne = styled.div`
  position: absolute;
  left: calc(50% - 280px);
  top: -22%;
  z-index: 20;
  display: ${(props) => (props.$isActive ? "bloock" : "none")};
  background: #475260;
  max-width: 700px;
  margin-bottom: 100px;
  margin-top: 100px;
  color: white;
  border-top: 0.5rem solid #74c6cc;
  animation-name: favoritefadein;
  animation-duration: 0.5s;
  @keyframes favoritefadein {
    0% {
      transform: translateY(-2%);
      opacity: 0%;
    }
    100% {
      transform: translateY(0%);
      opacity: 100%;
    }
  }
  @media screen and (max-width: 1279px) {
    left: calc(50% - 280px);
    top: -9%;
  }
  @media screen and (max-width: 767px) {
    left: calc(50% - 220px);
    top: -5.5%;
  }
  @media screen and (max-width: 575px) {
    left: calc(50% - 220px);
  }
  @media screen and (max-width: 500px) {
    left: calc(50% - 170px);
  }
`;

const TrainingOutsideTwo = styled(TrainingOutsideOne)`
  left: calc(50% - 500px);
  top: -22%;
  z-index: 20;
  display: block;
  max-width: 1000px;
  @media screen and (max-width: 1279px) {
    left: calc(50% - 350px);
    top: -9%;
  }
  @media screen and (max-width: 767px) {
    left: calc(50% - 275px);
    top: -5.5%;
  }
  @media screen and (max-width: 575px) {
    left: calc(50% - 165px);
  }
  @media screen and (max-width: 500px) {
    left: calc(50% - 165px);
  }
`;

const Background = styled.div`
  background: black;
  top: 0;
  opacity: 50%;
  z-index: 11;
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: block;
`;
