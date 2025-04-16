import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js'
import { getAuth, getRedirectResult, signInWithRedirect, signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js'
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js'
import { getStorage, ref, getDownloadURL } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-storage.js";


const firebaseConfig = {
  apiKey: "AIzaSyD5n2R6a5w9FU9aKbq2GbiP2rVPC9vCXsA",
  authDomain: "unytics.io",
  projectId: "unytics-cloud",
  storageBucket: "unytics-cloud.firebasestorage.app",
  messagingSenderId: "1014985713601",
  appId: "1:1014985713601:web:b3e42d577f70ad07fab140"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
const auth = getAuth(app);
auth.useDeviceLanguage();


const signin = () => {
  signInWithRedirect(auth, provider);
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

const download = async () => {
  const storage = getStorage();
  const gsReference = ref(storage, 'gs://unytics_foo/hello.txt');
  const url = await getDownloadURL(gsReference);
  console.log('URL', url);
};


export {
  signin,
  signout,
  get_user,
  on_auth_change,
  download,
  get_redirect_result,
};