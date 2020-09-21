import React, { useState } from "react";
import { Button, ButtonGroup, Container } from "react-bootstrap";
import { Highlight, Loading } from "../components";
import { useAuth0 } from "@auth0/auth0-react";

  export const getGender = async () => {
    const [message, setMessage] = useState("");
    const { getAccessTokenSilently } = useAuth0();
    
    try {
      const token = await getAccessTokenSilently();
  
      const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const responseData = await response.json();
  
      setMessage(responseData);
    } catch (error) {
      setMessage(error.message);
    }
  };

  export default GetGender;