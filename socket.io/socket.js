const Cards = require("../library/base.json");
const Game  = require("./game.js");
var games = {};

module.exports = (io) => {
  io.on("connection", (client) => {
    /**
     * Logs the user into the system
     * @param  {string} username the name to label the user
     * @param  {string} roomname the name of the room to join or create
     * @param  {Function} callback a callback function letting the emit know the login status
     */
    client.on("login", (username, roomname, callback) => {
      var game = games[roomname];

      if (checkForGame(roomname, games) === false)
        game = games[roomname] = new Game(clone(Cards), roomname);

      callback(game.login(username, client));
    });

    /**
     * Checks whether the username is already in use
     * @param  {string} username the name to check for
     * @param  {Function} callback sends back the true or false if the name is ok to
     *                             use or not
     */
    client.on("check-name", (username, roomname, callback) => {
      if (checkForGame(roomname, games) === true) {
        var game = games[roomname];
        callback(game.checkName(username));
      }
      else
        callback(true);
    });

    /**
     * Starts the game and sends out the cards to the users
     */
    client.on("game:start", () => {
      if (checkForGame(client.roomname, games) === true) {
        var game = games[client.roomname];
        game.load();
      }
    });

    /**
     * Starts the game and sends out the cards to the users
     */
    client.on("game:reset", () => {
      if (checkForGame(client.roomname, games) === true) {
        var game = games[client.roomname];
        game.reset(clone(Cards));
      }
    });

    /**
     * Handles the event of a user submitting their cards
     */
    client.on("submit-cards", cards => {
      if (checkForGame(client.roomname, games) === true) {
        var game = games[client.roomname];
        game.submitCards(client.username, cards);
      }
    });

    /**
     * Disconnect event
     * Removes the user from the collection
     */
    client.on("disconnect", () => {
      if (checkForGame(client.roomname, games)) {
        var game = games[client.roomname];
        game.logout(client.username);

        // Removes the game if no users left
        if (Object.keys(game.users).length === 0) {
          delete game;
        }
      }
    });
  });
}

/**
 * Clones an Object to prevent a reference to another
 * @param  {Object} obj The object to copy
 * @return {Object} The new object without reference
 */
function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Determines if the game room exists or not to help prevent any errors
 * @param  {string} room the name of the room
 * @param  {Object} games Dictionary of game objects
 * @return {boolean} true if the game exists, false otherwise
 */
function checkForGame (room, games) {
  if (room === undefined || games[room] === undefined)
    return false;
  else
    return true;
}
