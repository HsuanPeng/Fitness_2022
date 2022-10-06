import React from 'react';
import styled from 'styled-components';

import SkeletonItemList from './SkeletonItemList';

const SkeletonPage = () => {
  return (
    <SkeletonOutside>
      <SkeletonItemList />
      <SkeletonItemList />
      <SkeletonItemList />
      <SkeletonItemList />
      <SkeletonItemList />
      <SkeletonItemList />
      <SkeletonItemList />
      <SkeletonItemList />
    </SkeletonOutside>
  );
};

export default SkeletonPage;

const SkeletonOutside = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  @media screen and (max-width: 1279px) {
    max-width: 800px;
  }
  @media screen and (max-width: 767px) {
    max-width: 350px;
  }
`;
