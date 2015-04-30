/**
 * Created by neutronest 2015-03-19
 */

function submit() {

    var threadID = $(".ui.threaded.comments").attr("id");
    // var _keyword = $(".ui.tag.green.label").attr("id");
    var _topicid = $("#topic_val").attr("key");
    var _topicname = $("#topic_val").attr("val");
    var _username = $("#username").text();
    var labelRecords = {};
    $(".comment").each(function(){
        var _number = $(this).attr("id").toString();
        var input = $(this).find("input:radio:enabled:checked").val();
        if (input === null) {
            return true; // that means continue
        }
        labelRecords[_number] = input;
    });
    // labels format: {"1": "positive", "2": "positive"}
    var _labels = JSON.stringify(labelRecords);
    console.log(_labels);

    $.ajax({

        url: "/check",
        type: "POST",
        dataType: 'json',
        data: {
            "threadid": threadID,
            "topicid": _topicid,
            "username": _username,
            "labels": _labels,
            "trash": 0
        },
        success: function(result) {

            if(result.status != 0) {
                alert(result.msg);
            } else {
                alert("修复成功!");
                $('.ui.radio.checkbox').checkbox('disable');
                $('#next').removeClass('disabled');
                $('#submit').addClass('disabled');
                $('#trash').addClass('disabled');
                // var labelCount = parseInt($('#labelCount').text());
                // $('#labelCount').text(labelCount + 1);
            }
        }
    });
}


$(function () {
    $('#submit').click(function () {
        var complete = true;
        $('.ui.form').each(function () {
            var val = $(this).find('input:radio:checked').val();
            if (val == null) {
                alert('请不要漏标哦~');
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
    var threadID = $(".ui.threaded.comments").attr("id");
    // var _keyword = $(".ui.tag.green.label").attr("id");
    var _topicid = $("#topic_val").attr("key");
    var _username = $("#username").text();

    $.ajax({
        url: '/check',
        type: 'POST',
        dataType: 'json',
        data: { 'threadid': threadID, 
                "topicid": _topicid,
                "username": _username, 
                'trash': 1},
        success: function (result) {
            if (result.status != 0) {
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
