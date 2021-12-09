const http = require("http");
const url = require("url");
const firebase =  require("firebase");

const firebaseConfig = {
    apiKey: "AIzaSyD3OrFbwg35jgpDfrCUnSauNwWjvB8D29A",
    authDomain: "chatpart-18f0f.firebaseapp.com",
    databaseURL: "https://chatpart-18f0f-default-rtdb.firebaseio.com",
    projectId: "chatpart-18f0f",
    storageBucket: "chatpart-18f0f.appspot.com",
    messagingSenderId: "15268948799",
    appId: "1:15268948799:web:97b729bdf7a62cf8b2818a",
    measurementId: "G-PYZBV7J98Z",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();

http
  .createServer((request, response) => {
    response.setHeader("Content-Type", "application/json");
    let urlRequest = url.parse(request.url, true);

    console.log("Connected successfully.");
    let requestArray = urlRequest.path.concat('/');
    console.log(requestArray)
    if (requestArray[0] === "lalala") {
      response.setHeader("Access-Control-Allow-Origin", "*");
      response.setHeader(
        "Access-Control-Allow-Headers",
        "origin, content-type, accept"
      );
      //response.end(JSON.stringify("hohoho"));
      console.log(requestArray[0]);
  }
  })
  .listen(9000);


function jwtExists(roomId, user) {
    console.log(user);
    db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .add({
            message: `${user} connected to the video Room. You can join him by clicking the icon`,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
}

function roomNameExists(roomId, dispatchRoomName, setRoomName, setMessages) {
    if (roomId) {
        try {
            db.collection("rooms")
                .doc(roomId)
                .onSnapshot((snapshot) => {
                    if (snapshot.data()) {
                        setRoomName(snapshot.data().name);
                        dispatchRoomName({
                            type: "SET_ROOMNAME",
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

function sendMessageFun(roomId, input, user) {
    console.log(user);
    db.collection("rooms").doc(roomId).collection("messages").add({
        message: input,
        name: user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
}

const send = async (user, dispatch) => {
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
                type: "SET_TOKEN",
                token: response,
            });
        });
};

const idExists = (id, setMessages) => {
    db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
            setMessages(snapshot.docs.map((doc) => doc.data()));
        });
};

function createRoom(roomName, roles) {
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
        })
        .then(() => {
            roles.forEach((role) => {
                console.log(role);
                db.collection("rooms").doc(roomId).collection("roles").add({
                    role: role,
                });
            });
            alert("Room created!");
        });
}

function refreshDB(setRooms) {
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

function vid(dispatchToken) {
    return () => {
        dispatchToken({
            type: "SET_TOKEN",
            token: false,
        });
    };
}

function checkLoginAndPass(login, pass, dispatch) {
    db.collection("users-roles")
        .get()
        .then((querySnapshot) => {
            let checker = true;
            querySnapshot.forEach((doc) => {
                //console.log(doc.data().password, "==", pass);
                if (doc.data().password === pass && doc.data().login === login) {
                    dispatch({
                        type: "SET_TOKEN",
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
                alert("Please write correct login and password");
            }
        });
}

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

const getCheckedRoles = () => {
    let checkedRoles = [];
    let checkboxes = document.querySelectorAll("input[type=checkbox]:checked");

    for (let i = 0; i < checkboxes.length; i++) {
        checkedRoles.push(checkboxes[i].id);
    }
    //console.log(checkedRoles);
    return checkedRoles;
};

const sendRequest = (input) => {
    let roles = getCheckedRoles();
    if (roles.length === 0) {
        alert("Please, select role");
    } else if (input === "") {
        alert("Please, write name of group");
    } else {
        createRoom(input, roles);
    }
};

