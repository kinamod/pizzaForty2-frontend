import React, { useEffect, useState } from "react";
import { Bar } from 'react-chartjs-2';

const Chart = (props) => {      //TODO Maybe make this into a historgram when you get time
    const [labels, setLabels] = useState();
    const data = {
        chartData: {
            labels: labels,
            datasets: [
                {
                    label: 'Female Connections',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBorderWidth: 2,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',

                    data: props.graphData.femaleConnectionsGrouped
                },
                {
                    label: 'Male Connections',
                    backgroundColor: 'rgba(132,99,255,0.2)',
                    borderColor: 'rgba(132,99,255,1)',
                    borderWidth: 1,
                    hoverBorderWidth: 2,
                    hoverBackgroundColor: 'rgba(132,99,255,0.4)',
                    hoverBorderColor: 'rgba(132,99,255,1)',
                    data: props.graphData.maleConnectionsGrouped
                }
            ]
        }
    }
    useEffect(() => {

        let interval = Math.round(props.graphData.interval);
        let noIntervals = props.graphData.noIntervals;
        let makeLabels = new Array(noIntervals).fill("");
        for (let i = 0; i < noIntervals; i++) {
            makeLabels[i] = (i * interval) + " - " + (((i + 1) * interval) - 1);
        }
        setLabels(makeLabels);
    }, [props]);
    return (
        <>
            <div className="chart">
                Number of Connections vs Number of Users
                <Bar
                    data={data.chartData}
                />
            </div>
        </>
    );
};

export default Chart;