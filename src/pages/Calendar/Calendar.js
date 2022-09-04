import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Calendar = () => {
  //抓出localstorage資料
  const uid = localStorage.getItem('uid');
  const accessToken = localStorage.getItem('accessToken');
  const email = localStorage.getItem('email');
  const name = localStorage.getItem('name');
  console.log(accessToken);

  return <div>日曆頁</div>;
};

export default Calendar;
