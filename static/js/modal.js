$(function() {
    $('#switch_isWatch_modal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget) // Button that triggered the modal
        var recipient = button.data('whatever') // Extract info from data-* attributes
        var isWatch = button.data('iswatch')
        var modal = $(this)
        if (isWatch){
          modal.find('.modal-title').text("現在このチャットは教員から見える設定になっています。")
          modal.find( ".modal-body" ).hide();
          modal.find( ".modal-footer" ).hide();
        }else{
          modal.find('.modal-title').text("現在このチャットは教員から見えない設定になっています。")
          modal.find( ".modal-body" ).show();
          modal.find( ".modal-footer" ).show();
        }
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        
        modal.find('.modal-response').text("")
        var url='http://192.168.98.25:8080/api/switch_isWatchByTeacher/'+recipient
        modal.find('.switch_botton').click(function() {
          $.post(url)
          .done(function(response){
            console.log(response)
            modal.find('.modal-response').text("教員から見える設定に変更しました。")
          });
        });
      })
});
