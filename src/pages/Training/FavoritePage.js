import React, { useContext, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';

//components
import UserContext from '../../contexts/UserContext';

//beautiful-dnd
import { Draggable, DragDropContext, Droppable } from 'react-beautiful-dnd';

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
  getDoc,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

//FontAwesomeIcon
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleXmark,
  faTrash,
  faDumbbell,
  faPenToSquare,
  faXmark,
  faHeartCirclePlus,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import {} from '@fortawesome/free-brands-svg-icons';

//pic
import favoriteBanner from '../../images/Kettlebell-weights-724190.jpg';
import armMuscle from '../../images/armMuscle.png';

const FavoritePage = (props) => {
  //UserContext拿資料
  const {
    isLoggedIn,
    setIsLoggedIn,
    userSignOut,
    signInWithGoogle,
    uid,
    displayName,
    email,
    signIn,
    alertPop,
    setContent,
  } = useContext(UserContext);

  //編輯名稱
  const [pickName, setPickName] = useState(null);
  const [newName, setNewName] = useState('');

  //刪除功能
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [deleteItem, setDeleteItem] = useState();

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
  const storage = getStorage(app);

  // ＝＝＝＝＝＝＝＝＝＝＝啟動firebase＝＝＝＝＝＝＝＝＝＝＝

  //點選主題
  function changePick(index) {
    props.setPickFavorite(index);
    props.setPickActions(props.favoriteTrainings[index].actions);
    props.setPickID(props.favoriteTrainings[index].docID);
  }

  //刪除該主題通知跳出
  async function deletePick(index) {
    setDeleteAlert(true);
    setDeleteItem(index);
  }

  //刪除該主題
  async function confirmDeletePick(index) {
    try {
      const docRef = await doc(db, 'users', uid, 'favoriteTrainings', props.favoriteTrainings[index].docID);
      await deleteDoc(docRef);
      alertPop();
      setContent('成功刪除喜愛菜單');
      props.setPickFavorite(null);
      setDeleteAlert(false);
    } catch (e) {
      console.log(e);
    }
  }

  //Dnd改變順序
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(props.pickActions);
    const [reorderData] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderData);
    props.setPickActions(items);
    alertPop();
    setContent('順序修改完成');
    const updateActions = async () => {
      const docRef = await doc(db, 'users', uid, 'favoriteTrainings', props.pickID);
      const data = {
        actions: items,
      };
      await updateDoc(docRef, data);
    };
    updateActions();
  };

  //改變名字
  function changeName(index) {
    setPickName(index);
    setNewName(props.favoriteTrainings[index].title);
  }

  //送出新名字
  async function updateNewName(index) {
    const docRef = await doc(db, 'users', uid, 'favoriteTrainings', props.pickID);
    const data = {
      title: newName,
    };
    await updateDoc(docRef, data);
    setNewName('');
    setPickName(null);
    alertPop();
    setContent('主題修改成功');
  }

  return (
    <>
      {deleteAlert && (
        <>
          <DeleteAlertOutside>
            <DeleteContent>
              <DeletePic>
                <FontAwesomeIcon icon={faTriangleExclamation} />
              </DeletePic>
              確定執行刪除？
            </DeleteContent>
            <DeleteButton>
              <YesOutside
                onClick={() => {
                  confirmDeletePick(deleteItem);
                }}
              >
                <Yes>YES</Yes>
              </YesOutside>
              <NoOutside
                onClick={() => {
                  setDeleteAlert(false);
                }}
              >
                <No>NO</No>
              </NoOutside>
            </DeleteButton>
          </DeleteAlertOutside>
          <DeleteBackground />
        </>
      )}
      <Wrapper $isActive={props.openFavorite}>
        <Close
          onClick={() => {
            props.setOpenFavorite(false);
            props.setPickFavorite(null);
            props.setPickActions([]);
            setPickName(null);
          }}
        >
          <FontAwesomeIcon icon={faCircleXmark} />
        </Close>
        <Top>
          <Title>
            <FaHeartCirclePlus>
              <FontAwesomeIcon icon={faHeartCirclePlus} />
            </FaHeartCirclePlus>
            喜愛菜單
          </Title>
          <Line />
        </Top>
        <Bottom>
          {props.favoriteTrainings.length > 0 ? (
            <>
              <NameZone>
                <Name> 主題</Name>
                <NameContent>
                  {props.favoriteTrainings.map((item, index) => (
                    <NameContentListOustide
                      index={index}
                      onClick={() => {
                        changePick(index);
                      }}
                      $isActive={index == props.pickFavorite}
                    >
                      <NameTitle>
                        <FaXmark
                          index={index}
                          $isClick={index == pickName}
                          onClick={() => {
                            setPickName(null);
                            setNewName('');
                          }}
                        >
                          <FontAwesomeIcon icon={faXmark} style={{ pointerEvents: 'none' }} />
                        </FaXmark>
                        <FaPenToSquare
                          index={index}
                          $isClick={index !== pickName}
                          onClick={() => {
                            changeName(index);
                          }}
                        >
                          <FontAwesomeIcon icon={faPenToSquare} style={{ pointerEvents: 'none' }} />
                        </FaPenToSquare>
                        <NameOld $isClick={index !== pickName}> {item.title}</NameOld>
                        <NameNew
                          index={index}
                          $isClick={index == pickName}
                          onChange={(e) => setNewName(e.target.value)}
                          defaultValue={item.title}
                          maxLength={10}
                        />
                        <UpdateName
                          index={index}
                          $isClick={index == pickName}
                          onClick={() => {
                            updateNewName(index);
                          }}
                        >
                          送出
                        </UpdateName>
                      </NameTitle>
                      <NameDelete
                        onClick={() => {
                          deletePick(index);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} style={{ pointerEvents: 'none' }} />
                      </NameDelete>
                    </NameContentListOustide>
                  ))}
                  <NameRemind>＊修改最多輸入10字</NameRemind>
                </NameContent>
              </NameZone>
              <ActionZone>
                <Action>動作</Action>
                <ActionContent>
                  {props.pickActions.length > 0 ? (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="list">
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps}>
                            {props.pickActions.map((item, index) => (
                              <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                                {(provided, snapshot) => (
                                  <ActionContentListOustide
                                    index={index}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                    style={{
                                      ...provided.draggableProps.style,
                                      border: snapshot.isDragging ? '2px solid #74c6cc' : 'none',
                                      borderStyle: snapshot.isDragging ? 'outset' : 'none',
                                      background: snapshot.isDragging ? '#74c6cc' : 'rgba(255, 255, 255, 0.5)',
                                    }}
                                  >
                                    <ActionPart>
                                      <BodyPartPic src={armMuscle} />
                                      {item.bodyPart}
                                    </ActionPart>
                                    <ActionName>
                                      <FaDumbbellName>
                                        <FontAwesomeIcon icon={faDumbbell} />
                                      </FaDumbbellName>
                                      {item.actionName}
                                    </ActionName>
                                  </ActionContentListOustide>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  ) : (
                    <>
                      <NoAction>
                        請點選查看主題
                        <br />
                        並上下拖曳改變順序
                      </NoAction>
                    </>
                  )}
                </ActionContent>
              </ActionZone>
            </>
          ) : (
            <NoFavorite>尚未建立喜愛菜單</NoFavorite>
          )}
        </Bottom>
        <PicOutside>
          <Pic />
        </PicOutside>
      </Wrapper>
      <Background $isActive={props.openFavorite} />
    </>
  );
};

const DeleteAlertOutside = styled.div`
  display: flex;
  padding: 15px;
  width: 400px;
  background: #475260;
  border: 5px solid #74c6cc;
  border-radius: 20px;
  position: absolute;
  top: calc(20% - 85px);
  left: calc(50% - 200px);
  z-index: 100;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const DeletePic = styled.div`
  color: #ffd700;
  font-size: 40px;
  margin-right: 20px;
`;

const DeleteContent = styled.div`
  display: flex;
  align-items: center;
  color: white;
  font-size: 30px;
  margin-top: 10px;
  letter-spacing: 6px;
`;
const DeleteButton = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-top: 15px;
  margin-bottom: 10px;
`;

const YesOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #74c6cc;
  width: 50px;
  color: black;
  cursor: pointer;
  border-radius: 10px;
  margin-right: 30px;
  &:hover {
    background: red;
    color: black;
  }
`;

const Yes = styled.div`
  padding: 3px;
  font-size: 20px;
  letter-spacing: 2px;
  font-weight: 600;
`;

const NoOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #74c6cc;
  width: 50px;
  color: black;
  cursor: pointer;
  border-radius: 10px;
  &:hover {
    background: white;
    color: black;
  }
  @media screen and (max-width: 767px) {
    width: 120px;
    margin: 40px 20px 40px 0px;
  }
`;

const No = styled.div`
  padding: 3px;
  font-size: 20px;
  letter-spacing: 2px;
  font-weight: 600;
`;

const DeleteBackground = styled.div`
  background: black;
  top: 0;
  opacity: 50%;
  z-index: 60;
  position: fixed;
  width: 100vw;
  height: 100vh;
`;

const Wrapper = styled.div`
  display: ${(props) => (props.$isActive ? 'block;' : 'none;')};
  max-width: 1200px;
  margin: 0 auto;
  position: absolute;
  top: 15%;
  left: calc(50% - 390px);
  z-index: 15;
  background: #475260;
  max-width: 1000px;
  color: white;
  border-top: 0.5rem solid #74c6cc;
  @media screen and (max-width: 1279px) {
    top: 10%;
  }
  @media screen and (max-width: 767px) {
    top: 5.5%;
    left: calc(50% - 212.5px);
  }
  @media screen and (max-width: 500px) {
    width: 300px;
    left: calc(50% - 150px);
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
  padding: 0px 30px;
  @media screen and (max-width: 500px) {
    padding: 0px 10px;
  }
`;

const FaHeartCirclePlus = styled.div`
  margin-right: 12px;
`;

const Title = styled.div`
  display: flex;
  margin-top: 25px;
  font-weight: 600;
  letter-spacing: 3px;
  color: #74c6cc;
  font-size: 25px;
`;

const Line = styled.div`
  border-bottom: 2px solid #74c6cc;
  margin-top: 15px;
  margin-bottom: 10px;
  @media screen and (max-width: 767px) {
    border-bottom: 1px solid #74c6cc;
    margin-top: 8px;
  }
`;

const Bottom = styled.div`
  padding-top: 10px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 15px;
  display: flex;
  @media screen and (max-width: 767px) {
    flex-direction: column;
  }
  @media screen and (max-width: 500px) {
    padding-top: 10px;
    padding-left: 10px;
    padding-right: 10px;
    padding-bottom: 15px;
  }
`;

const NameZone = styled.div`
  margin-right: 40px;
  width: 100%;
`;

const Name = styled.div`
  font-size: 25px;
  letter-spacing: 12px;
`;

const NameContent = styled.div`
  height: 327px;
  overflow-y: scroll;
  padding-right: 15px;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
  &::-webkit-scrollbar-track-piece {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.4);
    border: 1px solid slategrey;
  }
  &::-webkit-scrollbar-track {
    box-shadow: transparent;
  }
  @media screen and (max-width: 767px) {
    margin-bottom: 50px;
  }
`;

const NameRemind = styled.div`
  color: #cd5c5c;
  font-size: 16px;
  letter-spacing: 2px;
  margin-top: -6px;
`;

const NameContentListOustide = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 300px;
  margin: 15px 0px;
  cursor: pointer;
  color: black;
  background: ${(props) => (props.$isActive ? 'rgb(116, 198, 204)' : 'rgba(255, 255, 255, 0.5)')};
  padding: 5px 15px 5px 15px;
  &:hover {
    background: #74c6cc;
  }
  @media screen and (max-width: 767px) {
    width: 100%;
  }
`;

const NameTitle = styled.div`
  display: flex;
`;

const FaPenToSquare = styled.div`
  display: ${(props) => (props.$isClick ? 'block' : 'none')};
  margin-right: 15px;
  &:hover {
    color: white;
  }
`;

const FaXmark = styled.div`
  display: ${(props) => (props.$isClick ? 'block' : 'none')};
  margin-right: 15px;
  &:hover {
    color: white;
  }
`;

const NameOld = styled.div`
  display: ${(props) => (props.$isClick ? 'block' : 'none')};
`;

const NameNew = styled.input`
  display: ${(props) => (props.$isClick ? 'block' : 'none')};
  width: 80px;
  font-size: 20px;
`;

const UpdateName = styled.div`
  display: ${(props) => (props.$isClick ? 'block' : 'none')};
  margin-left: 15px;
  border-radius: 12px;
  background: white;
  padding: 0px 5px;
  &:hover {
    color: white;
    background: black;
  }
`;

const NameDelete = styled.div`
  cursor: pointer;
  &:hover {
    color: red;
  }
`;

const ActionZone = styled.div``;

const BodyPartPic = styled.img`
  object: fit;
  width: 25px;
  margin-right: 10px;
  @media screen and (max-width: 767px) {
    width: 25px;
    margin-right: 10px;
  }
`;

const ActionContent = styled.div`
  height: 327px;
  width: 365px;
  overflow-y: scroll;
  padding-right: 15px;
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-button {
    display: none;
  }
  &::-webkit-scrollbar-track-piece {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.4);
    border: 1px solid slategrey;
  }
  &::-webkit-scrollbar-track {
    box-shadow: transparent;
  }
  @media screen and (max-width: 500px) {
    width: 280px;
    padding-right: 0px;
  }
`;

const ActionContentListOustide = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  margin: 15px 0px;
  cursor: pointer;
  color: black;
  background: rgba(255, 255, 255, 0.5);
  padding: 5px 15px 5px 15px;
  @media screen and (max-width: 500px) {
    flex-direction: column;
    align-items: start;
    width: 95%;
  }
`;

const Action = styled.div`
  font-size: 25px;
  letter-spacing: 12px;
`;

const ActionPart = styled.div`
  width: 100px;
`;

const FaDumbbellName = styled.div`
  color: white;
  margin-right: 10px;
`;

const ActionName = styled.div`
  display: flex;
`;

const NoAction = styled.div`
  text-align: center;
  line-height: 35px;
  width: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 280px;
  border: 1px solid #818a8e;
  margin-top: 12px;
  @media screen and (max-width: 500px) {
    width: 240px;
  }
`;

const NoFavorite = styled.div`
  width: 720px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 280px;
  border: 1px solid #818a8e;
  margin-top: 12px;
  @media screen and (max-width: 767px) {
    width: 365px;
  }
  @media screen and (max-width: 500px) {
    width: 280px;
  }
`;

const Background = styled.div`
  background: black;
  top: 0;
  z-index: 14;
  opacity: 50%;
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: ${(props) => (props.$isActive ? 'block;' : 'none;')};
`;

const PicOutside = styled.div`
  width: 100%;
  height: 200px;
  margin: 20px 0px 40px 0px;
`;

const Pic = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${favoriteBanner});
  background-size: cover;
  background-position: 30% 75%;
  background-repeat: no-repeat;
`;

export default FavoritePage;
