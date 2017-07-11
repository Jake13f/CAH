/**
 * Required Files:
 * /socket.io/socket.io.js -- Library File
 */

/**
 * The Cards Against Humanity Game Socket that will manage all of the
 * interactions between the client and server
 * @type {GameSocket}
 */
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
