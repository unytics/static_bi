import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js'
import { getAuth, getRedirectResult, signInWithRedirect, signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js'
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyAHHoqOYTih6Rszsd4dZX5zxTZAUjPA13I",
  authDomain: "unytics.io",
  projectId: "unytics",
  appId: "1:168539290305:web:8545e2183131610a233240"
};

const firebase_app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
const auth = getAuth(firebase_app);
auth.useDeviceLanguage();


const signin = () => {
  if (location.host === 'unytics.io') {
    signInWithRedirect(auth, provider);
  }
  else {
    signInWithPopup(auth, provider);
  }
};

const get_redirect_result = async () => {
  const result = await getRedirectResult(auth);
  if (!result) {
    return;
  }
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential.accessToken;
  const user = result.user;
  return {user, token};
};

const signout = () => {
  signOut(auth).then(() => {
    window.location.reload();
    // Sign-out successful.
  }).catch((error) => {
    console.error("Sign-out error:", error);
  });
};


const get_user = () => {
  return auth.currentUser;
};


const on_auth_change = (callback) => {
  onAuthStateChanged(auth, callback);
};

const download = async (url) => {
  const storage = getStorage();
  const gsReference = ref(storage, url);
  return await getDownloadURL(gsReference);
};


export default {
  signin,
  signout,
  get_user,
  on_auth_change,
  download,
  get_redirect_result,
};