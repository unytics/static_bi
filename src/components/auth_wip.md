<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>





<style>
  .hidden {
    display: none;
  }
</style>

<body>




  <section id="sign-in-section" class="bg-gray-50 dark:bg-gray-900">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
            <img class="w-32 h-8 mr-2" src="https://unytics.io/assets/unytics_logo_and_name.svg" alt="logo">
        </a>
        <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div class="p-6 space-y-4 md:space-y-6 sm:p-8">

              <div class="text-center">
                <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">Sign in to Unytics</h1>
              </div>

              <div class="mt-5">
                <button id="sign-in" type="button" class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-800 shadow-2xs hover:bg-gray-50 focus:outline-hidden focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-white dark:hover:bg-neutral-800 dark:focus:bg-neutral-800">
                  <svg class="w-4 h-auto" width="46" height="47" viewBox="0 0 46 47" fill="none">
                    <path d="M46 24.0287C46 22.09 45.8533 20.68 45.5013 19.2112H23.4694V27.9356H36.4069C36.1429 30.1094 34.7347 33.37 31.5957 35.5731L31.5663 35.8669L38.5191 41.2719L38.9885 41.3306C43.4477 37.2181 46 31.1669 46 24.0287Z" fill="#4285F4"/>
                    <path d="M23.4694 47C29.8061 47 35.1161 44.9144 39.0179 41.3012L31.625 35.5437C29.6301 36.9244 26.9898 37.8937 23.4987 37.8937C17.2793 37.8937 12.0281 33.7812 10.1505 28.1412L9.88649 28.1706L2.61097 33.7812L2.52296 34.0456C6.36608 41.7125 14.287 47 23.4694 47Z" fill="#34A853"/>
                    <path d="M10.1212 28.1413C9.62245 26.6725 9.32908 25.1156 9.32908 23.5C9.32908 21.8844 9.62245 20.3275 10.0918 18.8588V18.5356L2.75765 12.8369L2.52296 12.9544C0.909439 16.1269 0 19.7106 0 23.5C0 27.2894 0.909439 30.8731 2.49362 34.0456L10.1212 28.1413Z" fill="#FBBC05"/>
                    <path d="M23.4694 9.07688C27.8699 9.07688 30.8622 10.9863 32.5344 12.5725L39.1645 6.11C35.0867 2.32063 29.8061 0 23.4694 0C14.287 0 6.36607 5.2875 2.49362 12.9544L10.0918 18.8588C11.9987 13.1894 17.25 9.07688 23.4694 9.07688Z" fill="#EB4335"/>
                  </svg>
                  Sign in with Google
                </button>

                <!-- <div class="mt-3 mb-3 py-3 flex items-center text-xs text-gray-400 uppercase before:flex-1 before:border-t before:border-gray-200 before:me-6 after:flex-1 after:border-t after:border-gray-200 after:ms-6 dark:text-neutral-500 dark:before:border-neutral-600 dark:after:border-neutral-600">Or</div>




                <form class="space-y-2 md:space-y-3" action="#">
                    <div>
                        <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-200 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="">
                    </div>

                    <button type="submit" class="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-hidden focus:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none">Sign in with email</button>
                </form> -->
            </div>
        </div>
    </div>
  </section>











  <!-- <button id="sign-in">Sign In with Google</button> -->
  <button id="sign-out" class="hidden">Sign Out</button>

  <!-- Insert this script at the bottom of the HTML, but before you use any Firebase services -->
  <script type="module">
    import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js'
    import { getAuth, signInWithPopup, signOut, onAuthStateChanged, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js'
    import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js'

    const firebaseConfig = {
      apiKey: "AIzaSyD5n2R6a5w9FU9aKbq2GbiP2rVPC9vCXsA",
      authDomain: "unytics-cloud.firebaseapp.com",
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
    const signInSection = document.getElementById('sign-in-section');
    const signOutButton = document.getElementById('sign-out');


    signInButton.onclick = () => {
      signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
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
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
    };

    signOutButton.onclick = () => {
      signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        console.error("Sign-out error:", error);
      });
    }

    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log(user);
        signOutButton.classList.remove('hidden');
        signInSection.classList.add('hidden');
        // ...
      } else {
        // User is signed out
        signInSection.classList.remove('hidden');
        signOutButton.classList.add('hidden');
        // ...
      }
    });

  </script>
</body>