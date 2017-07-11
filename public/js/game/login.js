/**
 * REQUIRED FILES:
 * /socket.io/socket.js
 */

$(document).ready(() => {
  const game = new GameSocket(BASE_URL);

  /**
   * Validates the users desired name and redirects accordingly
   * @param  {object} e JQUERY event object
   */
  $("#login").on("click", function (e) {
    var name = $("#username").val();
    game.checkName(name, (ok) => {
      if (ok)
        window.location.replace(BASE_URL + "/game?name=" + name);
      else
        alert(name + " is already in use!");
    });
  });
});
