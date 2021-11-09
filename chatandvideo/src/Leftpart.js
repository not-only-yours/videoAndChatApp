import React from "react";
import "./Leftpart.css";
import { IconButton } from "@material-ui/core";
import AccessibleIcon from "@material-ui/icons/Accessible";
import SearchIcon from "@material-ui/icons/Search";
import InfoIcon from "@material-ui/icons/Info";
import LeftChats from "./LeftChats";
import { createRoom } from "./service";

function Leftpart() {
  const serv = require("./service");
  const sp = require("./StateProvider");
  const [rooms, setRooms] = React.useState([]);
  const [{ user }, dispatch] = sp.useStateValue();

  React.useEffect(() => {
    return serv.refreshDB(setRooms);
  }, []);
  return (
    <div className="leftpart">
      <div className="leftpart_header">
        <AccessibleIcon src={user?.photoURL} />
        <div className="leftpart_headerRight">
          <IconButton>
            <SearchIcon />
          </IconButton>
          <IconButton>
            <InfoIcon />
          </IconButton>
        </div>
      </div>
      <div className="leftpart_search">
        <div className="leftpart_searchContainer">
          <SearchIcon />
          <input type="text" placeholder="Print here dude" />
        </div>
      </div>
      <div className="leftpart_chats">
        <div onClick={createChat} className="leftpart_chat">
          <h2>Добавити новий чатік</h2>
        </div>
        {rooms.map((room) => (
          <LeftChats
            key={room.id}
            id={room.id}
            name={room.data.name}
            userId={user.id}
          />
        ))}
      </div>
    </div>
  );
}

export default Leftpart;

const createChat = () => {
  const roomName = prompt("Введіть назву чатіку");
  if (roomName) {
    // alert(`RoomName: ${roomName}`);
    // створити в firebase базу і пушити сюди її
    //TODO: сделать отдельное view для выбора ролей из отдельной таблицы
    createRoom(roomName, ["main role", "second role"]);
  }
};
