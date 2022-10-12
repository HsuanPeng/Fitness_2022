import React, { useEffect, useState } from 'react';

import { Outlet } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

import { doc, setDoc } from 'firebase/firestore';
import { GoogleAuthProvider, signOut, onAuthStateChanged, signInWithPopup } from 'firebase/auth';
import { db, auth } from '../src/utils/firebase';

import Header from './components/Header/Header';
import UserContext from './contexts/UserContext';

import signInPic from './images/Beautiful-woman-holding-heavy.jpg';
import remove from './images/remove.png';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  const [uid, setUid] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [email, setEmail] = useState(null);

  const [signInPage, setSignInPage] = useState(false);

  const [alert, setAlert] = useState(false);
  const [content, setContent] = useState('');

  const [currentPage, setCurrentPgae] = useState('');

  const provider = new GoogleAuthProvider();

  function signIn() {
    setSignInPage(true);
  }

  function signInWithGoogle() {
    signInWithPopup(auth, provider)
      .then((result) => {
        if (result.operationType === 'signIn') {
          setIsLoggedIn(true);
          setSignInPage(false);
        }
      })
      .catch((error) => console.log(error));
  }

  function userSignOut() {
    signOut(auth)
      .then(() => {
        setIsLoggedIn(false);
        alertPop();
        setContent('成功登出');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(user);
        setUid(user.uid);
        setDisplayName(user.displayName);
        setEmail(user.email);
        setIsLoggedIn(true);
        alertPop();
        setContent('登入中');
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          uid: user.uid,
        });
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  function alertPop() {
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 4000);
  }

  return (
    <>
      <UserContext.Provider
        value={{
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
          currentPage,
          setCurrentPgae,
        }}
      >
        <GlobalStyle />
        <AlertOutside $alert={alert}>
          <Check>
            <FontAwesomeIcon icon={faBell} />
          </Check>
          <AlertContent>{content}</AlertContent>
          <AlertLine $alert={alert} />
        </AlertOutside>
        {signInPage ? (
          <>
            <SignInMenu>
              <Close
                onClick={() => {
                  setSignInPage(false);
                }}
                src={remove}
              ></Close>
              <Close />
              <SignInPicture />
              <SignInContent>
                <SignInQuestion>
                  準備好開始你的
                  <br />
                  健身記錄了嗎？
                </SignInQuestion>
                <SignInGoogle onClick={signInWithGoogle}>
                  <FaGooglePlus>
                    <FontAwesomeIcon icon={faGooglePlusG} />
                  </FaGooglePlus>
                  <SignInGoogleText>使用google登入</SignInGoogleText>
                </SignInGoogle>
                <SignInTest>
                  <SignInTestText>測試用帳號：seaturtlerace@gmail.com</SignInTestText>
                  <SignInTestPassword>測試用密碼：seaturtle</SignInTestPassword>
                </SignInTest>
              </SignInContent>
            </SignInMenu>
            <SignInMenuBackground />
            <Header />
            <Outlet />
          </>
        ) : (
          <>
            <Header />
            <Outlet />
          </>
        )}
      </UserContext.Provider>
    </>
  );
};

export default App;

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Noto Sans TC', sans-serif;
    background:#191a1e;
    margin: 0; padding: 0;
  }

  a{
    text-decoration:none;
  }

  input{
    outline:none;
    border:none;
  }

  button{
    outline:none;
    border:none;
  }

  textarea{
    &:focus {
    outline: none;
  }
  }

  #root {
    min-height: 100vh;
    position: relative;
  }

  ::placeholder {
    color:#D3D3D3;
    font-family: 'Noto Sans TC', sans-serif;
    letter-spacing:3px;
}
`;

const AlertOutside = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 350px;
  position: fixed;
  height: 60px;
  background: #191a1e;
  top: 150px;
  left: -350px;
  z-index: 1000;
  padding: 40px 10px;
  color: white;
  animation-name: ${(props) => props.$alert && 'alertIn'};
  animation-duration: 4s;
  @keyframes alertIn {
    0% {
      left: -350px;
    }
    15% {
      left: 0px;
    }
    85% {
      left: 0px;
    }
    100% {
      left: -350px;
    }
  }
`;

const AlertContent = styled.div`
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 4px;
`;

const AlertLine = styled.div`
  display: flex;
  justify-content: start;
  align-items: start;
  height: 5px;
  background: #74c6cc;
  position: absolute;
  bottom: 0px;
  left: 0px;
  animation-name: ${(props) => props.$alert && 'lineOut'};
  animation-duration: 4s;
  @keyframes lineOut {
    0% {
      width: 100%;
    }
    100% {
      width: 0%;
    }
  }
`;

const Check = styled.div`
  font-size: 30px;
  margin-right: 14px;
  color: #74c6cc;
`;

const SignInMenu = styled.div`
  margin: 0 auto;
  width: 632px;
  height: 608px;
  background: white;
  z-index: 99;
  position: absolute;
  left: 50%;
  top: 20%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  align-items: center;
  animation-name: signinfadein;
  animation-duration: 0.6s;
  @keyframes signinfadein {
    0% {
      transform: translate(-50%, -6%);
      opacity: 0%;
    }
    100% {
      transform: translate(-50%, 0%);
      opacity: 100%;
    }
  }
  @media screen and (max-width: 1279px) {
    width: 500px;
  }
  @media screen and (max-width: 767px) {
    width: 350px;
    height: 400px;
  }
`;

const Close = styled.img`
  position: absolute;
  width: 30px;
  font-size: 30px;
  top: 15px;
  right: 15px;
  cursor: pointer;
  scale: 1;
  transition: 0.3s;
  &:hover {
    scale: 1.2;
  }
`;

const SignInPicture = styled.div`
  width: 300px;
  height: 608px;
  background-image: url(${signInPic});
  background-size: cover;
  background-position: left 63% top 20%;
  @media screen and (max-width: 1279px) {
    width: 200px;
  }
  @media screen and (max-width: 767px) {
    display: none;
  }
`;

const SignInContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 25px;
  @media screen and (max-width: 1279px) {
    width: 300px;
  }
`;

const SignInQuestion = styled.div`
  font-size: 30px;
  line-height: 1.8;
  @media screen and (max-width: 1279px) {
    font-size: 26px;
    line-height: 1.8;
  }
`;

const FaGooglePlus = styled.div`
  margin-right: 10px;
  font-size: 23px;
  color: white;
`;

const SignInGoogle = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #74c6cc;
  width: 303px;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  padding: 10px;
  border: none;
  &:hover {
    background: #eb4537;
  }
  @media screen and (max-width: 1279px) {
    width: 250px;
  }
`;

const SignInGoogleText = styled.div`
  font-size: 17px;
  color: white;
  letter-spacing: 1.2px;
`;

const SignInTest = styled.div`
  display: flex;
  justify-content: start;
  flex-direction: column;
  width: 303px;
  margin-top: 20px;
  letter-spacing: 1.2px;
`;

const SignInTestText = styled.div`
  font-size: 14px;
  @media screen and (max-width: 1279px) {
    font-size: 12px;
  }
`;

const SignInTestPassword = styled.div`
  margin-top: 15px;
  font-size: 14px;
  @media screen and (max-width: 1279px) {
    font-size: 12px;
  }
`;

const SignInMenuBackground = styled.div`
  background: black;
  opacity: 50%;
  z-index: 98;
  position: fixed;
  width: 100vw;
  height: 100vh;
`;
