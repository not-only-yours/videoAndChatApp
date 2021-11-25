import db, { auth, provider } from "./firebase";
import firebase from "firebase";
import axios from "axios";
import { actionTypes } from "./reducer";
import TwilioVideo from "twilio-video";
import { collection, query, where } from "firebase/firestore";
import React from "react";

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
  if (roomId) {
    try {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          if (snapshot.data()) {
            setRoomName(snapshot.data().name);
            dispatchRoomName({
              type: actionTypes.SET_ROOMNAME,
              roomName: snapshot.data().name,
            });
          }
        });
    } catch (error) {
      console.log("Error 1: ", error);
    }
    try {
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    } catch (error) {
      console.log("Error 2: ", error);
    }
  }
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
  let roomId;
  db.collection("rooms").add({
    name: roomName,
  });
  db.collection("rooms")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        console.log("document name: " + doc.data().name + " room name" + roomName);
        if (doc.data().name === roomName) {
          console.log(
            "used: document name: " + doc.data().name + " room name" + roomName
          );
          console.log("roomId: " + doc.id);
          roomId = doc.id;
        }
      });
    });
  console.log(roomId + " Name:" + roomName);
  roles.forEach((role) => {
    console.log(role);
    db.collection("rooms").doc(roomId).collection("roles").add({
      role: role,
    });
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
