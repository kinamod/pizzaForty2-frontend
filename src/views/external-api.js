import React, { useState } from "react";
import { Button, ButtonGroup, Container } from "react-bootstrap";
import { Highlight } from "../components";
import { useAuth0 } from "@auth0/auth0-react";

export const ExternalApi = () => {
  const [message, setMessage] = useState("");
  const apiUrl = process.env.REACT_APP_API_URL;
  const appDomain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientID = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const appSecret = process.env.REACT_APP_SECRET;
  const audience = process.env.REACT_APP_AUDIENCE;
  const { user, getIdTokenClaims, getAccessTokenSilently } = useAuth0();

  const callApi = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/public-message`);

      const responseData = await response.json();

      setMessage(responseData);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const callSecureApi = async () => {
var responseData ="";
    if(user.email_verified){
    try {
      const token = await getAccessTokenSilently();
      console.log("email verified: "+user.email_verified);

      console.log("token: "+token)

      const response = await fetch(`${apiUrl}/api/order-pizza`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      responseData = await response.json();

      
    } catch (error) {
      setMessage(error.message);
    }
  }else{
    responseData="You must first verify your email address";
  }
  setMessage(responseData);
  };

  // const getGoogleAuth = async () => {
  //   try {
  //     const token = await getAccessTokenSilently();


     

  //     console.log("getGoogleAuth - token: "+token)

  //     const response = await fetch(`${apiUrl}/api/authorize`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const responseData = await response.json();

  //     setMessage("google auth: "+responseData);
  //   } catch (error) {
  //     setMessage(error.message);
  //   }
  // };

  const callGoogleApi = async () => {
    try{
      //Credential flow
      const token = await getAccessTokenSilently();
      // const authCode = await fetch(`https://dev-kinamod-01.eu.auth0.com/authorize?response_type=code&client_id=1rdsoIFbftWEHv89Q3cfx3Q5c3PEXUoN&redirect_uri=http://localhost:3000&scope=SCOPE&state=STATE`);


      var request = require("request");

      var options = {
        method: 'POST',
        url: `https://${appDomain}/oauth/token`,
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        form: {
          grant_type: 'authorization_code',
          client_id: `${clientID}`,
          client_secret: `${appSecret}`,
          audience: `${audience}`,
          code: `${token}`,
          redirect_uri: `${apiUrl}`
        }
      };
      
      request(options, function (error, response, body) {
        if (error) throw new Error(error);
      
        console.log("getting token: "+body);
      });
      //END credential flow==================
      // const token = await getAccessTokenSilently();
      // const token = await getAccessTokenSilently({
      //   audience: `https://dev-kinamod-01.eu.auth0.com/api/v2/`,
      //   scope: "read:current_user",
      // });
      console.log("token: "+token);
      console.log("auth0: "+getIdTokenClaims); 
      
//original stuff
// const response = await fetch(`${apiUrl}/api/authorize`,{
//const response = await fetch(`https://dev-kinamod-01.eu.auth0.com/api/authorize`,{
      // const response = await fetch(`https://people.googleapis.com/v1/people/me/connections`, {
      //   headers: {
      //     Authorization: `Bearer "${token}"`,
      //   },
      // });

      // const responseData = await response.json();

      // setMessage(responseData);
     
    } catch (error) {
      console.log("Caught Error: "+error);
      setMessage(error.message);
    }
    //END original stuff

  };

  return (
    <Container className="mb-5">
      <h1>External API</h1>
      <p>
        You use will use a button to call an external API using an access token,
        and the API will validate it using the API's audience value.{" "}
        <strong>This route should be private</strong>.
      </p>
      <ButtonGroup>
        <Button onClick={callApi} color="primary" className="mt-5">
          Get Public Message
        </Button>
        <Button onClick={callSecureApi} color="primary" className="mt-5">
          Order My Pizza
        </Button>
        <Button onClick={callGoogleApi} color="primary" className="mt-5">
          Call Google Users
        </Button>
      </ButtonGroup>

      {message && (
        <div className="mt-5">
          <h6 className="muted">Result</h6>
          <Highlight>{JSON.stringify(message, null, 2)}</Highlight>
        </div>
      )}
    </Container>
  );
};

export default ExternalApi;