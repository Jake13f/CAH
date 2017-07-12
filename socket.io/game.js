/**
 * The Cards Against Humanity game that will be run and will manage all user
 * game sessions.
 * @type {Game}
 */

class Game {
  constructor (cards) {
    this.users = {};
    this.cards = cards || {};
    this.room = "";
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

    if (this.room === "")
      this.room = username; // Create the unique room

    client.username = username;
    client.join(this.room);
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

    this.users[username].leave(this.room);
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

  /**
   * Initializes the game for each user and removes the cards
   * from the deck.
   * @return {Object} The initial cards for the current game
   */
  load () {
    var cards = {
      question: {
        text: "N/a",
        pick: 0
      },
      answers: []
    };

    if (this.cards.blackCards === undefined || this.cards.whiteCards === undefined)
      return cards;

    // Choose a random question and remove it
    if (this.cards.blackCards.length < 1) {
      cards.question = "Out of Questions! Please start a new game."
    } else {
      var index = rand(this.cards.blackCards.length);
      cards.question = this.cards.blackCards[index];
      this.cards.blackCards.splice(index, 1); // Remove from the array
    }

    // Choose random answers and remove them for each user
    for (var user in this.users) {
      // TODO: Build separately for each user different hands
      for (var numCards = 0; numCards < 8; ++numCards) {
        if (this.cards.whiteCards.length < 1) break;

        index = rand(this.cards.whiteCards.length);
        cards.answers.push(this.cards.whiteCards[index]);
        this.cards.whiteCards.splice(index, 1); // Remove from the array
      }
    }

    return cards;
  }
}

/**
 * Returns a random number from 0 up to the max specified by range
 * Range 2 -> 0 - 1
 * Range 3 -> 0 - 2
 * ...
 * @param  {int} range the number of options
 * @return {int} a random integer between 0 and the range
 */
function rand (range) {
  return (range > 0) ? Math.floor(Math.random() * range) : -1;
}

module.exports = Game;
