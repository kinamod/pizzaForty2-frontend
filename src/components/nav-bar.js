import React, { useEffect, useState } from "react";
import { NavLink as RouterNavLink } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";

import { useAuth0 } from "@auth0/auth0-react";
import LogoutButton from "./logout-button";
import LoginButton from "./login-button";
import SignUpButton from "./signup-button";
import { logger } from "../utils/logger-helper";

const MainNav = () => {
  const apiUrl = (process.env.REACT_APP_RUNNING_LOCALLY) ? process.env.REACT_APP_API_URL_LOCAL : process.env.REACT_APP_API_URL;
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  // const apiUrl = 
  useEffect(() => {
    isAdminCalc();
  });

  const isAdminCalc = async () => {
    if (!isAuthenticated) {
      logger("isAdminCalc", "You're not authenticated so I know for a FACT you're not an admin!");
      return;
    }
    try {
      logger("getUserList", "backendAPI: " + apiUrl);

      const token = await getAccessTokenSilently();

      const response = await fetch(`${apiUrl}/api/get-user-roles/${user.sub}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      const responseData = await response.json();
      logger("isAdmin", response + " : " + JSON.stringify(responseData.msg[0].name));

      setIsAdmin("PizzaAdmin" === responseData.msg[0].name);
      logger("is admin: ", isAdmin);
    } catch (error) {
      logger("isAdminCalc", error);
      setIsAdmin(false);
    }
  }
  return (
    <Nav className="mr-auto">
      <Nav.Link
        as={RouterNavLink}
        to="/"
        exact
        activeClassName="router-link-exact-active"
      >
        Home
    </Nav.Link>
      <Nav.Link
        as={RouterNavLink}
        to="/profile"
        exact
        activeClassName="router-link-exact-active"
      >
        Profile
    </Nav.Link>
      <Nav.Link
        as={RouterNavLink}
        to="/orderpizza-api"
        exact
        activeClassName="router-link-exact-active"
      >
        Order Pizza
    </Nav.Link>
      {/* {isAdmin ? */}
      {isAuthenticated && isAdmin ?
        <Nav.Link
          as={RouterNavLink}
          to="/usersinfo"
          exact
          activeClassName="router-link-exact-active"
        >
          Users' Info
    </Nav.Link> : null}
    </Nav>
  );
};

const AuthNav = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <Nav className="justify-content-end">
      {isAuthenticated ? <LogoutButton /> : <div><LoginButton /> <SignUpButton /></div>}
    </Nav>
  );
};

const NavBar = () => {
  return (
    <Navbar bg="light" expand="md">
      <Container>
        <Navbar.Brand as={RouterNavLink} className="logo" to="/" />
        <MainNav />
        <AuthNav />
      </Container>
    </Navbar>
  );
};

export default NavBar;
