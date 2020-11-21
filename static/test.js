var video = document.getElementById('video');
var w_time = 0;
// if(Hls.isSupported()) {
//   var hls = new Hls();
// // rewrite your self
//   hls.loadSource('video/capi/video.m3u8');
//   hls.attachMedia(video);
//   hls.on(Hls.Events.MANIFEST_PARSED,function() {
//    video.play();
//    });
// }

function setTime(t) {
   video.currentTime = t;
}
// Insert Shiori
function shioriFunction() {
  w_time = video.currentTime;
  var node = document.createElement("LI");
  var textnode = document.createTextNode(String(w_time));
  node.appendChild(textnode);
  document.getElementById("video-time-list").appendChild(node);
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('#video-time-list');
list.addEventListener('click', function(ev) {
  ev.target.classList.toggle('checked');
  var x = document.getElementsByClassName("checked");
//  document.getElementById("demo").innerHTML = x[0].innerHTML; 
  setTime(x[0].innerHTML);
}, false);

