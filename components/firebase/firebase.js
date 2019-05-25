import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';


var firebaseConfig = {
    apiKey: "AIzaSyDIIkrmz8iKFvZqOQvPtSWGkJLClAIRGX0",
    authDomain: "unite-beta.firebaseapp.com",
    databaseURL: "https://unite-beta.firebaseio.com",
    projectId: "unite-beta",
    storageBucket: "unite-beta.appspot.com",
    messagingSenderId: "471711965394",
    appId: "1:471711965394:web:063fd52759e79e14"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.firestore().settings({ timestampsInSnapshots: true });

export default firebase