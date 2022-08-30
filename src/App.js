import React from 'react';
import styled from 'styled-components';

//components
import PiePage from './PiePage';
import LinePage from './LinePage';

//firebase
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  serverTimestamp,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

const PieOutside = styled.div`
  padding-top: 100px;
  width: 500px;
  height: 500px;
  margin: 0 auto;
`;

const LineOutside = styled.div`
  padding-top: 100px;
  width: 500px;
  margin: 0 auto;
`;

const App = () => {
  const firebaseConfig = {
    apiKey: 'AIzaSyA9Klg9ZWvbfrBEoraVnkpp38pzf7X3PCo',
    authDomain: 'fitness-e8fc0.firebaseapp.com',
    projectId: 'fitness-e8fc0',
    storageBucket: 'fitness-e8fc0.appspot.com',
    messagingSenderId: '678915191894',
    appId: '1:678915191894:web:4db4938ac6d42615a777f7',
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // const firestore = getFirestore(app);
  const db = getFirestore(app);
  //即時抓到資料夾名稱
  const post = doc(collection(db, 'posts'));

  return (
    <div>
      <PieOutside>
        <PiePage />
      </PieOutside>
      <LineOutside>
        <LinePage />
      </LineOutside>
    </div>
  );
};

export default App;
