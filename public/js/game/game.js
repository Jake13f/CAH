/**
 * REQUIRED FILES:
 * /classes/socket.js
 */

/**
 * The Ids for the game controls
 * @type {Object}
 */
const ELEMENTS = {
  start: "#start",
  pause: "#pause",
  stop: "#stop",
  reset: "#reset",

  question: "#question",
  answers: "#answers"
};

$(document).ready(() => {
  const game = new GameSocket(BASE_URL, ELEMENTS);

  game.login(name, (success) => {
    if (success === false) window.location.replace(BASE_URL);

    game.listen();
  });

  $(ELEMENTS.start).on("click", e => game.start());
  $(ELEMENTS.reset).on("click", e => game.reset());
});
