import { tC } from './authService';
import React from 'react';

import { Button } from '@material-ui/core';
import { vid } from './service';
const re = require('react');

function Video() {
  const sp = require('./StateProvider');
  const [{ token, roomName }, dispatch] = sp.useStateValue();
  const lVR = re.useRef();
  const rVR = re.useRef();
  const [roomState, setRoomState] = React.useState([]);
  re.useEffect(() => tC(token, roomName, lVR, rVR, setRoomState), [token]);

  return (
    <div>
      <p className="roomName">{roomName}</p>
      <div ref={lVR} />
      <div ref={rVR} />
      <div className="exitButton">
        <Button
          className="exitButton"
          type="submit"
          onClick={vid(dispatch, roomState)}
        >
          Exit
        </Button>
      </div>
    </div>
  );
}

export default Video;
