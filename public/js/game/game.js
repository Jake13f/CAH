/**
 * REQUIRED FILES:
 * /classes/socket.js
 */

$(document).ready(() => {
  const game = new GameSocket(BASE_URL);
  game.login(name, (success) => {
    if (success === false) window.location.replace(BASE_URL);

    game.listen();
  });
});
