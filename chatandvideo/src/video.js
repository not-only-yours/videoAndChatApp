import { twillioConnect } from "./service";

function Video({ token, videoRoomName }) {
  const re = require("react");
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
