import styled from 'styled-components';

//chart.js
import { Pie } from 'react-chartjs-2';

const CalculationShowZone = (props) => {
  return (
    <>
      <CalculationShow>
        <PieOutside>
          {props.choiceAction.length > 0 ? (
            <Pie data={props.data} options={{ color: 'white', fontSize: 20 }} />
          ) : (
            <Pie data={props.dataNull} options={{ color: 'white', fontSize: 20 }} />
          )}
        </PieOutside>
      </CalculationShow>
    </>
  );
};

export default CalculationShowZone;

const PieOutside = styled.div`
  width: 475px;
  padding: 10px;
  margin: 0 auto;
  margin-top: 20px;
  @media screen and (max-width: 575px) {
    width: 300px;
  }
`;

const CalculationShow = styled.div`
  margin: 0 auto;
`;
