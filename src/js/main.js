var FIREBASE_URL = 'https://nssc9authapp.firebaseio.com/';
var fb = new Firebase(FIREBASE_URL);
var onLoggedOut = $('.onLoggedOut');
var onLoggedIn = $('.onLoggedIn');

var loginPage = $('.login');

var registerPage = $('.register');

$('.toLoginBtn, .toRegisterBtn').click(toggleLoginRegister);

$('.doLogout').click(function () {
  fb.unauth();
  toggleContentBasedOnLogin();
})

$('.register form').submit(function () {
  var email = $('.register input[type="email"]');
  var passwords = $('.register input[type="password"]');
  var password = $(passwords[0]).val();
  var passwordCheck = $(passwords[1]).val();

  if (password === passwordCheck) {
    fb.createUser({
      email: email.val(),
      password: password
    },function (err, userData) {
      if (err) {
        console.log(err.toString());
      } else {
        toggleLoginRegister();
      }
    });
  } else {
    alert('The passwords do not match');
  }

  event.preventDefault();
});

$('.login form').submit(function () {
  var email = $('.login input[type="email"]');
  var password = $('.login input[type="password"]');

  fb.authWithPassword({
    email: email.val(),
    password: password.val()
  }, function (err, authData) {
    if (err) {
      alert(err.toString());
    } else {
      toggleContentBasedOnLogin();
      var h1 = $('.onLoggedIn h1').text(`Hello ${authData.password.email}`)
      email.val('');
      password.val('');
      $.ajax({
        method: 'PUT',
        url: `${FIREBASE_URL}/users/${authData.uid}/profile.json`,
        data: JSON.stringify(authData)
      });
    }
  });

  event.preventDefault();
});

toggleContentBasedOnLogin();

function toggleLoginRegister() {
  registerPage.toggleClass('hidden');
  loginPage.toggleClass('hidden');
}

function toggleContentBasedOnLogin() {
  var authData = fb.getAuth();

  if (authData) {
    onLoggedOut.addClass('hidden');
    onLoggedIn.removeClass('hidden');
  } else {
    onLoggedOut.removeClass('hidden');
    onLoggedIn.addClass('hidden');
  }
}
