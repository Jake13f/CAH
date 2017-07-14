/**
 * Required Files:
 * /socket.io/socket.io.js -- Library File
 * /classes/card.js
 */

/**
 * The Cards Against Humanity Game Socket that will manage all of the
 * interactions between the client and server
 * @type {GameSocket}
 */
class GameSocket {
  constructor (url, controls) {
    this.connection = io(url);
    this.elements = controls;
    this.cards = {
      question: null,
      answers: []
    };
  }

  /**
   * Returns the connection object
   * @return {object} the connection object
   */
  get socket () {
    return this.connection;
  }

  /**
   * Logs the user into the server
   * @param  {string} username the label identifying the users
   */
  login (username, callback) {
    this.connection.emit("login", username, (success) => { callback(success); });
  }

  /**
   * Verifies that the username hasn't been previously used
   * @param  {string} username string desired name to use
   * @param  {Function} callback sends the ok (true) whether or not it is good to use
   */
  checkName (username, callback) {
    this.connection.emit("check-name", username, (ok) => { callback(ok); });
  }

  start () { this.connection.emit("game:start"); }
  reset () { }

  /**
  * Adds all of the base event listeners for the game
  */
  listen () {
    /**
     * When the server is ready to start the game, store the received cards and
     * build their respective objects. Then prepare the page for the game.
     * @param  {Object} cards contains the question and answers for the respective player
     * @attribute  {Object} question - containing (text) and (pick) count
     * @attribute  {Array} answers - strings containing the text
     */
    this.connection.on("load-cards", cards => {
      // Setup the variables
      this.cards.question = new Question(cards.question.text, cards.question.pick);
      this.cards.answers  = cards.answers.map(card => new Answer(card));

      // Toggle elements
      $(this.elements.start).addClass("hide");
      $(this.elements.reset).removeClass("hide");

      // Render cards
      $(this.elements.question).append(this.cards.question.render());
      $(this.elements.answers).append(this.cards.answers.map(ans => ans.render()).join(""));
    });
  }
}
