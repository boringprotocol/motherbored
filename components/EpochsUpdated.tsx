import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import epochs from '../data/epochs.json';


// give value of 0 to sums not specified in the range
// jq 'map(if (.name | ltrimstr("epoch-") | tonumber) >= 3 and (.name | ltrimstr("epoch-") | tonumber) <= 100 then .sum = ((690 - 420) / ((20 - 3) * (20 - 3))) * (.name | ltrimstr("epoch-") | tonumber - 3) * (.name | ltrimstr("epoch-") | tonumber - 3) + 420 else .sum = 0 end)' data/epochs.json > tmp.json && mv tmp.json data/epochs.json

// update only specific range
// jq '(map(if (.name | ltrimstr("epoch-") | tonumber) >= 101 and (.name | ltrimstr("epoch-") | tonumber) <= 200 then .sum = ((690 - 420) / ((20 - 3) * (20 - 3))) * (.name | ltrimstr("epoch-") | tonumber - 3) * (.name | ltrimstr("epoch-") | tonumber - 3) + 420 else . end)) as $new | map(if .name | ltrimstr("epoch-") | tonumber >= 3 and .name | ltrimstr("epoch-") | tonumber <= 100 then $new[] else . end)' data/epochs.json > tmp.json && mv tmp.json data/epochs.json


const EpochLineChart: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: epochs.map((epoch) => epoch.name),
                        datasets: [
                            {
                                label: '',
                                data: epochs.map((epoch) => epoch.sum),
                                borderColor: '',
                                tension: 0.1,
                            },
                        ],
                    },
                });
            }
        }
    }, []);

    return (
        <div>
            <canvas ref={canvasRef}></canvas>
        </div>
    );
};

export default EpochLineChart;
