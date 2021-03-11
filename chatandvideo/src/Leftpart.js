import React from "react";
import "./Leftpart.css";
import { IconButton } from "@material-ui/core";
import AccessibleIcon from "@material-ui/icons/Accessible";
import SearchIcon from "@material-ui/icons/Search";
import InfoIcon from "@material-ui/icons/Info";

function Leftpart() {
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
        <h1>Chat</h1>
        <h1>Chat</h1>
        <h1>Chat</h1>
        <h1>Chat</h1>
        <h1>Chat</h1>
        <h1>Chat</h1>
        <h1>Chat</h1>
      </div>
    </div>
  );
}

export default Leftpart;
