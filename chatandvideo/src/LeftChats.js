import React from "react";
import "./LeftChats.css";
import { Avatar } from "@material-ui/core";

function LeftChats({ addProp }) {
  return !addProp ? (
    <div className="leftpart_chat">
      <Avatar />
      <div className="leftpartChat_info">
        <h2>Назва чату</h2>
        <p>Останнє повідомлення</p>
      </div>
    </div>
  ) : (
    <div /*onClick={createChat} */ className="leftpart_chat">
      <h2>Добавити новий чатік</h2>
    </div>
  );
}

export default LeftChats;
