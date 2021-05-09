import { twillioConnect } from "./Autorization";
const re = require("react");

function Video() {
  const sp = require("./StateProvider");
  const [{ token }, dispatchToken] = sp.useStateValue();
  const [{ roomName }, dispatchRoomName] = sp.useStateValue();
  const localVidRef = re.useRef();
  const remoteVidRef = re.useRef();

  re.useEffect(() => twillioConnect(token, roomName, localVidRef, remoteVidRef), [
    token,
  ]);

  return (
    <div>
      <div ref={localVidRef} />
      <div ref={remoteVidRef} />
    </div>
  );
}

export default Video;
