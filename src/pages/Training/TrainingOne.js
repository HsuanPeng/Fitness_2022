import React, { useContext, forwardRef, useState } from 'react';
import styled from 'styled-components';

import pageOnePic from '../../images/Empty-gym-in-sunlight.jpg';
import UserContext from '../../contexts/UserContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleArrowRight,
  faCircleXmark,
  faCalendarDays,
  faHandPointUp,
  faDumbbell,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';

const TrainingOne = forwardRef((props, ref) => {
  const { displayName, email } = useContext(UserContext);

  const [isOpen, setIsOpen] = useState(false);
  const [favoriteChoiceTitle, setFavoriteChoiceTitle] = useState(null);

  const toggling = () => setIsOpen(!isOpen);

  const onOptionClicked = (value) => () => {
    props.setFavoriteChoice(value.docID);
    setFavoriteChoiceTitle(value.title);
    setIsOpen(false);
  };

  return (
    <>
      <PageOneDetail>
        <Close onClick={props.closeAddTraining}>
          <FontAwesomeIcon icon={faCircleXmark} />
        </Close>
        <form ref={ref}>
          <PageOneDetailContent>
            <TitleInputText>
              <FavoriteTitle>
                <Title>
                  <FaDumbbell>
                    <FontAwesomeIcon icon={faDumbbell} />
                  </FaDumbbell>
                  主題
                </Title>
                <DropDownContainer>
                  {props.favoriteTrainings.length > 0 ? (
                    <>
                      <DropDownHeader onClick={toggling}>
                        {favoriteChoiceTitle || '套用喜愛菜單'}
                        <FontAwesomeIcon icon={faChevronDown} style={{ pointerEvents: 'none' }} />
                      </DropDownHeader>
                      {isOpen && (
                        <DropDownListContainer>
                          <DropDownList>
                            {props.favoriteTrainings.map((option) => (
                              <ListItem onClick={onOptionClicked(option)}>{option.title}</ListItem>
                            ))}
                          </DropDownList>
                        </DropDownListContainer>
                      )}
                    </>
                  ) : (
                    <DropDownHeader onClick={toggling}>
                      無喜愛菜單
                      <FontAwesomeIcon icon={faChevronDown} style={{ pointerEvents: 'none' }} />
                    </DropDownHeader>
                  )}
                </DropDownContainer>
              </FavoriteTitle>
              <TitleInputLine />
              <TitleInput
                onChange={(e) => props.setTitle(e.target.value)}
                name="to_title"
                value={props.title}
                maxLength={10}
              ></TitleInput>
            </TitleInputText>
            <TitleRemind>＊最多輸入10字</TitleRemind>
            <DateInputText>
              <DateInputTop>
                <FaCalendarDays>
                  <FontAwesomeIcon icon={faCalendarDays} />
                </FaCalendarDays>
                日期
              </DateInputTop>
              <DateInputLine />
              <DateInput
                type="date"
                onChange={(e) => props.setDate(e.target.value)}
                name="to_date"
                value={props.date}
              ></DateInput>
            </DateInputText>
            <DescriptionText>
              <DescriptionTop>
                <FaHandPointUp>
                  <FontAwesomeIcon icon={faHandPointUp} />
                </FaHandPointUp>
                本次訓練重點
              </DescriptionTop>
              <DescriptionLine />
              <DescriptionInput
                name="to_description"
                onChange={(e) => props.setDescription(e.target.value)}
                value={props.description}
                maxLength={30}
              ></DescriptionInput>
            </DescriptionText>
            <DescriptionRemind>＊最多輸入30字</DescriptionRemind>
            <ToName name="to_name" defaultValue={displayName}></ToName>
            <ToEmail name="to_email" defaultValue={email}></ToEmail>
          </PageOneDetailContent>
        </form>
      </PageOneDetail>
      <PageOnePicOutside>
        <PageOnePic />
      </PageOnePicOutside>
      <TurnOutside>
        <TurnRight onClick={props.getPageTwo}>
          <FontAwesomeIcon icon={faCircleArrowRight} />
        </TurnRight>
      </TurnOutside>
    </>
  );
});

export default TrainingOne;

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

const PageOneDetail = styled.div`
  display: flex;
  flex-direction: column;
  padding: 30px;
  color: #74c6cc;
  font-size: 24px;
  @media screen and (max-width: 767px) {
    padding: 20px;
  }
`;

const PageOneDetailContent = styled.div``;

const Title = styled.div`
  font-weight: 600;
  letter-spacing: 3px;
  margin-right: 20px;
  display: flex;
  @media screen and (max-width: 767px) {
    font-size: 20px;
  }
`;

