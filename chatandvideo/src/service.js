import db, { auth, provider } from "./firebase";
import firebase from "firebase";
import axios from "axios";
import { actionTypes } from "./reducer";

export function jwtExists(roomId, user) {
  db.collection("rooms")
    .doc(roomId)
    .collection("messages")
    .add({
      message: `${user} connected to the video Room. You can join him by clicking the icon`,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
}

export function roomNameExists(roomId, videoRoomName, setRoomName, setMessages) {
  db.collection("rooms")
    .doc(roomId)
    .onSnapshot((snapshot) => {
      setRoomName(snapshot.data().name);
      videoRoomName(snapshot.data().name);
    });

  db.collection("rooms")
    .doc(roomId)
    .collection("messages")
    .orderBy("timestamp", "asc")
    .onSnapshot((snapshot) => setMessages(snapshot.docs.map((doc) => doc.data())));
}

export function sendMessageFun(roomId, input, user) {
  db.collection("rooms").doc(roomId).collection("messages").add({
    message: input,
    name: user.displayName,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

export const send = async (user) => {
  return axios({
    method: "POST",
    url: "https://shadow-wolf-1476.twil.io/create-token",
    data: {
      identity: user,
    },
  });
};

export function idExists(id, setMessages) {
  db.collection("rooms")
    .doc(id)
    .collection("messages")
    .orderBy("timestamp", "desc")
    .onSnapshot((snapshot) => setMessages(snapshot.docs.map((doc) => doc.data())));
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

export function signIn(dispatch) {
  return () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        dispatch({
          type: actionTypes.SET_USER,
          user: result.user,
        });
      })
      .catch((error) => alert(error.message));
  };
}
