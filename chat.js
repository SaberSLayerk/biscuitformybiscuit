// 🔥 Replace with your Firebase config:
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
const db = firebase.firestore();

const authDiv = document.getElementById("auth");
const chatDiv = document.getElementById("chat");
const messageInput = document.getElementById("messageInput");
const messagesDiv = document.getElementById("messages");

auth.onAuthStateChanged(user => {
  if (user) {
    authDiv.style.display = "none";
    chatDiv.style.display = "block";
    listenForMessages();
  } else {
    authDiv.style.display = "block";
    chatDiv.style.display = "none";
  }
});

function sendMessage() {
  const message = messageInput.value;
  if (message.trim() === "") return;
  db.collection("messages").add({
    text: message,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    uid: auth.currentUser.uid,
    email: auth.currentUser.email
  });
  messageInput.value = "";
}

function listenForMessages() {
  db.collection("messages").orderBy("createdAt")
    .onSnapshot(snapshot => {
      messagesDiv.innerHTML = "";
      snapshot.forEach(doc => {
        const msg = doc.data();
        const p = document.createElement("p");
        p.textContent = `${msg.email}: ${msg.text}`;
        messagesDiv.appendChild(p);
      });
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    });
}
