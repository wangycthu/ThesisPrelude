/**
 * Created by wangyc on 15-3-2.
 */

function submit() {
    var threadID = $('.ui.threaded.comments').attr('id');
    // var _keyword = $(".ui.tag.green.label").attr("id");
    var _topicid = $("#topic_val").attr("key");
    var _topicname = $("#topic_val").attr("val");
    var _username = $("#username").text();
    var labelRecords = {};
    var _if_related = $("input:checked[name='if_related']").val();
    console.log(_if_related);
    $('.comment').each(function () {
        var _number = $(this).attr('id').toString();
        labelRecords[_number] = $(this).find('input:radio:checked').val();
    });
    var _labels = JSON.stringify(labelRecords);
    $.ajax({
        url: '/label',
        type: 'POST',
        dataType: 'json',
        data: {'threadid': threadID,
               'topicid': _topicid,
               'topicname': _topicname,
               'username': _username,
               'labels': _labels,
               'trash': 0,
               'ifrelated': _if_related
              },
        success: function (result) {
            if (result.status != 0) {
                alert(result.msg);
            } else {
                alert('标注成功！');
                $('.ui.radio.checkbox').checkbox('disable');
                $('#next').removeClass('disabled');
                $('#submit').addClass('disabled');
                $('#trash').addClass('disabled');
                var labelCount = parseInt($('#labelCount').text());
                $('#labelCount').text(labelCount + 1);
            }
        }
    });
}

$(function () {
    $('#submit').click(function () {
        var complete = true;
        $('.ui.form').each(function () {
            var val = $(this).find('input:radio:checked').val();
            var _if_related = $("if_related").val;
            if (val == null) {
                alert('请不要漏标哦~');
                complete = false;
                return false;
            }
            if (_if_related == null) {
                alert("您认为该序列中上下文信息是否有助于您对情感方向的判断？请选择");
                complete = false;
                return false;
            }
        });
        if (complete) {
            submit();
        }
    });

});

$(function () {
    $('#next').click(function () {
        window.location.reload();
    });
});

function trash() {
    var threadID = $('.ui.threaded.comments').attr('id');
    // var _keyword = $(".ui.tag.green.label").attr("id");
    var _topicid = $("#topic_val").attr("key");
    var _username = $("#username").text();
    $.ajax({
        url: '/label',
        type: 'POST',
        dataType: 'json',
        data: {'threadid': threadID,
               'topicid': _topicid,
               'username': _username,
               'trash': 1},
        success: function (result) {
            if (result.status !=     0) {
                alert(result.msg);
            } else {
                $('.ui.radio.checkbox').checkbox('disable');
                $('#next').removeClass('disabled');
                $('#submit').addClass('disabled');
                $('#trash').addClass('disabled');
            }
        }
    });
}

function confirm_trash()
{
    var r = confirm("你确定该数据无法标注？");
    if (r == true) {
        trash();
    }
}
