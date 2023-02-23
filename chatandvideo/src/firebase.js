import firebase from 'firebase';

console.log(process.env['apiKey']);
console.log(typeof process.env['apiKey']);
const firebaseConfig = {
  apiKey: process.env['apiKey'],
  authDomain: process.env['authDomain'],
  projectId: process.env['projectId'],
  storageBucket: process.env['storageBucket'],
  messagingSenderId: process.env['messagingSenderId'],
  appId: process.env['appId'],
  measurementId: process.env['measurementId'],
  databaseURL: process.env['databaseURL'],
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export default db;
