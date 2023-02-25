import { Line } from 'react-chartjs-2';

const data = {
    labels: Array.from({ length: 520 }, (_, i) => `Week ${i + 1}`),
    datasets: [
        {
            label: 'Epochs',
            data: Array.from({ length: 520 }, () => 242307.69),
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
        },
    ],
};

const options = {
    scales: {
        x: {
            type: 'category',
            title: {
                display: true,
                text: '10-Year Timeline',
            },
        },
        y: {
            title: {
                display: true,
                text: 'Epoch Sum',
            },
        },
    },
};

const MyChart: React.FC = () => (
    <Line data={data} options={options} />
);

export default MyChart;
