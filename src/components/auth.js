import { initializeApp } from 'https://unytics.io/__/firebase/11.6.0/firebase-app.js'
import { getAuth, getRedirectResult, signInWithRedirect, signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from 'https://unytics.io/__/firebase/11.6.0/firebase-auth.js'
import { getFirestore } from 'https://unytics.io/__/firebase/11.6.0/firebase-firestore.js'
import { getStorage, ref, getDownloadURL } from "https://unytics.io/__/firebase/11.6.0/firebase-storage.js";


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
const auth = getAuth();
auth.useDeviceLanguage();

const signInButton = document.getElementById('sign-in');
const signOutButton = document.getElementById('sign-out');
const downloadButton = document.getElementById('download');
const logsElement = document.getElementById('logs');

signInButton.onclick = () => {
    signInWithRedirect(auth, provider);
};


getRedirectResult(auth)
    .then((result) => {
        console.log('REDIRECT RESULT!', result);
        logsElement.innerHTML += 'REDIRECT RESULT: ' + JSON.stringify(result) + '<br>';
        if (!result) {
            return;
        }
        // This gives you a Google Access Token. You can use it to access Google APIs.
        console.log('HELLO', result);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const user = result.user;
        // IdP data available using getAdditionalUserInfo(result)
        // ...
    }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(error);
        logsElement.innerHTML += 'REDIRECT ERROR: ' + JSON.stringify(error) + '<br>';

        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
    });



// signInButton.onclick = () => {
//   signInWithPopup(auth, provider)
//     .then((result) => {
//       // This gives you a Google Access Token. You can use it to access the Google API.
//       const credential = GoogleAuthProvider.credentialFromResult(result);
//       const token = credential.accessToken;
//       // The signed-in user info.
//       const user = result.user;
//       // IdP data available using getAdditionalUserInfo(result)
//       // ...
//     }).catch((error) => {
//       // Handle Errors here.
//       const errorCode = error.code;
//       const errorMessage = error.message;
//       // The email of the user's account used.
//       const email = error.customData.email;
//       // The AuthCredential type that was used.
//       const credential = GoogleAuthProvider.credentialFromError(error);
//       // ...
//     });
// };

signOutButton.onclick = () => {
    signOut(auth).then(() => {
        // Sign-out successful.
    }).catch((error) => {
        console.error("Sign-out error:", error);
    });
}

onAuthStateChanged(auth, (user) => {
    console.log('STATE CHANGED!', user);
    logsElement.innerHTML += 'STATE CHANGED: ' + JSON.stringify(user) + '<br>';
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log(user);
        signInButton.classList.add('hidden');
        signOutButton.classList.remove('hidden');
        downloadButton.classList.remove('hidden');
        // ...
    } else {
        // User is signed out
        signInButton.classList.remove('hidden');
        signOutButton.classList.add('hidden');
        downloadButton.classList.add('hidden');
        // ...
    }
});

downloadButton.onclick = async () => {
    const storage = getStorage();
    const gsReference = ref(storage, 'gs://unytics_foo/hello.txt');
    const url = await getDownloadURL(gsReference);
    console.log('URL', url);
}
