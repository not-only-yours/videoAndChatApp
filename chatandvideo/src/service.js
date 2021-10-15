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
      message: `${user} connected to the video Room. You can join him by clicking the icon`,
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
    name: user.displayName,
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

export function createRoom(roomName) {
  db.collection("rooms").add({
    name: roomName,
  });
}

export function refreshDB(setRooms) {
  db.collection("rooms").onSnapshot((snapshot) =>
    setRooms(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
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
  console.log(
    db
      .collection("users-roles")
      .where("login", "==", login)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          //testlogin
          //testpassword
          console.log(doc.data().password, "==", pass);
          if (doc.data().password === pass) {
            dispatch({
              type: actionTypes.SET_USER,
              user: doc.data(),
            });
          }
        });
      })
  );
}
