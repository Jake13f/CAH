/**
 * REQUIRED FILES:
 * /classes/socket.js
 */

/**
 * The Ids for the game controls
 * @type {Object}
 */
const CONTROLS = {
  start: "#start",
  pause: "#pause",
  stop: "#stop"
};

$(document).ready(() => {
  const game = new GameSocket(BASE_URL, CONTROLS);

  game.login(name, (success) => {
    if (success === false) window.location.replace(BASE_URL);

    game.listen();
  });

  $("#start").on("click", e => game.start());
});
