function favo(element,id){
    fetch("/api/likes/"+id)
      .then((response) => response.json())
      .then((data) => {
        if (data.isInc){
          var n = element.getElementsByTagName("span")[0].innerHTML;
          n++;
          element.getElementsByTagName("span")[0].innerHTML=n;
        }
      });
}
function goThread(id){
    const chat_place=document.getElementById("chat_place")
    chat_place.innerHTML = '';
    fetch("/api/get-thread/"+id)
      .then((response) => response.text())
      .then((data) => {
        chat_place.innerHTML=data
      });
}
function backThread(id){
  const chat_place=document.getElementById("chat_place")
  chat_place.innerHTML = '';
  fetch("/api/back-thread/"+id)
    .then((response) => response.text())
    .then((data) => {
      chat_place.innerHTML=data
    });
}

function submitChat() {
  var form = document.getElementById("chatForm")
  var percentage = (video.currentTime / video.duration) * 100;
  var input = $("<input>")
               .attr("type", "hidden")
               .attr("shiori_time", percentage).val("bla");
  $('#chatForm').append(input);
  form.submit();
}