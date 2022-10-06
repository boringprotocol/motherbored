import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';

// import our custom configuration for our chart
// these settings were bad, pick new ones or just leave blank 
export const Config = {
    /*
    plugins: {

        // show legends for our graph
        legend: {
            display: true,
        },
    },
    lineHeightAnnotation: {
        always: true,
        lineWeight: 1.5,
    },

    //   animate in
    animation: {
        duration: 1,
    },
    maintainAspectRatio: false,
    responsive: true,

    //   show the x and y scales
    scales: {
        x: { display: true },
        y: { display: true },
    },
    */
};

const TrafficStats = (props: any) => {

    let testdata = new Map()
    props.stats.map((el: any) => {
        if (testdata.has(el.public_key)) {
            testdata.get(el.public_key).values.push({ x: el._time, y: el._value })
        } else {
            testdata.set(el.public_key, { field: el._field, values: [{ x: el._time, y: el._value }] })
        }
    })

    //   we will provide some minor customizations for our chart
    //   and also its labels and inputs

    interface Dataset {
        label: string,
        fill: boolean,
        borderColor: string,
        data: any,
    }

    //let datasets = Dataset[]
    const datasets: Dataset[] = []

    testdata.forEach((value, key, map) => {
        datasets.push(
            {
                // label for our chart
                label: key,
                fill: false,
                data: value.values,
                // color of the line chart
                borderColor: '#3B82F6',
                // partially transparent part below our line graph
                //backgroundColor: 'rgba(59, 130, 246, 0.2)',
                //borderWidth: 3,
                //pointRadius: props.pointRadius,
                //pointHoverRadius: 5,
                //borderCapStyle: 'butt',
                //pointHoverBackgroundColor: 'rgba(59, 130, 246, 1)',
                //pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
                //pointHoverBorderWidth: 2

            }

        )
    })

    testdata.forEach((value, key, map) => {
        console.log(key, value.values)
    })

    //console.log("datasets", datasets.length)

    const data = { datasets: datasets };

    //   and finally lets return a chart component with our api data and
    //   config
    return (
        <div className="chart-container w-full h-full p-2">
            <Chart type='line' data={data} options={Config} />
        </div>
    );
};

export default TrafficStats;