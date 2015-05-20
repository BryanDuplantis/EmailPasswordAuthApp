var FIREBASE_URL = 'https://nssc9authapp.firebaseio.com/';
var fb = new Firebase(FIREBASE_URL);

$('.doResetPassword').click(function () {
  var email = $('input[type="email"]').val();

  fb.resetPassword({
    email: email
  }, function (err) {
    if (err) {
      alert(err.toString());
    } else {
      alert('Check your email!');
    }
  });
});

$('.doLogout').click(function () {
  fb.unauth();
})

$('.doRegister').click(function () {
  var email = $('input[type="email"]').val();
  var password = $('input[type="password"]').val();

  fb.createUser({
    email: email,
    password: password
  }, function (err, userData) {
    if (err) {
      alert(err.toString());
    } else {
      doLogin(email, password);
    }
  });

  event.preventDefault();
});

$('form').submit(function () {
  var email = $('input[type="email"]').val();
  var password = $('input[type="password"]').val();

  doLogin(email, password);
  event.preventDefault();
});

function clearLoginForm () {
  $('input[type="email"]').val('');
  $('input[type="password"]').val('');
}

function saveAuthData (authData) {
  $.ajax({
    method: 'PUT',
    url: `${FIREBASE_URL}/users/${authData.uid}/profile.json`,
    data: JSON.stringify(authData)
  });
}

function doLogin (email, password, cb) {
  fb.authWithPassword({
    email: email,
    password: password
  }, function (err, authData) {
    if (err) {
      alert(err.toString());
    } else {
      saveAuthData(authData);
      typeof cb === 'function' && cb(authData);
    }
  });
}

fb.onAuth(function (authData) {
  var onLoggedOut = $('.onLoggedOut');
  var onLoggedIn = $('.onLoggedIn');
  var onTempPassword = $('.onTempPassword');

  if (authData && authData.password.isTemporaryPassword) {
    onTempPassword.removeClass('hidden');
    onLoggedIn.addClass('hidden');
    onLoggedOut.addClass('hidden');
  } else if (authData) {
    onLoggedIn.removeClass('hidden');
    onLoggedOut.addClass('hidden');
    onTempPassword.addClass('hidden');
    $('.onLoggedIn h1').text(`Hello ${authData.password.email}`);
  } else {
    onLoggedOut.removeClass('hidden');
    onLoggedIn.addClass('hidden');
    onTempPassword.addClass('hidden');
  }

  clearLoginForm();
});
