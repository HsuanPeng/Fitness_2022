import React from 'react';

//Route
import { Outlet } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

//components
import Header from './components/Header/Header';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Noto Sans TC', sans-serif;
  }

  a{
    text-decoration:none;
  }

`;

const App = () => {
  return (
    <>
      <GlobalStyle />
      <Header />
      <Outlet />
    </>
  );
};

export default App;
