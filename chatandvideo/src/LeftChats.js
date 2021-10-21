import React from "react";
import "./LeftChats.css";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { createRoom, idExists } from "./service";
import { isProperties } from "./service";

function LeftChats({ id, name, addProp, userId }) {
  // console.log("U: ", userRoles, "\n R: ", roomRoles);
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
      //TODO: сделать отдельное view для выбора ролей из отдельной таблицы
      createRoom(roomName, new Map("main"));
    }
  };
  return !(addProp && isProperties(id, userId)) ? (
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
