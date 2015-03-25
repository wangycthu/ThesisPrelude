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
      },
      login_email : {
          identifier: "login_email",
          rules: [
              {
                  type: "email",
                  prompt: "the input format must be suitable of email"
              },
              {
                  type : "empty",
                  prompt: "Please input an  email"
              }
          ]}
      },{
        onSuccess: function (event) {
            var inputlist = $.find("#login input");
            var email = inputlist[0].value;
            var password = inputlist[1].value;
            var form = $(event.target).attr("id");
          if (form === "login") {
              console.log(email);
              console.log(password);
            $.ajax({
              type: 'POST',
              url: '/login',
              data: {'email': email, 'password': password},
              success: function (result) {

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
          }
        }
      });


    $(".ui.form#register").form({
        register_username: {
          identifier : 'register_username',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter a username'
            }
          ]
        },
        register_email : {
            identifier: "register_email",
            rules: [
                {
                    type: "email",
                    prompt: "the input format must be suitable of email"
                },
                {
                    type : "empty",
                    prompt: "Please input an  email"
                }
            ]},
        register_password: {
          identifier : 'register_password',
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
        },
        register_confirm_password: {
            identifier: "register_confirm_password",
            rules: [
                {
                    type : "empty",
                    prompt: "Please enter a password"
                },
                {
                    type: "length[6]",
                    prompt: "Your password must be at least 6 characters"
                },
                {
                    type: "match[register_password]",
                    prompt: "The confirm password must be equal to the password origin"
                }
            ]
        }

      },{
        onSuccess: function (event) {
            var inputlist = $.find("#register input");
            var username = inputlist[0].value;
            var email = inputlist[1].value;
            var password = inputlist[2].value;
            var form = $(event.target).attr("id");
          if (form === "register") {
            $.ajax({
              type: 'POST',
              url: '/register',
              data: {'userName': username, 'email': email, 'password': password},
              success: function (result) {
                if (result.status != 0) {
                  alert(result.msg);
                } else {
                  // $.cookie("username", username);
                  // $.cookie("isSuper", result.msg.isSuper);
                  // $.cookie("keyword", "iPhone6");
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
