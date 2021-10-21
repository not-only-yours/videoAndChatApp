import db, { auth, provider } from "./firebase";
import firebase from "firebase";
import axios from "axios";
import { actionTypes } from "./reducer";
import TwilioVideo from "twilio-video";
import { collection, query, where } from "firebase/firestore";

export function jwtExists(roomId, user) {
  db.collection("rooms")
    .doc(roomId)
    .collection("messages")
    .add({
      message: `${user.name} connected to the video Room. You can join him by clicking the icon`,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
}

export function roomNameExists(roomId, dispatchRoomName, setRoomName, setMessages) {
  db.collection("rooms")
    .doc(roomId)
    .onSnapshot((snapshot) => {
      setRoomName(snapshot.data().name);
      dispatchRoomName({
        type: actionTypes.SET_ROOMNAME,
        roomName: snapshot.data().name,
      });
    });

  db.collection("rooms")
    .doc(roomId)
    .collection("messages")
    .orderBy("timestamp", "asc")
    .onSnapshot((snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });
}

export function sendMessageFun(roomId, input, user) {
  db.collection("rooms").doc(roomId).collection("messages").add({
    message: input,
    name: user.name,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

export const send = async (user, dispatch) => {
  return fetch("https://shadow-wolf-1476.twil.io/create-token", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      identity: user,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      dispatch({
        type: actionTypes.SET_TOKEN,
        token: response,
      });
    });
};

export function idExists(id, setMessages) {
  db.collection("rooms")
    .doc(id)
    .collection("messages")
    .orderBy("timestamp", "desc")
    .onSnapshot((snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });
}

export function createRoom(roomName, roles) {
  db.collection("rooms").add({
    name: roomName,
    roles: roles,
  });
}

export function refreshDB(setRooms) {
  db.collection("rooms").onSnapshot((snapshot) =>
    setRooms(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
        //roles: doc.data(),
      }))
    )
  );
}

export function vid(dispatchToken) {
  return () => {
    dispatchToken({
      type: actionTypes.SET_TOKEN,
      token: false,
    });
  };
}

export function checkLoginAndPass(login, pass, dispatch) {
  db.collection("users-roles")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        //console.log(doc.data().password, "==", pass);
        if (doc.data().password === pass && doc.data().login === login) {
          dispatch({
            type: actionTypes.SET_USER,
            user: {
              id: doc.id,
              name: doc.data().name,
              login: doc.data().login,
              password: doc.data().password,
            },
          });
        }
      });
    });
}

function getUserRoles(userId) {
  db.collection("users-roles")
    .doc(userId)
    .collection("roles")
    .orderBy("role", "asc")
    .onSnapshot((snapshot) => {
      snapshot.docs.map((doc) =>
        console.log({
          id: doc.id,
          role: doc.data().role,
        })
      );
    });
}

function getRoomRoles(userId) {
  db.collection("rooms")
    .doc(userId)
    .collection("roles")
    .orderBy("role", "asc")
    .onSnapshot((snapshot) => {
      snapshot.docs.map((doc) =>
        console.log({
          id: doc.id,
          role: doc.data().role,
        })
      );
    });
}

export function isProperties(userRoles, roomRoles) {
  getRoomRoles(roomRoles);
  getUserRoles(userRoles);
  return true;
}
