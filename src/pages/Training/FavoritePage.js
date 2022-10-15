import React, { useContext, useState } from 'react';
import styled from 'styled-components';

import UserContext from '../../contexts/UserContext';
import FavoriteNameZone from './FavoriteNameZone';
import FavoriteActionZone from './FavoriteActionZone';

import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faHeartCirclePlus, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

import favoriteBanner from '../../images/Kettlebell-weights.jpg';

const FavoritePage = (props) => {
  const { uid, alertPop, setContent } = useContext(UserContext);

  const [pickName, setPickName] = useState(null);
  const [newName, setNewName] = useState('');

  const [deleteAlert, setDeleteAlert] = useState(false);
  const [deleteItem, setDeleteItem] = useState();

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

  function changeName(index) {
    setPickName(index);
    setNewName(props.favoriteTrainings[index].title);
  }

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
      {props.openFavorite && (
        <>
          <Wrapper>
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
                  <FavoriteNameZone
                    pickName={pickName}
                    setPickName={setPickName}
                    changeName={changeName}
                    setNewName={setNewName}
                    updateNewName={updateNewName}
                    setDeleteAlert={setDeleteAlert}
                    setDeleteItem={setDeleteItem}
                    favoriteTrainings={props.favoriteTrainings}
                    pickFavorite={props.pickFavorite}
                    setPickFavorite={props.setPickFavorite}
                    setPickActions={props.setPickActions}
                    setPickID={props.setPickID}
                  />
                  <FavoriteActionZone onDragEnd={onDragEnd} pickActions={props.pickActions} />
                </>
              ) : (
                <NoFavorite>尚未建立喜愛菜單</NoFavorite>
              )}
            </Bottom>
            <PicOutside>
              <Pic />
            </PicOutside>
          </Wrapper>
          <Background />
        </>
      )}
    </>
  );
};

export default FavoritePage;

const DeleteAlertOutside = styled.div`
  display: flex;
  padding: 15px;
  width: 400px;
  background: #475260;
  border: 5px solid #74c6cc;
  border-radius: 20px;
  position: absolute;
  top: 8%;
  left: calc(50% - 200px);
  z-index: 98;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  animation-name: deletefadein;
  animation-duration: 0.8s;
  @keyframes deletefadein {
    0% {
      transform: translateY(-10%);
      opacity: 0%;
    }
    100% {
      transform: translateY(0%);
      opacity: 100%;
    }
  }
  @media screen and (max-width: 1279px) {
    top: 8%;
  }
  @media screen and (max-width: 767px) {
    padding: 10px;
    width: 300px;
    left: calc(50% - 150px);
    top: 6%;
  }
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
  @media screen and (max-width: 767px) {
    margin-top: 0px;
    font-size: 25px;
    letter-spacing: 4px;
  }
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

const NoOutside = styled(YesOutside)`
  margin-right: 0px;
  &:hover {
    background: white;
  }
`;

const No = styled(Yes)``;

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
  display: block;
  margin: 0 auto;
  position: absolute;
  top: -14%;
  left: calc(50% - 390px);
  z-index: 15;
  background: #475260;
  max-width: 1000px;
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
    top: -4%;
  }
  @media screen and (max-width: 767px) {
    top: -3%;
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
  margin-bottom: 15px;
  &:hover {
    scale: 1.2;
  }
`;

const Top = styled.div`
  padding: 0px 30px;
  margin-top: 40px;
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
  display: block;
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
