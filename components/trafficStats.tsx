import Chart, { ChartDataset, ChartOptions } from 'chart.js/auto';
import { DateTime } from 'luxon';
import { TimeSeriesScale } from 'chartjs-adapter-luxon';
import prettyBytes from 'pretty-bytes';

Chart.register(TimeSeriesScale, DateTime);

// import our custom configuration for our chart
const Config: ChartOptions = {
    plugins: {
        legend: {
            display: false
        },
        tooltip: {
            titleFont: {
                family: 'Jetbrains-Mono-Thin'
            },
            bodyFont: {
                family: 'Jetbrains-Mono-Thin'
            },
            cornerRadius: 2
        }
    },
    scales: {
        x: {
            title: {
                display: true,
                text: 'datetime (UTC)',
                font: {
                    size: 12,
                    family: 'JetBrains-Mono-Thin'
                }
            },
            adapters: {
                date: {
                    zone: 'UTC'
                }
            },
            stacked: true,
            type: 'time',
            time: {
                unit: 'day'
            },
            ticks: {
                font: {
                    size: 12,
                    family: 'JetBrains-Mono-Thin'
                }
            }
        },
        y: {
            title: {
                display: true,
                text: 'bytes transfered',
                font: {
                    size: 12,
                    family: 'JetBrains-Mono-Thin'
                }
            },
            stacked: true,
            ticks: {
                font: {
                    size: 12,
                    family: 'JetBrains-Mono-Thin'
                },
                callback: function (value: any) {
                    return prettyBytes(value);
                }
            }
        }
    },
    type: 'bar',
    data: {
        datasets: [
            {
                label: '',
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1
            }
        ]
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

    props.stats.map((el: any) => {
        if (testdata.has(el.public_key)) {
            testdata.get(el.public_key).values.push({ x: el._time, y: el._value })
        } else {
            testdata.set(el.public_key, { field: el._field, values: [{ x: el._time, y: el._value }] })
        }
    })

    const datasets: ChartDataset[] = []

    const pal = ["FB6900",
        "F63700",
        "004853",
        "007E80",
        "00B9BD", "DDD", "333333", "7BB3C4", "DAE036", "B03C33", "215782", "384730", "C4BDA2", "FEDC89", "FEB98D", "7B0A5C", "C61427", "FD8056", "FDC05B", "7F472E", "A47A23", "5A3302", "F8485A"];

    var counter = 0;

    testdata.forEach((value, key, map) => {
        var borderColor = "#" + pal[counter % pal.length];
        counter += 1

        const sorted = value.values

        datasets.push(
            {
                label: "",
                fill: true,
                data: sorted,
                borderColor: borderColor,
                backgroundColor: borderColor,
                barThickness: 20,

            }

        )
    })

    const data = { datasets: datasets };


    let m5 = "0"
    let d7 = "0"
    if (props.peerCount7d.length != 0 && props.peerCount7d[0]._value != null) {
        d7 = props.peerCount7d[0]._value
    }

    if (props.peerCount5m.length != 0 && props.peerCount5m[0]._value != null) {
        m5 = props.peerCount7d[0]._value
    }

    return (
        <div>
            <div className="chart-container w-full h-full p-2">
                <Chart type="bar" data={data} options={Config}></Chart>
            </div>
            <div className="grid">
                <dl className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3">
                    <div
                        key="connected-peers"
                        className="overflow-hidden  px-4 py-5 sm:p-6 bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white"
                    >
                        <dt className="truncate text-xs bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white">
                            Consumers (last 7 days)
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white">
                            {d7}
                        </dd>
                    </div>
                    <div
                        key="connected-peers5"
                        className="overflow-hidden  px-4 py-5 sm:p-6 bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white placeholder-boring-black dark:placeholder-boring-white"
                    >
                        <dt className="truncate text-xs bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white">
                            Consumers (now)
                        </dt>
                        <dd className="mt-1 text-3xl font-semibold tracking-tight bg-boring-white dark:bg-boring-black text-boring-black dark:text-boring-white">
                            {m5}
                        </dd>
                    </div>
                </dl>
            </div>
        </div>
    );

};

export default TrafficStats;
