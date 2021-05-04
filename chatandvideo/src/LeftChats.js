import React from "react";
import "./LeftChats.css";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { createRoom, idExists } from "./service";

function LeftChats({ id, name, addProp }) {
  const [messages, setMessages] = React.useState("");
  React.useEffect(() => {
    if (id) {
      idExists(id, setMessages);
    }
  }, [id]);
  const createChat = () => {
    const roomName = prompt("Введіть назву чатіку");
    if (roomName) {
      // alert(`RoomName: ${roomName}`);
      // створити в firebase базу і пушити сюди її
      createRoom(roomName);
    }
  };
  return !addProp ? (
    <Link to={`/rooms/${id}`}>
      <div className="leftpart_chat">
        <Avatar />
        <div className="leftpartChat_info">
          <h2>{name}</h2>
          <p>{messages[0]?.message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="leftpart_chat">
      <h2>Добавити новий чатік</h2>
    </div>
  );
}

export default LeftChats;
