import React, { useContext } from "react";
import "./HomeHeader.css";
import Link from "react-scroll/modules/components/Link";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@mui/material";
import BgImage from "../../../assets/backgroundEvents.jpeg";
import { AuthContext, AuthContextType } from "../../../AuthProvider";

export default function HomeHeader() {
  const { logged } = useContext(AuthContext) as AuthContextType;
  return (
    <div className="header-container">
      <img className="bg-image" alt="headerBackground" src={BgImage}></img>

      <h1>The Time Machine</h1>
      <p>Keep track of your time</p>
      <div className="header-btns">
        <Button className="btns"></Button>
        {!logged && (
          <RouterLink to="/login">
            <Button className="btns contained" variant="contained">
              Get Started
            </Button>
          </RouterLink>
        )}
        {logged && (
          <RouterLink to="/dashboard">
            <Button className="btns contained" variant="contained">
              Get Started
            </Button>
          </RouterLink>
        )}
        <Link to="contact" smooth>
          <Button className="btns outlined" variant="outlined">
            CONTACT US
          </Button>
        </Link>
      </div>
    </div>
  );
}
