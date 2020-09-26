import React, { useState } from "react";
import { Button, ButtonGroup, Container, Modal } from "react-bootstrap";
import { Highlight } from "../components";
import { useAuth0 } from "@auth0/auth0-react";
import { logger } from "../utils/logger-helper";

export const OrderPizzaApi = () => {
  const [message, setMessage] = useState("");
  // const { handleShowModal, handleCloseModal } = BetterModal();
  const apiUrl = (process.env.REACT_APP_RUNNING_LOCALLY) ? process.env.REACT_APP_API_URL_LOCAL : process.env.REACT_APP_API_URL;
  const { user, getAccessTokenSilently } = useAuth0();

  //the Modals
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Default Title");
  const [modalMessage, setModalMessage] = useState("Default Message");
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  //the modal

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
        setModalTitle("Pizza Ordered");
        setModalMessage(`Thanks ${user.name}, your pizza has been ordered.\nHave a nice day!`);
        handleShowModal();

      } catch (error) {
        setMessage(error.message);
      }
    } else {
      responseData = "You must first verify your email address.";
      setModalTitle("Unverified Email Address");
      setModalMessage("You must first verify your email address.");
      handleShowModal();
      //modalMessage = "You must first verify your email address.";
    }
    setMessage();
  };

  return (
    <Container className="mb-5">
      <h1>Pizza Ordering</h1>
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
          <Button variant="primary" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrderPizzaApi;