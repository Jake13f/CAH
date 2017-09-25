/**
 * The Cards Against Humanity game that will be run and will manage all user
 * game sessions.
 * @type {Game}
 */

class Game {
  constructor (cards, roomname) {
    this.users = {};
    this.cards = cards || {};
    this.room = roomname || "";
    this.started = false;
    this.guessing = "";
  }

  /**
   * Logs the user into the game session adding them to the users dictionary
   * @param  {string} username the label to use for the new user
   * @param  {object} client socket.io connection object
   * @return {boolean} true if the user was successfully logged in, false otherwise
   */
  login (username, client) {
    if (this.users[username] !== undefined || this.started)
      return false; // name already used

    if (this.guessing === "")
      this.guessing = username;

    client.username = username;
    client.roomname = this.room;
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
   * Handles the submission of cards and the sending of the selected
   * cards to the clients.
   * @param  {string} user the username of the person submitting
   * @param  {array} cards integers of the indexes of selected cards
   */
  submitCards (user, cards) {
    this.users[user].submitted = cards || [];

    var allSubmitted = true;
    var submission = {
      user: user,
      cards: this.users[user].submitted.map(card => this.users[user].cards.answers[card])
    };

    for (var user in this.users) {
      this.users[user].emit("selected-cards", submission);

      if (this.users[user].submitted.length === 0 && this.guessing !== user) {
        allSubmitted = false;
      }
    }

    if (allSubmitted === true) {
      // TODO: Let the guesser select an answer
      this.users[this.guessing].emit("start-guessing");
    }
  }

  /**
   * Initializes the game for each user and removes the cards
   * from the deck.
   */
  load () {
    if (this.started || this.cards.blackCards === undefined || this.cards.whiteCards === undefined)
      return;

    this.started = true; // Mark the game as started

    // Choose a random question and remove it
    var question = {
      text: "N/a",
      pick: 0
    };
    if (this.cards.blackCards.length < 1) {
      cards.question.text = "Out of Questions! Please start a new game.";
      cards.question.pick = 0;
    } else {
      var index = rand(this.cards.blackCards.length);
      question = this.cards.blackCards[index];
      this.cards.blackCards.splice(index, 1); // Remove from the array
    }

    // Choose random answers and remove them for each user
    for (var user in this.users) {
      var cards = {
        question: question,
        answers: []
      };

      if (user === this.guessing) // Init the guesser's screen
        this.users[user].emit("guessing");
      else
        this.users[user].emit("answering");

      for (var numCards = 0; numCards < 8; ++numCards) {
        if (this.cards.whiteCards.length < 1) break;

        index = rand(this.cards.whiteCards.length);
        cards.answers.push(this.cards.whiteCards[index]);
        this.cards.whiteCards.splice(index, 1); // Remove from the array
      }

      this.users[user].cards = cards;
      this.users[user].submitted = [];
      this.users[user].emit("load-cards", cards);
    }
  }

  /**
   * Resets the current game and starts over
   * @param {Object} cards The cards to use for the game
   */
  reset (cards) {
    this.cards = cards;
    this.started = false;
    this.load();
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
