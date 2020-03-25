import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyABNywsMRwu5KrX4dwH2dJh2mK4DWrlKzw",
  authDomain: "little-tokens.firebaseapp.com",
  projectId: "little-tokens",
});

export const db = firebaseApp.firestore();

export const getChildren = () => db.collection('children').get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
  });
});