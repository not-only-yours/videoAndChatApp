import React from "react";
import "./Login.css";
import { Button } from "@material-ui/core";
import { signIn } from "./service";

function Login() {
  const sp = require("./StateProvider");
  const [{}, dispatch] = sp.useStateValue();
  return (
    <div className="login">
      <div className="login_container">
        <img
          src="https://img.icons8.com/clouds/100/000000/google-logo.png"
          alt="google"
        />
        <div className="login_text">
          <h1>Sign in to Google</h1>
        </div>
        <Button type="submit" onClick={signIn(dispatch)}>
          Sign in With Google
        </Button>
      </div>
    </div>
  );
}

export default Login;
