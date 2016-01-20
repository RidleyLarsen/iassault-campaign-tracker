var ref = new Firebase(FIREBASE_URL);

function handle_auth() {
  var auth = ref.getAuth();
  if (auth === null) {
    if (window.location.pathname !== "/") {
      window.location.pathname = "/";
    }
  } else {
    if (auth.uid && window.location.pathname === "/") {
      window.location.pathname = "/campaigns/";
    }
  }
}

$(function() {
  handle_auth();
});
