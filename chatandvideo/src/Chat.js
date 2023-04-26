import React from 'react';
import './Chat.css';
import { Avatar, IconButton } from '@material-ui/core';
import { VideoCall } from '@material-ui/icons';

function Chat() {
  const serv = require('./service');
  const rdom = require('react-router-dom');
  const sp = require('./StateProvider');
  const [input, setInput] = React.useState('');
  const [roomName, setRoomName] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const [{ user }, dispatch] = sp.useStateValue();
  const { roomId } = rdom.useParams();
  //console.log("I`m in Chat");
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
    if (!user.displayName) {
      user.displayName = user.name;
    }
    console.log('User:', user.displayName);
  }, [dispatch, roomId, serv, user]);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log(roomId, input, user);
    serv.sendMessageFun(roomId, input, user);

    console.log(input);

    setInput('');
  };

  const generateHeader = () => {
    const date = new Date(
      messages[messages.length - 1]?.timestamp?.toDate()
    ).toUTCString();

    return roomName ? (
      <div className="chat_header">
        <Avatar />
        <div className="chat_headerInfo">
          <h3>{roomName}</h3>
          <p>Last seen {date}</p>
        </div>
        <div className="chat_headerRight">
          <IconButton onClick={handleSubmit}>
            <VideoCall />
          </IconButton>
        </div>
      </div>
    ) : (
      <div className="chat_header">
        <div className="chat_headerInfo">
          <h3>Welcome to VideoChat. Choice chat</h3>
        </div>
      </div>
    );
  };

  const generateFooter = () => {
    return roomName ? (
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
    ) : (
      <div />
    );
  };

  return (
    <div className="chat">
      {generateHeader()}
      <div className="chat_body">
        {messages.map((message) => (
          <p
            className={`chat_message ${
              message.name === user.displayName && 'chat_reciever'
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
      {generateFooter()}
    </div>
  );
}

export default Chat;
