const firebaseConfig = {
        apiKey: "AIzaSyAW0zxO4opk2VRlV4Rn2uW5r540ydSDtD4",
        authDomain: "biscuit-for-my-biscuit.firebaseapp.com",
        projectId: "biscuit-for-my-biscuit",
        storageBucket: "biscuit-for-my-biscuit.appspot.com", // ✅ fixed
        messagingSenderId: "1059060992203",
        appId: "1:1059060992203:web:14f3ffe6e984b51b57734e",
        measurementId: "G-NMFLB5HE3K"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

   
  console.log("Firebase version:", firebase.SDK_VERSION); // debug check

    function logIn() {
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      auth.signInWithEmailAndPassword(email, password)
        .then(() => {
          document.getElementById("loginStatus").textContent = "Login successful!";
          window.location.href = "homePage.html"; // redirect after login
        })
        .catch(error => {
          document.getElementById("loginStatus").style.color = "red";
          document.getElementById("loginStatus").textContent = error.message;
        });
    }