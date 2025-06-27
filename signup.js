const firebaseConfig = {
    apiKey: "AIzaSyAW0zxO4opk2VRlV4Rn2uW5r540ydSDtD4",
    authDomain: "biscuit-for-my-biscuit.firebaseapp.com",
    projectId: "biscuit-for-my-biscuit",
    storageBucket: "biscuit-for-my-biscuit.appspot.com",
    messagingSenderId: "1059060992203",
    appId: "1:1059060992203:web:14f3ffe6e984b51b57734e",
    measurementId: "G-NMFLB5HE3K"
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore(); // only if you're using Firestore

    function signUp() {
      const email = document.getElementById("signupEmail").value;
      const password = document.getElementById("signupPassword").value;

      auth.createUserWithEmailAndPassword(email, password)
        .then(() => {
          document.getElementById("signupStatus").textContent = "Account created!";
          window.location.href = "homepage.html"; // redirect after sign up
        })
        .catch(error => {
          document.getElementById("signupStatus").style.color = "red";
          document.getElementById("signupStatus").textContent = error.message;
        });
    }