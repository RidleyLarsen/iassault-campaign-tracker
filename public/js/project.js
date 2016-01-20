var ref = new Firebase(FIREBASE_URL);

function handle_auth() {
  var auth = ref.getAuth();
  if (auth === null && window.location.pathname !== "/") {
    window.location.pathname = "/";
  }
  if (auth.uid && window.location.pathname === "/") {
    window.location.pathname = "/campaigns/";
  }
}

$(function() {
  handle_auth();
});
