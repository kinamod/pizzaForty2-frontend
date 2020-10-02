import React, { useEffect, useState } from "react";
import { logger } from "../utils/logger-helper";

import { useAuth0 } from "@auth0/auth0-react";

import Chart from "../components/chart";

const UsersInfo = () => {

    const apiUrl = (process.env.REACT_APP_RUNNING_LOCALLY) ? process.env.REACT_APP_API_URL_LOCAL : process.env.REACT_APP_API_URL;

    const { getAccessTokenSilently } = useAuth0();
    const [graphData, setGraphData] = useState([0, 0, 0, 0]);
    const newGraphData = (female, femaleAve, male, maleAve) => setGraphData([female, femaleAve, male, maleAve, true]);



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

    function collateGenderConnectionGraphData(UserList) {
        logger("collateGenderConnectionGraphData", UserList)
        const genderConnections = new Array();
        for (let person of UserList) {
            if (person.user_metadata && person.user_metadata.gender && person.user_metadata.connectioncount) {
                genderConnections.push([person.user_metadata.gender, person.user_metadata.connectioncount]);
            }
        }

        var maleCount = 0;
        var femaleCount = 0;
        var male = 0;
        var female = 0;
        var femaleAve = 0;
        var maleAve = 0;    //I feel like vars are against react rules, but I needed them
        for (let pair of genderConnections) {
            if (pair[0] === 'male') {
                male += pair[1];
                maleCount++;
            } else if (pair[0] === 'female') {
                female += pair[1];
                femaleCount++;
            }
        }
        if (maleCount !== 0) {
            maleAve = male / maleCount;
        }
        if (femaleCount !== 0) {
            femaleAve = female / femaleCount;
        }
        newGraphData(female, femaleAve, male, maleAve);

        logger("collateGenderConnectionGraphData", maleAve + " - " + femaleAve);
        logger("collateGenderConnectionGraphData", graphData);
    }

    useEffect(() => {
        // Update the document title using the browser API
        makeGenderChart();
    }, []);

    return (
        <>
            {/* <Button onClick={makeGenderChart} color="primary" className="mt-5">
                Make Gender Chart               //Can ditch the button becasuse I'm using useEffect to populate the graph now
        </Button> */}
            <Chart genderConnectionData={graphData} />
        </>
    );
};

export default UsersInfo;