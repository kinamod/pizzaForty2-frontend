import React, { useEffect, useState } from "react";
import { logger } from "../utils/logger-helper";
import { gaussianRand } from "../utils/mathshelpers";

import { useAuth0 } from "@auth0/auth0-react";

import Chart from "../components/chart";

const UsersInfo = () => {

    const apiUrl = (process.env.REACT_APP_RUNNING_LOCALLY) ? process.env.REACT_APP_API_URL_LOCAL : process.env.REACT_APP_API_URL;

    const { getAccessTokenSilently } = useAuth0();
    const [graphData, setGraphData] = useState([], [], 0, 0);
    const [graphVisible, setGraphVisible] = useState(false);

    //TODO what happens if they say no?


    const makeGenderChart = async () => {

        try {
            logger("getUserList", "backendAPI: " + apiUrl);

            const token = await getAccessTokenSilently();

            const response = await fetch(`${apiUrl}/api/get-user-list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const responseData = await response.json();
            logger("makeGenderchart", response + " : " + JSON.stringify(responseData.msg));
            collateGenderConnectionGraphData(responseData.msg);
        } catch (error) {
            // setMessage(error.message);
            logger("UsersInfo", error);
        }
    };
    function generateMoreDataForDemo(noFakeEntries) {
        var genderConnectionsToAdd = [];
        for (let i = 0; i < noFakeEntries; i++) {
            let genderInt = Math.round(Math.random());
            let gender = genderInt === 0 ? "female" : "male";
            logger("generateMoreDataForDemo: ", gender)
            genderConnectionsToAdd.push([gender, Math.round(gaussianRand() * 601)]);
        }
        logger("generateMoreDataForDemo", genderConnectionsToAdd);
        return genderConnectionsToAdd;
    }

    function collateGenderConnectionGraphData(UserList) {
        logger("collateGenderConnectionGraphData", UserList + " length: " + Object.keys(UserList).length)

        let genderConnections = [];
        for (let person of UserList) {
            if (person.user_metadata && person.user_metadata.gender && person.user_metadata.connectioncount) {
                genderConnections.push([person.user_metadata.gender, person.user_metadata.connectioncount]);
                logger("collating data", person.user_metadata.gender + " - " + person.user_metadata.connectioncount)
            }
        }
        if (genderConnections.length < 20) {    //Makes the graph more interesting for a demo
            logger("genderConnections before more", genderConnections);
            genderConnections = genderConnections.concat(generateMoreDataForDemo(100, genderConnections));
            logger("genderConnections AFTER more", genderConnections);
        }
        var maxConnections = 0;
        var maleCount = 0;
        var femaleCount = 0;
        var male = 0;
        var female = 0;
        var femaleAve = 0;
        var maleAve = 0;
        var localTESTcount = 0;
        for (let i = 0; i < genderConnections.length; i++) {

            logger(`gettingMax:${localTESTcount++}`, genderConnections[i][0] + " : " + genderConnections[i][1] + " : " + maxConnections);
            maxConnections = Math.max(genderConnections[i][1], maxConnections);
            if (genderConnections[i][0] === 'male') {
                male += genderConnections[i][1];
                maleCount++;
            } else if (genderConnections[i][0] === 'female') {
                female += genderConnections[i][1];
                femaleCount++;
            }
        }
        logger(`gettingMax`, genderConnections[0] + ":" + genderConnections[24] + ":" + genderConnections[25]);
        if (maleCount !== 0) {
            maleAve = male / maleCount;
        }
        if (femaleCount !== 0) {
            femaleAve = female / femaleCount;
        }
        const newDataForGraph = groupValuesForHistogram(genderConnections, maxConnections)
        setGraphData(newDataForGraph);
        logger("collateGenderConnectionGraphData", maleAve + " - " + femaleAve);
    }

    function groupValuesForHistogram(genderConnections, maxValue) {
        console.log("qwertyuiop")
        logger("groupValuesForHistogram", "entered");
        let noIntervals = 12
        let interval = maxValue / noIntervals;
        let femaleConnectionsGrouped = new Array(noIntervals).fill(0);
        let maleConnectionsGrouped = new Array(noIntervals).fill(0);

        logger("groupValuesForHistogram", noIntervals + " : " + interval + " : " + maxValue);
        for (let i = 0; i < noIntervals; i++) {
            logger("groupValuesForHistogram i", i + " interval: " + (interval * i));
            for (let j = 0; j < genderConnections.length; j++) {


                if (genderConnections[j][1] <= (interval * (i + 1))) {
                    if (genderConnections[j][0] === "male") {
                        maleConnectionsGrouped[i] += 1;
                        logger("groupValuesForHistogram = male", maleConnectionsGrouped[i])
                    } else {
                        femaleConnectionsGrouped[i] += 1;
                    }
                    genderConnections[j][1] = maxValue * 2;
                }
            }
        }
        return { femaleConnectionsGrouped, maleConnectionsGrouped, noIntervals, interval };
    }

    useEffect(() => {
        makeGenderChart();
        setGraphVisible(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {/* <Button onClick={makeGenderChart} color="primary" className="mt-5">
                Make Gender Chart               //Can ditch the button becasuse I'm using useEffect to populate the graph now
        </Button> */}
            {graphVisible ?
                <Chart graphData={graphData} /> : null
            }
        </>
    );
};

export default UsersInfo;
