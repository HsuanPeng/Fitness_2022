import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';

const PromoteActionOutsideZone = (props) => {
  return (
    <PromoteActionOutside>
      <PromoteItemOutside>
        <PartTitle>部位</PartTitle>
        <select onChange={(e) => props.setPart(e.target.value)}>
          {/* <option value="none" selected disabled hidden>
        請選擇選項
      </option> */}
          <option defaultValue="肩">肩</option>
          <option defaultValue="手臂">手臂</option>
          <option defaultValue="胸">胸</option>
          <option defaultValue="背">背</option>
          <option defaultValue="臀腿">臀腿</option>
          <option defaultValue="核心">核心</option>
          <option defaultValue="上半身">上半身</option>
          <option defaultValue="全身">全身</option>
        </select>
        <div>
          {props.promoteActions.map((item, index) => (
            <PromoteListOutside key={uuidv4()}>
              <AddIcon
                id={index}
                onClick={(e) => {
                  props.addActionItem(e);
                }}
              >
                ⊕
              </AddIcon>
              <PromoteListPart>{item.bodyPart}</PromoteListPart>
              <PromoteLisName>{item.actionName}</PromoteLisName>
              <VideoTag
                id={index}
                onClick={(e) => {
                  props.openVideo(e);
                }}
              >
                影片按鈕
              </VideoTag>
            </PromoteListOutside>
          ))}
        </div>
      </PromoteItemOutside>
    </PromoteActionOutside>
  );
};

export default PromoteActionOutsideZone;

const PromoteActionOutside = styled.div`
  background: #dcdcdc;
  width: 50%;
`;

const PromoteItemOutside = styled.div`
  padding: 10px;
`;

const PartTitle = styled.div``;

const ActionTitle = styled.div``;

const PromoteListOutside = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 10px;
  background: #8dc3c9;
`;

const AddIcon = styled.div`
  width: 10%;
  cursor: pointer;
`;

const PromoteListPart = styled.div`
  width: 30%;
`;

const PromoteLisName = styled.div`
  width: 30%;
`;

const VideoTag = styled.div`
  width: 30%;
  cursor: pointer;
`;

const TrainingOutsideThree = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;
