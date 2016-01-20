$(function () {
  $(document).on('click', '.facebook-login', function(e) {
    ref.authWithOAuthPopup("facebook", function(error, authData) {
      if (authData.uid !== null) {
        window.location.pathname = "/campaigns/";
      }
    }, {
      scope: "email"
    });
  });
});