import React from "react";
import "./LeftChats.css";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import { createRoom, idExists } from "./service";
import db from "./firebase";
import firebase from "./firebase";

function LeftChats({ id, name, addProp, userId }) {
  const [messages, setMessages] = React.useState("");
  const [userRoles, setRoles] = React.useState([]);
  const [roomRoles, setRolesR] = React.useState([]);
  //const [properties, setProperties] = React.useState(
  //isProperties(roomRoles, userRoles, !addProp)
  //);
  React.useEffect(() => {
    idExists(id, setMessages);
    getRoomRoles(roomRoles, id, setRolesR);
    getUserRoles(userRoles, userId, setRoles);
    //setProperties(isProperties(roomRoles, userRoles, !addProp));
    console.log(userRoles);
    console.log(roomRoles);
  }, [id]);
  //console.log("properties: ", !addProp);
  /*eslint-disable */
    //console.log("is: ", isProperties(roomRoles, userRoles, !addProp), "result: ", properties,"time: ",new Date().getTime())
    if (isProperties(roomRoles, userRoles, !addProp)) {
        return <Link to={`/rooms/${id}`}>
                    <div className="leftpart_chat">
                        <Avatar />
                        <div className="leftpartChat_info">
                            <h2>{name}</h2>
                            <p>{messages[0]?.message}</p>
                        </div>
                    </div>
        </Link>
    } else {
        return <div/>
    }
    /*eslint-enable */
}
export default LeftChats;

function getUserRoles(userRoles, userId, setRoles) {
  db.collection("users-roles")
    .doc(userId)
    .collection("roles")
    .orderBy("role", "asc")
    .onSnapshot((snapshot) => {
      snapshot.docs.map((doc) =>
        setRoles((userRoles) => [
          ...userRoles,
          {
            id: doc.id,
            role: doc.data().role,
          },
        ])
      );
    });
}

function getRoomRoles(roomRoles, userId, setRoles) {
  db.collection("rooms")
    .doc(userId)
    .collection("roles")
    .orderBy("role", "asc")
    .onSnapshot((snapshot) => {
      snapshot.docs.map((doc) => {
        setRoles((roomRoles) => [
          ...roomRoles,
          {
            id: doc.id,
            role: doc.data().role,
          },
        ]);
      });
    });
}

function currentChecker(userRole, roomRole) {
  return userRole.role.toString() === roomRole.role.toString();
}

function isProperties(userRoles, roomRoles, addprop) {
  if (userRoles.role && roomRoles.role && addprop) {
    console.log(
      "U:",
      userRoles.role,
      "R:",
      roomRoles.role,
      "addprop: ",
      addprop,
      "result: ",
      userRoles.role.toString() === roomRoles.role.toString(),
      "time: ",
      new Date().getTime()
    );
    userRoles((Urole) => {
      roomRoles.forEach((Rrole) => {
        if (currentChecker(Urole, Rrole)) {
          return true;
        }
      });
    });
  } else {
    return false;
  }
}
