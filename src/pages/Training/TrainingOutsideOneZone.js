import styled from 'styled-components';

const TrainingOutsideOneZone = (props) => {
  return (
    <TrainingOutsideOne $isHide={props.openTrainingOne}>
      <Close onClick={props.closeAddTraining}>X</Close>
      主題
      <TitleInput onChange={(e) => props.setTitle(e.target.value)}></TitleInput>
      日期
      <DateInput type="date" onChange={(e) => props.setDate(e.target.value)}></DateInput>
      <TurnOutside>
        <TurnRight onClick={props.getPageTwo}>下一頁</TurnRight>
      </TurnOutside>
    </TrainingOutsideOne>
  );
};

export default TrainingOutsideOneZone;

const TrainingOutsideOne = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;

const Close = styled.div``;

const TitleInput = styled.input``;

const DateInput = styled.input``;

const TurnOutside = styled.div`
  display: flex;
  justify-content: space-between;
`;

const TurnRight = styled.div``;
