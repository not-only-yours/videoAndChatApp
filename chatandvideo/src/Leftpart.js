import React from "react";
import "./Leftpart.css";
import { IconButton } from "@material-ui/core";
import AccessibleIcon from "@material-ui/icons/Accessible";
import SearchIcon from "@material-ui/icons/Search";
import InfoIcon from "@material-ui/icons/Info";
import LeftChats from "./LeftChats";
import { useStateValue } from "./StateProvider";
import { refreshDB } from "./service";

function Leftpart() {
  const [rooms, setRooms] = React.useState([]);
  const [{ user }, dispatch] = useStateValue();

  React.useEffect(() => {
    return refreshDB(setRooms);
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
        <LeftChats addProp />
        {rooms.map((room) => (
          <LeftChats key={room.id} id={room.id} name={room.data.name} />
        ))}
      </div>
    </div>
  );
}

export default Leftpart;
