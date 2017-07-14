/**
 * REQUIRED FILES:
 * /socket.io/socket.js
 */

$(document).ready(() => {
  const game = new GameSocket(BASE_URL);

  /**
   * Monitors input on the login inputs
   * @param  {object} e JQUERY event object
   */
  $("#splashscreen input").on("keyup", function (e) {
    if (e.keyCode === 13)
      $("#login").click();
    else if (e.keyCode === 27)
      $(this).val("");
  });

  /**
   * Validates the users desired name and redirects accordingly
   * @param  {object} e JQUERY event object
   */
  $("#login").on("click", e => {
    var name = $("#username").val();
    var room = $("#roomname").val();

    game.checkName(name, room, (ok) => {
      if (ok)
        window.location.replace(BASE_URL + "/game?name=" + name + "&room=" + room);
      else
        alert(name + " is already in use!");
    });
  });
});
