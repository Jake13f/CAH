const Cards = require("../library/base.json");
const Game  = require("./game.js");
var game = new Game(clone(Cards));

module.exports = (io) => {
  io.on("connection", (client) => {
    /**
     * Logs the user into the system
     * @param  {string} username the name to label the user
     * @param  {Function} cb a callback function letting the emit know the login status
     */
    client.on("login", (username, callback) => {
      callback(game.login(username, client));
      io.to(game.room).emit("load-cards", game.load());
    });

    /**
     * Checks whether the username is already in use
     * @param  {string} username the name to check for
     * @param  {Function} callback sends back the true or false if the name is ok to
     *                             use or not
     */
    client.on("check-name", (username, callback) => {
      callback(game.checkName(username));
    });

    /**
     * Disconnect event
     * Removes the user from the collection
     */
    client.on("disconnect", () => {
      game.logout(client.username);
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
