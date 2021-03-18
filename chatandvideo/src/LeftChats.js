import React from "react";
import "./LeftChats.css";
import { Avatar } from "@material-ui/core";
import db from "./firebase";

function LeftChats({ id, name, addProp }) {
  const createChat = () => {
    const roomName = prompt("Введіть назву чатіку");
    if (roomName) {
      // alert(`RoomName: ${roomName}`);
      // створити в firebase базу і пушити сюди її
      db.collection("rooms").add({
        name: roomName,
      });
    }
  };
  return !addProp ? (
    <div className="leftpart_chat">
      <Avatar />
      <div className="leftpartChat_info">
        <h2>{name}</h2>
        <p>Останнє повідомлення</p>
      </div>
    </div>
  ) : (
    <div onClick={createChat} className="leftpart_chat">
      <h2>Добавити новий чатік</h2>
    </div>
  );
}

export default LeftChats;
