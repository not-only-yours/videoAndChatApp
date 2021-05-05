import React from "react";
import { useParams } from "react-router-dom";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import { VideoCall } from "@material-ui/icons";
import { send, jwtExists, roomNameExists, sendMessageFun } from "./service";

function Chat({ storeToken, videoRoomName }) {
  const sp = require("./StateProvider");
  const [input, setInput] = React.useState("");
  const [roomName, setRoomName] = React.useState("");
  const { roomId } = useParams();
  const [messages, setMessages] = React.useState([]);
  const [{ user }, dispatch] = sp.useStateValue();

  const handleSubmit = async (event) => {
    event.preventDefault();
    send(user.displayName).then((result) => {
      const jwt = result.data;

      storeToken(jwt);
      console.log(jwt);
      if (jwt) {
        jwtExists(roomId, user.displayName);
      }
    });
  };

  React.useEffect(() => {
    if (roomId) {
      roomNameExists(roomId, videoRoomName, setRoomName, setMessages);
    }
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();

    sendMessageFun(roomId, input, user);

    console.log(input);

    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat_header">
        <Avatar />
        <div className="chat_headerInfo">
          <h3>{roomName}</h3>
          <p>
            Last seen{" "}
            {new Date(
              messages[messages.length - 1]?.timestamp?.toDate()
            ).toUTCString()}
          </p>
        </div>
        <div className="chat_headerRight">
          <IconButton onClick={handleSubmit}>
            <VideoCall />
          </IconButton>
        </div>
      </div>
      <div className="chat_body">
        {messages.map((message) => (
          <p
            className={`chat_message ${
              message.name === user.displayName && "chat_reciever"
            }`}
          >
            <span className="chat_name">{message.name}</span>
            {message.message}
            <span className="chat_timestamp">
              {new Date(message.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}
      </div>
      <div className="chat_footer">
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message..."
          />
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
