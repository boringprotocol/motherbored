import React from 'react';
import Chart from 'chart.js/auto';
import { useTheme } from 'next-themes';

interface StackedBarChartProps {
  data: number[][];
  labels: string[];
}



const StackedBarChart: React.FC<StackedBarChartProps> = ({ data, labels }) => {
  const chartRef = React.useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  const colors = {
    item1: theme === 'dark' ? '#73C7F9' : '#73C7F9',
    item2: theme === 'dark' ? '#0B6EC5' : '#0B6EC5',
    item3: theme === 'dark' ? '#75DB8C' : '#75DB8C',
    item4: theme === 'dark' ? '#13862E' : '#13862E'
  };

  React.useEffect(() => {
    if (chartRef.current) {
      const chart = new Chart(chartRef.current, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'POA',
              data: data[0],
              backgroundColor: colors.item1,
              borderWidth: 1
            },
            {
              label: 'AAP',
              data: data[1],
              backgroundColor: colors.item2,
              borderWidth: 1
            },
            {
              label: 'NFT',
              data: data[2],
              backgroundColor: colors.item3,
              borderWidth: 1
            },
            {
              label: 'ETC',
              data: data[3],
              backgroundColor: colors.item4,
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            x: {
              display: false,
              stacked: true,
              ticks: {
                display: false
              }
            },
            y: {
              display: false,
              stacked: true
            }
          }
        }
      });

      return () => {
        chart.destroy();
      };
    }
  }, [data, labels]);

  return <canvas ref={chartRef} />;
};

export default StackedBarChart;
