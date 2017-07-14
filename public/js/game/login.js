/**
 * REQUIRED FILES:
 * /socket.io/socket.js
 */

$(document).ready(() => {
  const game = new GameSocket(BASE_URL);

  $("#username").on("keyup", function (e) {
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
    game.checkName(name, (ok) => {
      if (ok)
        window.location.replace(BASE_URL + "/game?name=" + name);
      else
        alert(name + " is already in use!");
    });
  });
});
