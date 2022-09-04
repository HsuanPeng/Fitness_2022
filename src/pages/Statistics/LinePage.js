import React from 'react';

//chart.js
import { Line } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const data = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'July'],
  datasets: [
    {
      label: '體脂肪率',
      data: [50, 53, 85, 41, 44, 65, 30],
      fill: true,
      backgroundColor: 'rgba(75,192,192,0.2)',
      borderColor: 'rgba(75,192,192,1)',
    },
    // {
    //   label: 'Second dataset',
    //   data: [33, 25, 35, 51, 54, 76, 15],
    //   fill: false,
    //   borderColor: '#742774',
    // },
  ],
};

const LinePage = () => {
  return (
    <div>
      <Line data={data} />
    </div>
  );
};

export default LinePage;
