import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

//Route
import { Outlet } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

//firebase
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection } from 'firebase/firestore';

//components
import Header from './components/Header/Header';
import UserContext from './contexts/UserContext';

const App = () => {
  //判斷有無登入
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(window.localStorage.getItem('accessToken')));

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

  //登入後菜單刷新
  const navigate = useNavigate();

  //強迫登入
  if (!localStorage.getItem('uid') || localStorage.getItem('uid') == '') {
    signInWithGoogle();
  }

  //登入彈跳視窗
  function signInWithGoogle() {
    signInWithPopup(auth, provider)
      .then((result) => {
        localStorage.setItem('name', result.user.displayName);
        localStorage.setItem('email', result.user.email);
        localStorage.setItem('uid', result.user.uid);
        localStorage.setItem('accessToken', result.user.accessToken);
        setIsLoggedIn(true);
        checkFirstSignIn();
        // navigate('/training', { replace: false });
      })
      .catch((error) => console.log(error));
  }

  //按下登出按鈕，自動彈跳登入視窗
  function userSignOut() {
    setIsLoggedIn(false);
    signOut(auth)
      .then(() => {
        localStorage.setItem('name', '');
        localStorage.setItem('email', '');
        localStorage.setItem('uid', '');
        localStorage.setItem('accessToken', '');
        // navigate('/training', { replace: false });
      })
      .catch((error) => {
        console.log('An error happened');
      });
    signInWithGoogle();
  }

  //如果是全新使用者
  async function checkFirstSignIn() {
    const uid = localStorage.getItem('uid');
    const docRef = await doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      //如果直接建立subcollection會變成斜體，並不真實存在（雖然在firebase上看得到），所以要先建立第一層
      const docRef = doc(db, 'users', uid);
      const data = {
        animalSize: null,
        animalDate: null,
      };
      await setDoc(docRef, data);
      //再建立第二層
      const docRefSub = doc(collection(db, 'users', uid, 'trainingTables'));
      const dataSub = {
        docID: docRefSub.id,
        complete: '未完成',
        picture: '',
        title: '範例檔案',
        totalActions: Number(0),
        totalWeight: Number(0),
        trainingDate: '2022-09-07',
        setDate: new Date(),
        actions: [{ actionName: '動作名稱', bodyPart: '動作部位', times: Number(0), videoURL: '', weight: Number(0) }],
      };
      await setDoc(docRefSub, dataSub);
    }
  }

  // ＝＝＝＝＝＝＝＝＝＝登入系統＝＝＝＝＝＝＝＝＝＝＝

  return (
    <>
      <UserContext.Provider value={{ isLoggedIn, setIsLoggedIn, userSignOut }}>
        <GlobalStyle />
        <Header />
        <Outlet />
      </UserContext.Provider>
    </>
  );
};

export default App;

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    outline:solid 1px black;
  }

  body {
    font-family: 'Noto Sans TC', sans-serif;
  }

  a{
    text-decoration:none;
  }
`;
