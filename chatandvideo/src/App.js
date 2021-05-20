import "./App.css";
import React from "react";
import Leftpart from "./Leftpart";
import Chat from "./Chat";
import Login from "./Login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Video from "./video";
import "./video.css";

function App() {
  const sp = require("./StateProvider");
  const [{ user, token }, dispatch] = sp.useStateValue();

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : !token ? (
        <div className="app_body">
          <Router>
            <Leftpart />
            <Switch>
              <Route path="/rooms/:roomId">
                <Chat />
              </Route>
              <Route path="/">
                <Chat />
              </Route>
            </Switch>
          </Router>
        </div>
      ) : (
        <Video />
      )}
    </div>
  );
}

export default App;
