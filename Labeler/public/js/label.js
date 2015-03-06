/**
 * Created by wangyc on 15-3-2.
 */
function submit() {
  var threadID = $('.ui.threaded.comments').attr('id');
  var _keyword = $.cookie('keyword');
  var _username = $.cookie('username');
  var labelRecords = [];

  $('.comment').each(function () {
    var _number = $(this).attr('id');
    var _label = $(this).find('input:radio:checked').val();
    labelRecords.push({'number': _number, 'label': _label});
  });

  $.ajax({
    url: '/label',
    type: 'POST',
    dataType: 'json',
    data: {'id': threadID, 'keyword': _keyword, 'username': _username, 'labels': labelRecords},
    success: function (result) {
      if (result.status == 0) {
        alert(result.msg);
      } else {
        alert('标注成功！');
        //next();
      }
    }
  });
}

$(function () {
  $('#submit').click(function () {
    $('.ui.form').each(function () {
      var val = $(this).find('input:radio:checked').val();
      if (val == null) {
        alert('请不要漏标哦~');
        return false;
      }
    });

    submit();
  });
})
