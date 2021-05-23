import React from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import { VideoCall } from "@material-ui/icons";

function Chat() {
  const serv = require("./service");
  const rdom = require("react-router-dom");
  const sp = require("./StateProvider");
  const [input, setInput] = React.useState("");
  const [roomName, setRoomName] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [{ user }, dispatch] = sp.useStateValue();
  const { roomId } = rdom.useParams();

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      serv.send(user.displayName, dispatch).then(() => {
        serv.jwtExists(roomId, user.displayName);
      });
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    if (roomId) {
      serv.roomNameExists(roomId, dispatch, setRoomName, setMessages);
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
        {messages.mymap((message) => (
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
