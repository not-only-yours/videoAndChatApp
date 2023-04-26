import firebase from 'firebase';

const env = {
  apiKey: 'AIzaSyCybuFbMNItTvWFSmhFr5NOVLEIzb2HyZw',
  authDomain: 'videochatapp-3d7d5.firebaseapp.com',
  projectId: 'videochatapp-3d7d5',
  storageBucket: 'videochatapp-3d7d5.appspot.com',
  messagingSenderId: '534185277677',
  appId: '1:534185277677:web:8f646bdc25f269c422b4e4;measurementId=G-EBR83FKZWW',
  databaseURL: 'https://videochatapp-3d7d5.firebaseio.com',
};

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
