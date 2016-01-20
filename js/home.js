$(function () {
  $(document).on('click', '.facebook-login', function(e) {
    ref.authWithOAuthPopup("facebook", function(error, authData) {
      userRef = ref.child(authData.uid);
    }, {
      scope: "email"
    });
  });
});
