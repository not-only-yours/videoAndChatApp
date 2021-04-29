import "./App.css";
import Leftpart from "./Leftpart";
import Chat from "./Chat";
import Login from "./Login";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useState } from "react";
import { useStateValue } from "./StateProvider";
import Video from "./video";
import "./video.css";
function App() {
  const [{ user }, dispatch] = useStateValue();
  const [token, setToken] = useState(false);
  const [videoName, setVideoName] = useState("");

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
                <Chat storeToken={setToken} videoRoomName={setVideoName} />
              </Route>
              <Route path="/">
                <Chat storeToken={setToken} videoRoomName={setVideoName} />
              </Route>
            </Switch>
          </Router>
        </div>
      ) : (
        <Video token={token} videoRoomName={videoName} />
      )}
    </div>
  );
}

export default App;
