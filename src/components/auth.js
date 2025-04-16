import {
  signin,
  signout,
  get_user,
  on_auth_change,
  download,
  get_redirect_result,
} from './authm.js';


const signInButton = document.getElementById('sign-in');
const signOutButton = document.getElementById('sign-out');
const downloadButton = document.getElementById('download');
const logsElement = document.getElementById('logs');

signInButton.onclick = signin;
signOutButton.onclick = signout;
on_auth_change((user) => {
  console.log('AUTH CHANGED', user);
  logsElement.innerHTML += 'AUTH CHANGED: ' + JSON.stringify(user) + '<br>';

  if (user) {
    signInButton.classList.add('hidden');
    signOutButton.classList.remove('hidden');
    downloadButton.classList.remove('hidden');
  } else {
    signInButton.classList.remove('hidden');
    signOutButton.classList.add('hidden');
    downloadButton.classList.add('hidden');
  }
})


document.addEventListener('DOMContentLoaded', async (event) => {
  const result = await get_redirect_result();
  console.log('REDIRECT RESULT', null);
  logsElement.innerHTML += 'REDIRECT RESULT: ' + JSON.stringify(result) + '<br>';
});
