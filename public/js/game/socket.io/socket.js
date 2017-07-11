const PROTOCOL = window.location.protocol;
const HOSTNAME = window.location.hostname;
const BASE_URL = PROTOCOL + "//" + HOSTNAME;
const PORT = 3000;

class GameSocket {
  constructor (url) {
    this.connection = io(url);
  }

  /**
   * Returns the connection object
   * @return {object} the connection object
   */
  get socket () {
    return this.connection;
  }

  /**
   * Adds all of the base event listeners for the game
   */
  listen () {
    this.connection.on("test", () => { console.log("test"); });
  }

  /**
   * Logs the user into the server
   * @param  {string} username the label identifying the users
   */
  login (username) {
    this.connection.emit("login", username, (success) => { console.log(success); });
  }
}

$(document).ready(() => {
  const game = new GameSocket(BASE_URL + ":" + PORT);
  game.listen();

  $("#login").on("click", function (e) {
    var name = $("#username").val();
    game.login(name);
  });
});
