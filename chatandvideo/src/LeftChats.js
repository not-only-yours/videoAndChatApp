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
    setRolesR(roomRole);
    //console.log(roomRole);
    console.log(Array.isArray(roomRoles), roomRoles);
    const userRole = await getUserRoles(userId);
    if (userRole.length === 0) {
      userRole.push({
        id: "GoogleLog",
        role: "main role",
      });
    }
    //console.log(!userRoles.find((x) => x.id === userRole.id));
    //console.log(buff);
    setRoles(userRole);
    //console.log(userRole);
    console.log(Array.isArray(userRoles), userRoles);

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

const getUserRoles = (userId) =>
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
  console.log("U: ", userRole, "R: ", roomRole);
  return userRole.role.toString() === roomRole.role.toString();
}

function isProperties(userRoles, roomRoles) {
  console.log(userRoles, roomRoles);
  if (userRoles.length > 0 && roomRoles.length > 0) {
    // console.log(
    //   "U:",
    //   typeof userRoles,
    //   "R:",
    //   typeof roomRoles,
    //   "time: ",
    //   new Date().getTime()
    // );
    for (let Urole in userRoles) {
      for (let Rrole in roomRoles) {
        console.log(Urole, Rrole);
        if (currentChecker(userRoles[Urole], roomRoles[Rrole])) {
          return true;
        }
      }
    }
  } else {
    return false;
  }
}

const isInArray = (arr, elem) => {
  //console.log(arr, elem);
  if (arr) {
    for (let el in arr) {
      if (el === elem) {
        return true;
      }
    }
  }
  return false;
};
