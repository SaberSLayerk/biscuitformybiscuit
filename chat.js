
// 🔥 Replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_APP.firebaseapp.com",
  projectId: "YOUR_APP",
  storageBucket: "YOUR_APP.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
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

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.signInWithEmailAndPassword(email, password).catch(console.error);
}

function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  auth.createUserWithEmailAndPassword(email, password).catch(console.error);
}

function logout() {
  if (currentUser) {
    db.collection("users").doc(currentUser.uid).update({ online: false });
  }
  auth.signOut();
}

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
