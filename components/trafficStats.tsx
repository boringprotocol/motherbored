import 'chart.js/auto';
import { Chart } from 'react-chartjs-2';
import 'chartjs-adapter-luxon';
const Moment = require('moment')
import prettyBytes from 'pretty-bytes';
import { ChartDataset, ChartOptions } from 'chart.js';




// import our custom configuration for our chart
const Config: ChartOptions = {
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            titleFont: {
                family: "Jetbrains-Mono-Thin"
            },
            bodyFont: {
                family: "Jetbrains-Mono-Thin"
            },
            cornerRadius: 2,
        },
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'datetime (UTC)',
                font: {
                    size: 12,
                    family: "JetBrains-Mono-Thin",
                },
            },
            adapters: {
                date: {
                    zone: 'UTC'
                }
            },
            stacked: true,
            type: 'time',
            time: {
                //displayFormats: {
                //    day: "D",
                //},
                unit: 'day',
            },
            ticks: {
                font: {
                    size: 12,
                    family: "JetBrains-Mono-Thin",
                }
            }
        },
        y: {
            title: {
                display: true,
                text: 'bytes transfered',
                font: {
                    size: 12,
                    family: "JetBrains-Mono-Thin",
                },
            },
            stacked: true,
            ticks: {
                font: {
                    size: 12,
                    family: "JetBrains-Mono-Thin",
                },
                callback: function (value: any) {
                    return prettyBytes(value)
                }
            },

        }
    }
};

const TrafficStats = (props: any) => {

    let testdata = new Map()
    if (!props.peerCount5m) {
        return (
            <div id='nostats'></div>
        )
    }
    if (!props.stats) {
        return (
            <div id='nostats'></div>
        )
    }

    // this was a breakdown by consumer (for sorting):
    props.stats.map((el: any) => {
        if (testdata.has(el.public_key)) {
            testdata.get(el.public_key).values.push({ x: el._time, y: el._value })
        } else {
            testdata.set(el.public_key, { field: el._field, values: [{ x: el._time, y: el._value }] })
        }
    })

    // this is traffic totals by rx/tx bytes (all consumers)
    //props.stats.map((el: any) => {
    //const useDate = Date.parse(el._time)
    //const useDate = Date.parse(el._time)
    /*
    let useDateString = useDate.toLocaleDateString() + " " + useDate.toLocaleTimeString([], {
        hourCycle: 'h23',
        hour: '2-digit',
        minute: '2-digit'
    })*/
    //let useDateString = useDate.toISOString()
    //console.log(useDateString)
    //    if (el.public_key != props.peer.pubkey) {
    //        if (testdata.has(el._field)) {
    //            testdata.get(el._field).values.push({ x: el._time, y: el._value })
    //        } else {
    //            testdata.set(el._field, { field: el._field, values: [{ x: el._time, y: el._value }] })
    //        }
    //    }
    //})

    //   we will provide some minor customizations for our chart
    //   and also its labels and inputs

    const datasets: ChartDataset[] = []

    const pal = ["FB6900",
        "F63700",
        "004853",
        "007E80",
        "00B9BD", "DDD", "333333", "7BB3C4", "DAE036", "B03C33", "215782", "384730", "C4BDA2", "FEDC89", "FEB98D", "7B0A5C", "C61427", "FD8056", "FDC05B", "7F472E", "A47A23", "5A3302", "F8485A"];

    //const pal = ["DDD", "333333", "7BB3C4", "DAE036", "B03C33", "215782", "384730", "C4BDA2", "FEDC89", "FEB98D", "7B0A5C", "C61427", "FD8056", "FDC05B", "7F472E", "A47A23", "5A3302", "F8485A"];
    var counter = 0;

    testdata.forEach((value, key, map) => {
        var borderColor = "#" + pal[counter % pal.length];
        counter += 1
        // const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        // const borderColor = "#" + randomColor;

        //let sorted = value.values.sort((a: any, b: any) => a.valueOf() - b.valueOf())
        /*
        const sorted = value.values.sort((a: any, b: any) => {
            const i = new Moment(a.x, "YYYY-MM-DDTHH:mm:ssZ");
            const j = new Moment(b.x, "YYYY-MM-DDTHH:mm:ssZ");
            return i.unix() - j.unix();
        }
        )
        */

        const sorted = value.values

        datasets.push(
            {
                // label for our chart (pubkey?)
                label: "",
                fill: true,
                data: sorted,
                // color of the line chart
                borderColor: borderColor,
                // Examples of other values you could use here
                // partially transparent part below our line graph
                backgroundColor: borderColor,
                //borderWidth: 1,
                //pointRadius: props.pointRadius,
                //pointHoverRadius: 5,
                //borderCapStyle: 'butt',
                //pointHoverBackgroundColor: 'rgba(59, 130, 246, 1)',
                //pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
                //pointHoverBorderWidth: 2
                barThickness: 20,

            }

        )
    })

    //testdata.forEach((value, key, map) => {
    //    console.log(key, value.field)
    //})

    //console.log("datasets", datasets.length)

    const data = { datasets: datasets };


    let m5 = "0"
    let d7 = "0"
    if (props.peerCount7d.length != 0 && props.peerCount7d[0]._value != null) {
        d7 = props.peerCount7d[0]._value
    }

    if (props.peerCount5m.length != 0 && props.peerCount5m[0]._value != null) {
        m5 = props.peerCount7d[0]._value
    }

    //   and finally lets return a chart component with our api data and
    //   config
    return (
        <div>

            <div className="chart-container w-full h-full p-2">
                <Chart type='bar' data={data} options={Config} />
            </div>
            <div className="grid">
                <dl className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3">
                    <div key="connected-peers" className="overflow-hidden  px-4 py-5 sm:p-6 bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white">
                        <dt className="truncate text-xs bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white">Consumers (last 7 days)</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white">{d7}</dd>
                    </div>
                    <div key="connected-peers5" className="overflow-hidden  px-4 py-5 sm:p-6 bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white">
                        <dt className="truncate text-xs bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white">Consumers (now)</dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white">{m5}</dd>
                    </div>
                </dl>
            </div >
        </div >
    );
};

export default TrafficStats;
