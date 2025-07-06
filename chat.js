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
const userList = document.getElementById("userList");
const chatWith = document.getElementById("chatWith");

let currentUser = null;
let activeChatUID = null;
let unsubscribeMessages = null;

auth.onAuthStateChanged(user => {
  if (user) {
    currentUser = user;
    db.collection("users").doc(user.uid).set({
      email: user.email,
      online: true
    }, { merge: true });

    authDiv.style.display = "none";
    chatDiv.style.display = "flex";
    loadUserList();
  } else {
    if (currentUser) {
      db.collection("users").doc(currentUser.uid).update({ online: false });
    }
    authDiv.style.display = "block";
    chatDiv.style.display = "none";
  }
});

function loadUserList() {
  db.collection("users").where("online", "==", true)
    .onSnapshot(snapshot => {
      userList.innerHTML = "";
      snapshot.forEach(doc => {
        if (doc.id !== currentUser.uid) {
          const li = document.createElement("li");
          li.textContent = doc.data().email;
          li.onclick = () => selectUser(doc.id, doc.data().email);
          userList.appendChild(li);
        }
      });
    });
}

function selectUser(uid, email) {
  activeChatUID = uid;
  chatWith.textContent = `Chatting with: ${email}`;
  if (unsubscribeMessages) unsubscribeMessages();

  const chatID = [currentUser.uid, uid].sort().join("_");

  unsubscribeMessages = db.collection("privateMessages").doc(chatID)
    .collection("messages")
    .orderBy("createdAt")
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

function sendMessage() {
  if (!activeChatUID) return;
  const message = messageInput.value;
  if (message.trim() === "") return;

  const chatID = [currentUser.uid, activeChatUID].sort().join("_");

  db.collection("privateMessages").doc(chatID).collection("messages").add({
    text: message,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    uid: currentUser.uid,
    email: currentUser.email
  });

  messageInput.value = "";
}