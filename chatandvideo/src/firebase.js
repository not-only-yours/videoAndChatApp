/*eslint-disable */
const firebaseConfig = {
  apiKey: "AIzaSyD3OrFbwg35jgpDfrCUnSauNwWjvB8D29A",
  authDomain: "chatpart-18f0f.firebaseapp.com",
  projectId: "chatpart-18f0f",
  storageBucket: "chatpart-18f0f.appspot.com",
  messagingSenderId: "15268948799",
  appId: "1:15268948799:web:97b729bdf7a62cf8b2818a",
  measurementId: "G-PYZBV7J98Z",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();


export {auth, provider};
export default db;
/*eslint-enable */
