import React, { useState } from "react";
import { Button, ButtonGroup, Container } from "react-bootstrap";
import { Highlight } from "../components";
import { useAuth0 } from "@auth0/auth0-react";
import { logger } from "../utils/logger-helper";

export const OrderPizzaApi = () => {
  const [message, setMessage] = useState("");
  const apiUrl = (process.env.REACT_APP_RUNNING_LOCALLY) ? process.env.REACT_APP_API_URL_LOCAL : process.env.REACT_APP_API_URL;
  const { user, getAccessTokenSilently } = useAuth0();

  const callApi = async () => {

    try {
      logger("callApi", "backendAPI: " + apiUrl);

      const response = await fetch(`${apiUrl}/api/public-message`);

      const responseData = await response.json();

      setMessage(responseData);
    } catch (error) {
      setMessage(error.message);
    }
  };




  const orderPizza = async () => {
    var responseData = "";
    if (user.email_verified) {
      try {
        const token = await getAccessTokenSilently();
        logger("callSecureApi", "email verified: " + user.email_verified);
        logger("callSecureApi", "token: " + token)

        const response = await fetch(`${apiUrl}/api/order-pizza`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        responseData = await response.json();


      } catch (error) {
        setMessage(error.message);
      }
    } else {
      responseData = "You must first verify your email address";
    }
    setMessage(responseData);
  };


  return (
    <Container className="mb-5">
      <h1>Pizza Ordering</h1>
      <p>
        You use will use a button to call an external API using an access token,
        and the API will validate it using the API's audience value.{" "}
        <strong>This route should be private</strong>.
      </p>
      <ButtonGroup>
        <Button onClick={callApi} color="primary" className="mt-5">
          Get Public Message
        </Button>
        <Button onClick={orderPizza} color="primary" className="mt-5">
          Order My Pizza
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

export default OrderPizzaApi;