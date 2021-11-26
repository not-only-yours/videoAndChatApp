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
  const [answerVal, setAnswerVal] = React.useState("");
  //const [properties, setProperties] = React.useState(
  //isProperties(roomRoles, userRoles, !addProp)
  //);

  React.useEffect(async () => {
    const roomRoles = getRoomRoles(id)
    setRolesR(roomRoles)
    const userRoles = getUserRoles(userId)
    setRoles(userRoles)
    
//     getRoomRoles(roomRoles, id, setRolesR).then(() => {
//       getUserRoles(userRoles, userId, setRoles).then(() => {
//         idExists(id, setMessages).then(() => {
//           setAnswerVal(answer(roomRoles, userRoles, addProp, id, name, messages));
//           console.log(userRoles);
//           console.log(roomRoles);
//           console.log("answer:", answerVal);
//         });
//       });
//     });
    //setProperties(isProperties(roomRoles, userRoles, !addProp));
  }, [id]);
  //console.log("properties: ", !addProp);
  /*eslint-disable */
    //console.log("is: ", isProperties(roomRoles, userRoles, !addProp), "result: ", properties,"time: ",new Date().getTime())
//            console.log("vivozu")
//             return answerVal
  
  console.log('roomRoles', roomRoles)
  
  return (
    <div>{roomRoles.length}</div>
  )
    /*eslint-enable */
}

export default LeftChats;

const answer = (roomRoles, userRoles, addProp, id, name, messages) => {
  if (isProperties(roomRoles, userRoles, !addProp)) {
    return (
      <Link to={`/rooms/${id}`}>
        <div className="leftpart_chat">
          <Avatar />
          <div className="leftpartChat_info">
            <h2>{name}</h2>
            <p>{messages[0]?.message}</p>
          </div>
        </div>
      </Link>
    );
  } else {
    return <div />;
  }
};

const getUserRoles = (userRoles, userId, setRoles) =>
  new Promise((resolve, reject) => {
    resolve(
      db
        .collection("users-roles")
        .doc(userId)
        .collection("roles")
        .orderBy("role", "asc")
        .onSnapshot((snapshot) => {
          // eslint-disable-next-line array-callback-return
          snapshot.docs.map((doc) => {
            let element = {
              id: doc.id,
              role: doc.data().role,
            };
            //console.log(element);
            if (!userRoles.includes(element)) {
              setRoles((role) => [...role, element]);
            }
          });
        })
    );
  });

const getRoomRoles = (roomRoles, userId, setRoles) =>
  new Promise((resolve, reject) => {
    resolve(
      db
        .collection("rooms")
        .doc(userId)
        .collection("roles")
        .orderBy("role", "asc")
        .onSnapshot((snapshot) => {
          // eslint-disable-next-line array-callback-return
          snapshot.docs.map((doc) => {
            let element = {
              id: doc.id,
              role: doc.data().role,
            };
            //console.log(element);
            if (!roomRoles.includes(element)) {
              setRoles((roomRoles) => [...roomRoles, element]);
            }
          });
        })
    );
  });

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
    userRoles.forEach((Urole) => {
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
