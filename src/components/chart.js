import React from "react";
import { Bar } from 'react-chartjs-2';

const Chart = (props) => {      //TODO Maybe make this into a historgram when you get time
    const data = {
        chartData: {
            labels: ['Female', 'FemaleAve', 'Male', 'MaleAve'],
            datasets: [
                {
                    label: 'Connection Counts',
                    backgroundColor: 'rgba(255,99,132,0.2)',
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBorderWidth: 2,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data: [props.genderConnectionData[0], props.genderConnectionData[1], props.genderConnectionData[2], props.genderConnectionData[3]]
                }
            ]
        }
    }
    return (
        <>
            {props.genderConnectionData[4] ?
                <div className="chart">

                    <Bar
                        data={data.chartData}
                    />
                </div>
                : null}
        </>
    );
};

export default Chart;