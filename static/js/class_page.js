function changeButtonName() {
    var sel = document.getElementById('reaction-type');
    var b = document.getElementById('reaction-submit-botton');
    console.log(sel.value, b.value);
    if (sel.value == "shiori") {
        b.value = "しおりを挿入";
    } else {
        b.value = "チャットを送信";
    }
}



