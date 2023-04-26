import db from './firebase';
import firebase from 'firebase';
import { actionTypes } from './reducer';

export function jwtExists(roomId, user) {
  console.log(user);
  db.collection('rooms')
    .doc(roomId)
    .collection('messages')
    .add({
      message: `${user} connected to the video Room. You can join him by clicking the icon`,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
}

export function roomNameExists(rId, dspRName, setRName, setMsg) {
  if (rId) {
    try {
      db.collection('rooms')
        .doc(rId)
        .onSnapshot((snapshot) => {
          if (snapshot.data()) {
            setRName(snapshot.data().name);
            dspRName({
              type: actionTypes.SET_ROOMNAME,
              roomName: snapshot.data().name,
            });
          }
        });
    } catch (error) {
      console.log('Error 1: ', error);
    }
    try {
      db.collection('rooms')
        .doc(rId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot((snapshot) => {
          setMsg(snapshot.docs.map((doc) => doc.data()));
        });
    } catch (error) {
      console.log('Error 2: ', error);
    }
  }
}

export function sendMessageFun(roomId, input, user) {
  console.log({
    message: input,
    name: user.displayName,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
  db.collection('rooms').doc(roomId).collection('messages').add({
    message: input,
    name: user.displayName,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

export const send = async (user, dispatch) => {
  return fetch('https://shadow-wolf-1476.twil.io/create-token', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
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

export const idExists = (id, setMessages) => {
  db.collection('rooms')
    .doc(id)
    .collection('messages')
    .orderBy('timestamp', 'desc')
    .onSnapshot((snapshot) => {
      setMessages(snapshot.docs.map((doc) => doc.data()));
    });
};

export function createRoom(roomName, roles) {
  let roomId;
  db.collection('rooms').add({
    name: roomName,
  });
  db.collection('rooms')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        if (doc.data().name === roomName) {
          console.log('roomId: ' + doc.id);
          roomId = doc.id;
        }
      });
    })
    .then(() => {
      roles.forEach((role) => {
        console.log(role);
        db.collection('rooms').doc(roomId).collection('roles').add({
          role: role,
        });
      });
      alert('Room created!');
    });
}

export function refreshDB(setRooms) {
  db.collection('rooms').onSnapshot((snapshot) =>
    setRooms(
      snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
        //roles: doc.data(),
      }))
    )
  );
}

export function vid(dispatchToken, RoomState) {
  return () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    RoomState.disconnect();
    dispatchToken({
      type: actionTypes.SET_TOKEN,
      token: false,
    });
  };
}

export function checkLoginAndPass(login, pass, dispatch) {
  db.collection('users-roles')
    .get()
    .then((querySnapshot) => {
      let checker = true;
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
              roles: [],
            },
          });
          checker = false;
        }
      });
      if (checker) {
        alert('Please write correct login and password');
      }
    });
}

export const getUserRoles = (userId) =>
  new Promise((resolve, reject) => {
    db.collection('users-roles')
      .doc(userId)
      .collection('roles')
      .orderBy('role', 'asc')
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

export const getRoomRoles = (userId) =>
  new Promise((resolve, reject) => {
    db.collection('rooms')
      .doc(userId)
      .collection('roles')
      .orderBy('role', 'asc')
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

export function currentChecker(userRole, roomRole) {
  //console.log("U: ", userRole, "R: ", roomRole);
  return userRole.role.toString() === roomRole.role.toString();
}

export function isProperties(userRoles, roomRoles) {
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

export function findPart(inp, name) {
  return (
    name.toLowerCase().includes(inp.input.toLowerCase()) ||
    inp.input == null ||
    inp.input === ''
  );
}

export const getCheckedRoles = () => {
  let checkedRoles = [];
  let checkboxes = document.querySelectorAll('input[type=checkbox]:checked');

  for (let i = 0; i < checkboxes.length; i++) {
    checkedRoles.push(checkboxes[i].id);
  }
  //console.log(checkedRoles);
  return checkedRoles;
};

export const sendRequest = (input) => {
  let roles = getCheckedRoles();
  if (roles.length === 0) {
    alert('Please, select role');
  } else if (input === '') {
    alert('Please, write name of group');
  } else {
    createRoom(input, roles);
  }
};
