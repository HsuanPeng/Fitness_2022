import styled from 'styled-components';

//chart.js
import { Pie } from 'react-chartjs-2';

const CalculationShowZone = (props) => {
  return (
    <CalculationShow>
      <PieOutside>
        {props.choiceAction.length > 0 ? <Pie data={props.data} /> : <Pie data={props.dataNull} />}
      </PieOutside>
      <CompeleteTrainingSetting
        onClick={() => {
          props.getCompleteSetting();
          props.compeleteTrainingSetting();
        }}
      >
        完成菜單設定
      </CompeleteTrainingSetting>
    </CalculationShow>
  );
};

export default CalculationShowZone;

const PieOutside = styled.div`
  max-width: 350px;
  padding: 10px;
  margin: 0 auto;
`;

const CalculationShow = styled.div`
  margin: 0 auto;
`;

const CompeleteTrainingSetting = styled.button``;

const TrainingSettingComplete = styled.div`
  display: ${(props) => (props.$isHide ? 'block;' : 'none;')};
`;
