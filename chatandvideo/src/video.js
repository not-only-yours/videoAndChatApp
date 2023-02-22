import { TwilioStop, twillioConnect } from './authService';
import { actionTypes } from './reducer';
import React from 'react';

import { Button } from '@material-ui/core';
import { vid } from './service';
const re = require('react');

function Video() {
  const sp = require('./StateProvider');
  const [{ token, roomName }, dispatch] = sp.useStateValue();
  const lVRef = re.useRef();
  const rVidRef = re.useRef();
  const [roomState, setRoomState] = React.useState([]);
  re.useEffect(
    () => twillioConnect(token, roomName, lVRef, rVidRef, setRoomState),
    [token]
  );

  return (
    <div>
      <p className="roomName">{roomName}</p>
      <div ref={lVRef} />
      <div ref={rVidRef} />
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
