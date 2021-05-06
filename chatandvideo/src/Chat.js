import React from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import { VideoCall } from "@material-ui/icons";
const rdom = require("react-router-dom");
const serv = require("./service");
const sp = require("./StateProvider");

function Chat({ storeToken, videoRoomName }) {
  const [input, setInput] = React.useState("");
  const [roomName, setRoomName] = React.useState("");
  const { roomId } = rdom.useParams();
  const [messages, setMessages] = React.useState([]);
  const [{ user }, dispatch] = sp.useStateValue();

  const handleSubmit = async (event) => {
    event.preventDefault();
    serv
      .send(user.displayName)
      .then((response) => response.json())
      .then((response) => {
        const jwt = response;

        storeToken(jwt);
        console.log(jwt);
        if (jwt) {
          serv.jwtExists(roomId, user.displayName);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  React.useEffect(() => {
    if (roomId) {
      serv.roomNameExists(roomId, videoRoomName, setRoomName, setMessages);
    }
  }, [roomId]);

  const sendMessage = (e) => {
    e.preventDefault();

    serv.sendMessageFun(roomId, input, user);

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
          <button onClick={sendMessage} type="submit" id="button">
            Send a message
          </button>
        </form>
      </div>
    </div>
  );
}

export default Chat;
