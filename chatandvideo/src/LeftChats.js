import React from "react";
import "./LeftChats.css";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { createRoom, idExists } from "./service";
import db from "./firebase";
import firebase from "./firebase";

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

export const getUserRoles = (userId) =>
  new Promise((resolve, reject) => {
    db.collection("users-roles")
      .doc(userId)
      .collection("roles")
      .orderBy("role", "asc")
      .onSnapshot((snapshot) => {
        let bufferArray = [];
        // eslint-disable-next-line array-callback-return
        snapshot.docs.map((doc) => {
          bufferArray.push({
            id: doc.id,
            role: doc.data().role,
          });
          //console.log(element);
        });
        resolve(bufferArray);
      });
  });

const getRoomRoles = (userId) =>
  new Promise((resolve, reject) => {
    db.collection("rooms")
      .doc(userId)
      .collection("roles")
      .orderBy("role", "asc")
      .onSnapshot((snapshot) => {
        let bufferArray = [];
        // eslint-disable-next-line array-callback-return
        snapshot.docs.map((doc) => {
          bufferArray.push({
            id: doc.id,
            role: doc.data().role,
          });
        });
        resolve(bufferArray);
      });
  });

function currentChecker(userRole, roomRole) {
  //console.log("U: ", userRole, "R: ", roomRole);
  return userRole.role.toString() === roomRole.role.toString();
}

function isProperties(userRoles, roomRoles) {
  if (userRoles.length > 0 && roomRoles.length > 0) {
    for (let Urole in userRoles) {
      for (let Rrole in roomRoles) {
        //console.log(Urole, Rrole);
        if (currentChecker(userRoles[Urole], roomRoles[Rrole])) {
          return true;
        }
      }
    }
  } else {
    return false;
  }
}
