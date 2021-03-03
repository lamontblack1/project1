// Your web app's Firebase configuration**************
var firebaseConfig = {
    apiKey: "AIzaSyB1TrIIy62YBgWnmc3roTo8L2IldcUmHBM",
    authDomain: "fiveminutechat-694e9.firebaseapp.com",
    databaseURL: "https://fiveminutechat-694e9-default-rtdb.firebaseio.com",
    projectId: "fiveminutechat-694e9",
    storageBucket: "fiveminutechat-694e9.appspot.com",
    messagingSenderId: "689324897813",
    appId: "1:689324897813:web:a89e80e2244489d409c01c"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
    // Create a variable to reference the database
    let db = firebase.database()