/**
 * REQUIRED FILES:
 * /socket.io/socket.js
 */

 const PROTOCOL = window.location.protocol;
 const HOSTNAME = window.location.hostname;
 const BASE_URL = PROTOCOL + "//" + HOSTNAME;
 const PORT = 3000;

$(document).ready(() => {
  const game = new GameSocket(BASE_URL + ":" + PORT);
  game.listen();

  $("#login").on("click", function (e) {
    var name = $("#username").val();
    game.login(name);
  });
});
