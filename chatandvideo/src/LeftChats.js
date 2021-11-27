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
  //isProperties(roomRoles, userRoles, !addProp)
  //);

  // React.useEffect(() => {
  //   getRoomRoles(roomRoles, id, setRolesR).then(() => {
  //     getUserRoles(userRoles, userId, setRoles).then(() => {
  //       idExists(id, setMessages).then(() => {
  //         setAnswerVal(answer(roomRoles, userRoles, addProp, id, name, messages));
  //         console.log(userRoles);
  //         console.log(roomRoles);
  //         console.log("answer:", answerVal);
  //       });
  //     });
  //   });
  //   //setProperties(isProperties(roomRoles, userRoles, !addProp));
  // }, [id]);
  React.useEffect(async () => {
    const roomRole = await getRoomRoles(id);
    //console.log(!roomRoles.find((x) => x.id === roomRole.id));
    //console.log(roomRole.id);
    if (!isInArray(roomRoles, roomRole)) {
      const buff = roomRoles.push(roomRole);
      setRolesR(buff);
      //console.log(roomRole);
      console.log(roomRoles);
    }
    const userRole = await getUserRoles(userId);
    //console.log(!userRoles.find((x) => x.id === userRole.id));
    if (!isInArray(userRoles, userRole)) {
      //console.log(buff);
      const buff = userRoles.push(userRole);
      setRoles(buff);
      //console.log(userRole);
      console.log(userRoles);
    }

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

  //console.log("roomRoles", roomRoles);

  return (
    <div>
      {isProperties(roomRoles, userRoles) && (
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

const getUserRoles = (userId) =>
  new Promise((resolve, reject) => {
    db.collection("users-roles")
      .doc(userId)
      .collection("roles")
      .orderBy("role", "asc")
      .onSnapshot((snapshot) => {
        // eslint-disable-next-line array-callback-return
        snapshot.docs.map((doc) => {
          resolve({
            id: doc.id,
            role: doc.data().role,
          });
          //console.log(element);
        });
      });
  });

const getRoomRoles = (userId) =>
  new Promise((resolve, reject) => {
    db.collection("rooms")
      .doc(userId)
      .collection("roles")
      .orderBy("role", "asc")
      .onSnapshot((snapshot) => {
        // eslint-disable-next-line array-callback-return
        snapshot.docs.map((doc) => {
          resolve({
            id: doc.id,
            role: doc.data().role,
          });
        });
      });
  });

function currentChecker(userRole, roomRole) {
  return userRole.role.toString() === roomRole.role.toString();
}

function isProperties(userRoles, roomRoles) {
  if (userRoles.role && roomRoles.role) {
    console.log(
      "U:",
      userRoles.role,
      "R:",
      roomRoles.role,
      "addprop: ",
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

const isInArray = (arr, elem) => {
  //console.log(arr, elem);
  if (arr) {
    arr.forEach((el) => {
      if (el === elem) {
        return true;
      }
    });
  }
  return false;
};
