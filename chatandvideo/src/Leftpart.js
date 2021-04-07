import React, { useState, useEffect } from "react";
import "./Leftpart.css";
import { IconButton } from "@material-ui/core";
import AccessibleIcon from "@material-ui/icons/Accessible";
import SearchIcon from "@material-ui/icons/Search";
import InfoIcon from "@material-ui/icons/Info";
import LeftChats from "./LeftChats";
import { useBetween } from "use-between";

export const useShareableState = () => {
  const [rooms, setRooms] = useState([
    {
      id: 1,
      name: "Chat1",
    },
    {
      id: 2,
      name: "Chat2",
    },
  ]);
  const [count, setCount] = useState(3);
  return {
    rooms,
    setRooms,
    count,
    setCount,
  };
};

function Leftpart() {
  const { rooms } = useBetween(useShareableState);
  return (
    <div className="leftpart">
      <div className="leftpart_header">
        <AccessibleIcon />
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
        <LeftChats addProp />
        {rooms.map((room) => (
          <LeftChats key={room.id} id={room.id} name={room.name} />
        ))}
      </div>
    </div>
  );
}

export default Leftpart;
