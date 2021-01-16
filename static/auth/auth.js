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
const btnLogin = document.getElementById('btnLogin');
var message = document.getElementById('message');

function emailIsValid (email) {
  return /^[^\s@]+@[^\s@]+\.u-ryukyu+\.ac+\.jp+$/.test(email);
}

btnLogin.addEventListener('click',e => {
  const email = txtEmail.value;
  const pass = txtPassword.value;
  const auth = firebase.auth();
  const promise = auth.signInWithEmailAndPassword(email, pass);
  promise.catch(
     e => {console.log(e.message)
     message.textContent=e.message;
     }
  );
});


firebase.auth().onAuthStateChanged(function(user) {
if (user) {
    // User is signed in.
  var uid = user.uid
  var email = user.email
const data={
  uid : uid,
  email　: email
}
console.log(data);
 const Url = 'http://192.168.98.25:8080/auth/post'
 $.post(Url,data,function(data,status){
   console.log(`${data} and status is  ${status}`)
   window.location.replace('http://192.168.98.25:8080/auth/login')		
 });
 }
 });
 firebase.auth().onAuthStateChanged(firebaseUser => {
if(firebaseUser){
console.log(firebaseUser);

}else {

console.log("not logged in");
}
});
}());

