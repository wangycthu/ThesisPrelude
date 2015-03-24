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


var validateForm = {};




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

  $('.ui.form#login').form({
        login_username: {
          identifier : 'login_username',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter a username'
            }
          ]
        },
        login_password: {
          identifier : 'login_password',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter a password'
            },
            {
              type   : 'length[3]',
              prompt : 'Your password must be at least 3 characters'
            }
          ]
        }
      },{
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

                  // DEBUG
                  alert(result.msg);

                if (result.status != 0) {
                  alert(result.msg);
                } else {

                  if (result.msg['isSuper']) {
                    // alert($(location)[0].origin);
                    window.location = $(location)[0].origin + "/overview";
                  } else {
                    window.location = $(location)[0].origin + "/label";
                  }
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
                if (result.status != 0) {
                  alert(result.msg);
                } else {
                  //$.cookie("userId", result.msg._id);
                  $.cookie("username", username);
                  $.cookie("isSuper", result.msg.isSuper);
                  $.cookie("keyword", "iPhone6");

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
