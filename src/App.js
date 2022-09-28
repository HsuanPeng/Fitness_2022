import React, { useEffect, useState } from 'react';

//Route
import { Outlet } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

//firebase
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithRedirect,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

//components
import Header from './components/Header/Header';
import UserContext from './contexts/UserContext';

//pic
import signInPic from './images/Beautiful-woman-holding-heavy-603695.jpg';
import remove from './images/remove.png';

//FontAwesomeIcon
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons';

//loading animation
import { Blocks } from 'react-loader-spinner';

const App = () => {
  //判斷有無登入
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  //存登入資料
  const [uid, setUid] = useState(null);
  const [displayName, setDisplayName] = useState(null);
  const [email, setEmail] = useState(null);

  //登入畫面
  const [signInPage, setSignInPage] = useState(false);

  //可愛通知
  const [alert, setAlert] = useState(false);
  const [content, setContent] = useState('');

  //loading動畫
  const [loading, setLoading] = useState(false);

  //控制header分頁變色
  const [currentPage, setCurrentPgae] = useState();

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
  const auth = getAuth(app);

  // ＝＝＝＝＝＝＝＝＝＝＝啟動firebase＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝登入系統＝＝＝＝＝＝＝＝＝＝＝

  const provider = new GoogleAuthProvider();

  function signIn() {
    setSignInPage(true);
  }

  //登入google視窗
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

  // 登出
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

  //判斷有無登入或登出
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        setDisplayName(user.displayName);
        setEmail(user.email);
        setIsLoggedIn(true);
        alertPop();
        setContent('登入中');
      } else {
        setIsLoggedIn(false);
      }
    });
  }, []);

  // ＝＝＝＝＝＝＝＝＝＝登入系統＝＝＝＝＝＝＝＝＝＝＝

  // ＝＝＝＝＝＝＝＝＝＝＝跳通知功能＝＝＝＝＝＝＝＝＝＝＝

  function alertPop() {
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 4000);
  }

  // ＝＝＝＝＝＝＝＝＝＝＝跳通知功能＝＝＝＝＝＝＝＝＝＝＝

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
        <LoadingOutside $isActive={loading}>
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
        <AlertOutside $alert={alert}>
          <Check>
            <FontAwesomeIcon icon={faBell} />
          </Check>
          <AlertContent>{content}</AlertContent>
          <AlertLine $alert={alert} />
        </AlertOutside>
        {signInPage ? (
          <>
            <SignInOutside>
              <SignInMenu>
                <Close
                  onClick={() => {
                    setSignInPage(false);
                  }}
                  src={remove}
                ></Close>
                <Close />
                <SignInPicture signInPic={signInPic} />
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
            </SignInOutside>
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
    color:#DCDCDC;
    font-family: 'Noto Sans TC', sans-serif;
}
`;

const LoadingOutside = styled.div`
  position: fixed;
  z-index: 2000;
  background: #475260;
  height: 100%;
  width: 100%;
  display: ${(props) => (props.$isActive ? 'block' : 'none')};
`;

const LoadingBlocks = styled.div`
  position: fixed;
  z-index: 2000;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  animation-name: ${(props) => (props.$alert ? 'alertIn' : null)};
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
  animation-name: ${(props) => (props.$alert ? 'lineOut' : null)};
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

const SignInOutside = styled.div``;

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

const SignInPicture = styled.img`
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
