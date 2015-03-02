/**
 * Created by wangyc on 15-2-26.
 */
// attach ready event
function showlogin() {
  $("#register").hide();
  $("#login").show();
}
function showregister() {
  $("#login").hide();
  $("#register").show();
}


validateForm = {};

validateForm.ready = function () {

  $('.ui.accordion')
      .accordion()
  ;

  $('.ui.segment')
      .popup()
  ;
  $('.ui.header')
      .popup()
  ;


  $('.ui.form')
      .form({
        username: {
          identifier: 'username',
          rules: [
            {
              type: 'empty',
              prompt: 'Please enter a username'
            }
          ]
        },
        password: {
          identifier: 'password',
          rules: [
            {
              type: 'empty',
              prompt: 'Please enter a password'
            },
            {
              type: 'length[2]',
              prompt: 'Your password must be at least 2 characters'
            }
          ]
        }

      },
      {
        onSuccess: function (event) {
          var inputlist = $(event.target).find("input");
          var username = inputlist[0].value;
          var password = inputlist[1].value;
          var form = $(event.target).attr("id");
          if (form === "login") {
            $.ajax({
              type: 'POST',
              url: '/login',
              data: {'userName': username, 'password': password},
              success: function (result) {
                if (result.status == 0) {
                  alert(result.msg);
                } else {
                  //$.cookie("userId", result.msg._id);
                  $.cookie("username", username);
                  $.cookie("isSuper", result.msg['isSuper']);

                  window.location = $(location)[0].origin + "/label";
                }
              },
              dataType: 'json'
            });
          } else if (form === "register") {
            $.ajax({
              type: 'POST',
              url: '/register',
              data: {'userName': username, 'password': password},
              success: function (result) {
                if (result.status == 0) {
                  alert(result.msg);
                } else {
                  //$.cookie("userId", result.msg._id);
                  $.cookie("username", username);
                  $.cookie("isSuper", result.msg.isSuper);

                  window.location = $(location)[0].origin + "/label";
                }
              },
              dataType: 'json'
            });
          }
        }
      });
};

$(document)
    .ready(validateForm.ready)
;
