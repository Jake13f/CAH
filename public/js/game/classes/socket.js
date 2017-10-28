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
      answers: [],
      selected: []
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
  login (username, room, callback) {
    this.connection.emit("login", username, room, (success) => { callback(success); });
  }

  /**
   * Verifies that the username hasn't been previously used
   * @param  {string} username string desired name to use
   * @param  {string} room the room to check
   * @param  {Function} callback sends the ok (true) whether or not it is good to use
   */
  checkName (username, room, callback) {
    this.connection.emit("check-name", username, room, (ok) => { callback(ok); });
  }

  /**
   * Lets the server know to start the game
   */
  start () { this.connection.emit("game:start"); }

  /**
  * Lets the server know to reset the game
  */
  reset () { this.connection.emit("game:reset"); }

  selectCard (index) {
    if (index >= 0 && index < this.cards.answers.length) {
      // Deselect a card if it is clicked on again
      if (this.cards.answers[index].selected === true) {
        this.cards.answers[index].deselect();
        this.cards.selected.splice(index, 1);
        return;
      }

      // Limit the number of cards selected
      while (this.cards.selected.length >= this.cards.question.pick) {
        this.cards.answers[this.cards.selected.shift()].deselect(); // Removes first item and returns it like a queue
      }

      this.cards.answers[index].select();
      this.cards.selected.push(index);
    }
  }

  /**
   * Gives a point to the winning user for the round.
   * @param {string} targetUser the user to increment score for because they were selected
   *                            for that round.
   */
  selectSubmission (targetUser) {
    this.connection.emit("select-submission", targetUser);
  }

  submitCards () {
    if (this.cards.selected.length !== this.cards.question.pick)
      return;

    // TODO: disable further selection
    $(this.elements.submit).addClass("hide");
    this.connection.emit("submit-cards", this.cards.selected);
  }

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
      this.cards.question = new Question(cards.question.text, cards.question.pick, this.elements.question_card);
      this.cards.answers  = cards.answers.map((card, index) => new Answer(card, index, this.elements.answer_card));

      // Toggle elements
      $(this.elements.start).addClass("hide");
      $(this.elements.reset).removeClass("hide");

      // Render cards
      $(this.elements.question).html(this.cards.question.render());
      $(this.elements.answers).html(this.cards.answers.map(ans => ans.render()).join(""));
    });

    /**
     * Toggle the user's screen to be set up for guessing
     */
    this.connection.on("guessing", () => {
      if ($(this.elements.submit).hasClass("hide") === false)
        $(this.elements.submit).addClass("hide");

      $(this.elements.overlay).removeClass("hide");
    });

    /**
     * Toggle the user's screen to be set up for answering
     */
    this.connection.on("answering", () => {
      $(this.elements.submit).removeClass("hide");
    });

    /**
     * Display the submitted cards.  Stores the user who submitted the card as data on the element.
     * @param  {object} submission contains the user's submitted cards and the username of the
     *                             person who sent them
     */
    this.connection.on("selected-cards", submission => {
      var html = submission.cards.map((card, index) => new Submission(card, this.elements.submission).render()).join("");
      var elem = $("<div>", { class: "submission" });
      elem.html(html);
      elem.data("user", submission.user);

      $(this.elements.submitted_answers).append(elem);
    });

    /**
     * Initialize the guesser's screen to allow them to select cards.
     */
    this.connection.on("start-guessing", () => {
      
    });

    /**
     * Renders the users and their scores to the screen.
     */
    this.connection.on("render:stats", stats => {
      stats = stats.map(stat => $("<li>", { text: stat.username + ": " + stat.score }));

      $(this.elements.users).html("");
      $(this.elements.users).append(stats);
    })
  }
}
