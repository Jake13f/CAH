class Game {
  constructor (cards) {
    this.users = {};
    this.cards = cards || {};
  }

  /**
   * Logs the user into the game session adding them to the users dictionary
   * @param  {string} username the label to use for the new user
   * @param  {object} client socket.io connection object
   * @return {boolean} true if the user was successfully logged in, false otherwise
   */
  login (username, client) {
    if (this.users[username] !== undefined)
      return false; // name already used

    client.username = username;
    this.users[username] = client;
    return true
  }

  /**
   * Removes the user from the game session
   * @param  {string} username the label that represents the user disconnecting
   * @return {boolean} true if the user was successfully logged out, false otherwise
   */
  logout (username) {
    if (this.users[username] === undefined)
      return false;

    delete this.users[username];
    return true;
  }

  /**
   * Checks to see if the username is available
   * @param  {string} username the label to use for the new user
   * @return {boolean} true if the name is available, false otherwise
   */
  checkName (username) {
    return this.users[username] === undefined;
  }
}

module.exports = Game;
