import React from "react";
import "./LeftChats.css";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { createRoom, idExists } from "./service";
import db from "./firebase";

function LeftChats({ id, name, addProp, userId }) {
  const [messages, setMessages] = React.useState("");
  const [userRoles, setRoles] = React.useState("");
  const [roomRoles, setRolesR] = React.useState("");
  React.useEffect(() => {
    if (id) {
      idExists(id, setMessages);
      getRoomRoles(id, setRolesR);
    }
    if (userId) {
      getUserRoles(userId, setRoles);
    }
  }, [id]);
  const ans = isProperties(roomRoles, userRoles);
  console.log("properties: ", !addProp);
  /*eslint-disable */
  return !addProp && ans ? (
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
      <div/>
        )
    /*eslint-enable */
}
export default LeftChats;

function getUserRoles(userId, setRoles) {
  db.collection("users-roles")
    .doc(userId)
    .collection("roles")
    .orderBy("role", "asc")
    .onSnapshot((snapshot) => {
      snapshot.docs.map((doc) =>
        setRoles({
          id: doc.id,
          role: doc.data().role,
        })
      );
    });
}

function getRoomRoles(userId, setRoles) {
  db.collection("rooms")
    .doc(userId)
    .collection("roles")
    .orderBy("role", "asc")
    .onSnapshot((snapshot) => {
      snapshot.docs.map((doc) =>
        setRoles({
          id: doc.id,
          role: doc.data().role,
        })
      );
    });
}

function isProperties(userRoles, roomRoles) {
  if (userRoles.role && roomRoles.role) {
    console.log("U:", userRoles.role, "R:", roomRoles.role);
    console.log(
      "is props: ",
      userRoles.role.toString() === roomRoles.role.toString()
    );
    return userRoles.role.toString() === roomRoles.role.toString();
  } else {
    return false;
  }
}
