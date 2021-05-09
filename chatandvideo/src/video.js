import { twillioConnect } from "./Autorization";
const re = require("react");

function Video({ token, videoRoomName }) {
  const localVidRef = re.useRef();
  const remoteVidRef = re.useRef();

  re.useEffect(
    () => twillioConnect(token, videoRoomName, localVidRef, remoteVidRef),
    [token]
  );

  return (
    <div>
      <div ref={localVidRef} />
      <div ref={remoteVidRef} />
    </div>
  );
}

export default Video;
