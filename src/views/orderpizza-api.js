import React, { useState } from "react";
import { Button, ButtonGroup, Container, Modal } from "react-bootstrap";
import { Highlight } from "../components";
import { useAuth0 } from "@auth0/auth0-react";
import { logger } from "../utils/logger-helper";

export const OrderPizzaApi = () => {
  const [message, setMessage] = useState("");
  const apiUrl = (process.env.REACT_APP_RUNNING_LOCALLY) ? process.env.REACT_APP_API_URL_LOCAL : process.env.REACT_APP_API_URL;
  const { user, getAccessTokenSilently } = useAuth0();

  //the Modals
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Default Title");
  const [modalMessage, setModalMessage] = useState("Default Message");
  const [modalButton, setModalButton] = useState("OK");
  const [modalEmailVerified, setEmailVerified] = useState(false);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  //END the modal

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
    setEmailVerified(user.email_verified)
    if (user.email_verified) {
      try {
        const token = await getAccessTokenSilently();
        logger("orderPizza", "email verified: " + user.email_verified);
        logger("orderPizza", "token: " + token)

        const response = await fetch(`${apiUrl}/api/order-pizza`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        responseData = await response.json();
        logger("orderPizza" + responseData)
        setModalTitle("Pizza Ordered");
        if (responseData.pizzaStatus) {
          setModalMessage(`Thanks for your order ${user.name}, ${responseData.msg}!`);
        } else {
          setModalMessage(`Sorry ${user.name}, there was a problem!`);
        }
        setModalButton("Great Thanks!")
        handleShowModal();

      } catch (error) {
        setMessage(error.message);
      }
    } else {
      responseData = "You must first verify your email address.";

      setModalButton("Resend Verification Email")
      setModalTitle("Unverified Email Address");
      setModalMessage("You must first verify your email address.");
      handleShowModal();
      //modalMessage = "You must first verify your email address.";
    }
    setMessage();
  };

  return (
    <Container className="mb-5">
      <h1>Order Pizza</h1>
      <p>
        From here you can order your pizza. There is only one flavour! <strong> please </strong> be sure that you have verified your email address, else you won't be able to order.
      </p>
      <ButtonGroup>
        <Button onClick={callApi} color="primary" className="mt-5">
          Get Public Message
        </Button>
        <Button onClick={orderPizza} color="primary" className="mt-5">
          Order My Pizza
        </Button>
        {/* <Button onClick={getUserList} color="primary" className="mt-5">
          Get User List
        </Button>
        {/* Testing API call buttons
        <Button onClick={sendVerifyEmailLink} variant="secondary" className="mt-5">
          Verify Email Test
        </Button>
        <Button onClick={getFullID} variant="secondary" className="mt-5">
          Get Full ID
        </Button> */}
      </ButtonGroup>


      {message && (
        <div className="mt-5">
          <h6 className="muted">Result</h6>
          <Highlight>{JSON.stringify(message, null, 2)}</Highlight>
        </div>
      )}

      {/* Modal Section */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          {modalEmailVerified ?
            <Button variant="primary" onClick={handleCloseModal}>
              {modalButton}
            </Button>
            :
            <Button variant="primary" onClick={sendVerifyEmailLink}>
              {modalButton}
            </Button>
          }
        </Modal.Footer>
      </Modal>
    </Container>
  );

  //Functions
  async function sendVerifyEmailLink() {

    try {
      logger("verifyemail", "backendAPI: " + apiUrl);

      const token = await getAccessTokenSilently();
      logger("verifyemail", "email verified: " + user.email_verified);
      logger("verifyemail", "token: " + token)

      const response = await fetch(`${apiUrl}/api/verify-email`, {
        headers: {
          Authorization: `Bearer ${token}`,
          UserID: user.sub
        },
      });

      const responseData = await response.json();
      setMessage(responseData);
    } catch (error) {
      setMessage(error.message);
    }
  }

  // Testing functions

  // const getUserList = async () => {

  //   try {
  //     logger("getUserList", "backendAPI: " + apiUrl);

  //     const token = await getAccessTokenSilently();

  //     const response = await fetch(`${apiUrl}/api/get-user-list`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const responseData = await response.json();
  //     logger("getUserList", response + " : " + responseData);
  //     setMessage(responseData);
  //   } catch (error) {
  //     setMessage(error.message);
  //   }
  // };



  // async function getFullID() {

  //   try {
  //     logger("fullID", "backendAPI: " + apiUrl);

  //     const token = await getAccessTokenSilently();
  //     logger("fullID", "token: " + token)

  //     const response = await fetch(`${apiUrl}/api/get-full-id`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         UserID: user.sub,
  //       },
  //     });

  //     const responseData = await response.json();
  //     setMessage(responseData);
  //   } catch (error) {
  //     setMessage(error.message);
  //   }
  // }
};

export default OrderPizzaApi;

