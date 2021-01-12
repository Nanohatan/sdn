(function() {
  const firebaseConfig ={
  apiKey: "AIzaSyDvTfczjxrx8_oURPTvytJxx1HT3QLkKms",
  authDomain: "ryukyudog-2b9af.firebaseapp.com",
  databaseURL: "https://ryukyudog-2b9af.firebaseio.com",
  projectId: "ryukyudog-2b9af",
  storageBucket: "ryukyudog-2b9af.appspot.com",
  messagingSenderId: "402863759371",
  appId: "1:402863759371:web:d0aa8c65630fd062e0e70e",
  measurementId: "G-DVPG7S6N5B"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

//get elements
const txtEmail= document.getElementById('txtEmail');
const txtPassword = document.getElementById('txtPassword');
const btnSignUp = document.getElementById('btnSignUp');
var message = document.getElementById('message');

function emailIsValid (email) {
  return /^[^\s@]+@[^\s@]+\.u-ryukyu+\.ac+\.jp+$/.test(email);
}

btnSignUp.addEventListener('click', e => {
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();
  if (emailIsValid(email)){
  const promise = auth.createUserWithEmailAndPassword(email,pass);
  promise.catch(
    e => {console.log(e.message)
    message.textContent=e.message;
    }
  );
  }else{
  alert("please write valid email");
     console.log("invalid email");
  }
});
