import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const logo = "https://i.ibb.co/x3Dk0LK/pizza42-Logo.png";
const styleLogo = {
  width: "20em",
}
const Hero = () => {
  const { user } = useAuth0();

  return (
    <div className="text-center hero my-5">
      <img className="mb-3" src={logo} alt="Pizza42 logo" style={styleLogo} />
      <h1 className="mb-4">Pizza 42 Web Application</h1>

      <p className="lead">
        {user ? `Hi ${user.name}, ` : null}
        This is a sample application that will pretend to order you pizza using{" "}
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://auth0.com/docs/quickstart/spa/react"
        >
          React.js
      </a>
      </p>
    </div>
  );
};

export default Hero;
