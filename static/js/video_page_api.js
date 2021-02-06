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