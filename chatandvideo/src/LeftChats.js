import React from "react";
import "./LeftChats.css";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useBetween } from "use-between";
import { useShareableState } from "./Leftpart.js";

function LeftChats({ id, name, addProp }) {
  let { rooms, setRooms, count, setCount } = useBetween(useShareableState);
  const createChat = () => {
    const roomName = prompt("Введіть назву чатіку");
    if (roomName) {
      // alert(`RoomName: ${roomName}`);
      // створити в firebase базу і пушити сюди її
      let newRoom = {
        id: count,
        name: roomName,
      };
      rooms.push(newRoom);
      count = count + 1;
      setCount(count);
      setRooms(rooms);
      console.log(rooms);
    }
  };
  return !addProp ? (
    <Link to={`/rooms/${id}`}>
      <div className="leftpart_chat">
        <Avatar />
        <div className="leftpartChat_info">
          <h2>{name}</h2>
          <p>Останнє повідомлення</p>
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