const DropDownContainer = styled('div')`
  width: 160px;
  letter-spacing: 1px;
  font-size: 18px;
`;

const DropDownHeader = styled('div')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 10px;
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);
  font-weight: 500;
  color: gray;
  background: #ffffff;
  cursor: pointer;
`;

const DropDownListContainer = styled('div')``;

const DropDownList = styled('ul')`
  width: 160px;
  padding: 0;
  margin: 0;
  background: #ffffff;
  box-sizing: border-box;
  color: gray;
  position: absolute;
  font-weight: 500;
  &:first-child {
    padding-top: 0.2em;
  }
`;

const ListItem = styled('li')`
  list-style: none;
  cursor: pointer;
  padding: 0px 10px;
  &:hover {
    background: #74c6cc;
  }
`;

const TitleRemind = styled.div`
  color: #cd5c5c;
  font-size: 16px;
  letter-spacing: 2px;
  margin-top: 4px;
`;

const FaDumbbell = styled.div`
  margin-right: 10px;
`;

const FavoriteTitle = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
`;

const TitleInputText = styled.div``;

const TitleInputLine = styled.div`
  border-bottom: 2px solid #74c6cc;
  margin-top: 15px;
  margin-bottom: 10px;
  @media screen and (max-width: 767px) {
    border-bottom: 1px solid #74c6cc;
    margin-top: 8px;
  }
`;

const TitleInput = styled.input`
  width: 500px;
  height: 40px;
  border-radius: 15px;
  font-size: 20px;
  padding-left: 10px;
  margin-top: 10px;
  letter-spacing: 2px;
  @media screen and (max-width: 767px) {
    height: 30px;
    margin-top: 0px;
    width: 400px;
  }
  @media screen and (max-width: 500px) {
    height: 30px;
    margin-top: 0px;
    width: 300px;
  }
`;

const DateInputText = styled.div`
  margin-top: 25px;
  font-weight: 600;
  letter-spacing: 3px;
  @media screen and (max-width: 767px) {
    font-size: 20px;
  }
`;

const DateInputTop = styled.div`
  display: flex;
`;

const FaCalendarDays = styled.div`
  margin-right: 15px;
  margin-left: 3px;
`;

const DateInputLine = styled.div`
  border-bottom: 2px solid #74c6cc;
  margin-top: 15px;
  margin-bottom: 10px;
  @media screen and (max-width: 767px) {
    border-bottom: 1px solid #74c6cc;
    margin-top: 8px;
  }
`;

const DateInput = styled.input`
  width: 100%;
  height: 40px;
  border-radius: 15px;
  font-size: 20px;
  padding: 0px 5px;
  margin-top: 10px;
  @media screen and (max-width: 767px) {
    height: 30px;
    margin-top: 0px;
    font-size: 16px;
  }
`;

const DescriptionText = styled.div`
  margin-top: 25px;
  font-weight: 600;
  letter-spacing: 3px;
  @media screen and (max-width: 767px) {
    font-size: 20px;
  }
`;

const DescriptionRemind = styled.div`
  color: #cd5c5c;
  font-size: 16px;
  letter-spacing: 2px;
  margin-top: -3px;
`;

const DescriptionTop = styled.div`
  display: flex;
`;

const FaHandPointUp = styled.div`
  margin-right: 15px;
  margin-left: 3px;
`;

const DescriptionLine = styled.div`
  border-bottom: 2px solid #74c6cc;
  margin-top: 15px;
  margin-bottom: 10px;
  @media screen and (max-width: 767px) {
    border-bottom: 1px solid #74c6cc;
    margin-top: 8px;
  }
`;

const DescriptionInput = styled.textarea`
  width: 100%;
  margin-top: 10px;
  border-radius: 15px;
  font-size: 20px;
  padding: 10px 10px;
  letter-spacing: 2px;
  resize: none;
  height: 100px;
  @media screen and (max-width: 767px) {
    height: 80px;
    margin-top: 2px;
  }
`;

const PageOnePicOutside = styled.div`
  width: 100%;
  height: 200px;
  @media screen and (max-width: 767px) {
    height: 100px;
  }
`;

const PageOnePic = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${pageOnePic});
  background-size: cover;
  background-position: 30% 95%;
  background-repeat: no-repeat;
`;

const TurnRight = styled.div`
  cursor: pointer;
  margin-left: auto;
  margin-right: 13px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 30px;
  &:hover {
    color: #74c6cc;
  }
`;

const ToEmail = styled.input`
  display: none;
`;

const ToName = styled.input`
  display: none;
`;

const TurnOutside = styled.div`
  display: flex;
  justify-content: space-between;
`;
