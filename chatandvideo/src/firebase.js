import firebase from 'firebase';

const env = JSON.parse(process.env['VideoChat']);
console.log(JSON.parse(env));
console.log(env.toString());
console.log(typeof JSON.parse(env));
const firebaseConfig = {
  apiKey: env.apiKey,
  authDomain: env.authDomain,
  projectId: env.projectId,
  storageBucket: env.storageBucket,
  messagingSenderId: env.messagingSenderId,
  appId: env.appId,
  measurementId: env.measurementId,
  databaseURL: env.databaseURL,
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.firestore();
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export default db;
