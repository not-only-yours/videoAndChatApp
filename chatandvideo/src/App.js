import "./App.css";
import Leftpart from "./Leftpart";
import Chat from "./Chat";
import Login from "./Login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
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
      )}
    </div>
  );
}

export default App;
