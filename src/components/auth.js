import app from './authm.js';


const signInButton = document.getElementById('sign-in');
const signOutButton = document.getElementById('sign-out');
const downloadButton = document.getElementById('download');
const logsElement = document.getElementById('logs');

signInButton.onclick = app.signin;
signOutButton.onclick = app.signout;
app.on_auth_change((user) => {
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
  const result = await app.get_redirect_result();
  console.log('REDIRECT RESULT', null);
  logsElement.innerHTML += 'REDIRECT RESULT: ' + JSON.stringify(result) + '<br>';
});
