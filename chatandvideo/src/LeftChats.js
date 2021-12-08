import React from "react";
import "./LeftChats.css";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { getRoomRoles, getUserRoles, isProperties } from "./service";

function LeftChats({ id, name, userId }) {
  const [messages, setMessages] = React.useState("");
  const [userRoles, setRoles] = React.useState([]);
  const [roomRoles, setRolesR] = React.useState([]);

  React.useEffect(async () => {
    //console.log(userId);
    const roomRole = await getRoomRoles(id);
    setRolesR(roomRole);
    const userRole = await getUserRoles(userId);
    if (userRole.length === 0) {
      userRole.push({
        id: "GoogleLog",
        role: "main role",
      });
    }
    setRoles(userRole);
  }, [id]);

  return (
    <div>
      {isProperties(userRoles, roomRoles) && (
        <Link to={`/rooms/${id}`}>
          <div className="leftpart_chat">
            <Avatar />
            <div className="leftpartChat_info">
              <h2>{name}</h2>
              <p>{messages[0]?.message}</p>
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}

export default LeftChats;
