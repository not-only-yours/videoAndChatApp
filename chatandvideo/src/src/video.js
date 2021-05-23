import { signIn, twillioConnect } from "./Autorization";
import { actionTypes } from "./reducer";
import React from "react";
import { vid } from "./service";
import { Button } from "@material-ui/core";
const re = require("react");

function Video() {
  const sp = require("./StateProvider");
  const [{ token, roomName }, dispatch] = sp.useStateValue();
  const localVidRef = re.useRef();
  const remoteVidRef = re.useRef();

  re.useEffect(() => twillioConnect(token, roomName, localVidRef, remoteVidRef), [
    token,
  ]);

  return (
    <div>
      <p className="roomName">{roomName}</p>
      <div ref={localVidRef} />
      <div ref={remoteVidRef} />
      <div className="exitButton">
        <Button className="exitButton" type="submit" onClick={vid(dispatch)}>
          Exit
        </Button>
      </div>
    </div>
  );
}

export default Video;
