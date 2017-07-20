/**
 * REQUIRED FILES:
 * /classes/socket.js
 */

/**
 * The Ids for the game controls
 * @type {Object}
 */
const ELEMENTS = {
  start: "#start",
  pause: "#pause",
  stop: "#stop",
  reset: "#reset",
  submit: "#submit-answer",

  question: "#question",
  answers: "#answers",
  submitted_answers: "#submitted-answers",
  submission: ".submission",

  answer_card: ".answer",
  question_card: ".question",
  selected: ".selected"
};

$(document).ready(() => {
  const game = new GameSocket(BASE_URL, ELEMENTS);

  game.login(name, room, (success) => {
    if (success === false) window.location.replace(BASE_URL);

    game.listen();
  });

  $(ELEMENTS.start).on("click", e => game.start());
  $(ELEMENTS.reset).on("click", e => game.reset());

  $(document).on("click", ELEMENTS.answer_card, function (e) { game.selectCard($(this).data("index")); });
  $(document).on("click", ELEMENTS.submit, function (e) { game.submitCards(); });
});
