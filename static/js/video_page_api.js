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