/**
 * Defines the basic structure for a card
 * @type {Card}
 */
class Card {
  constructor (text) {
    this.text = text;
    this.selected = false;
  }

  /**
   * Toggles the selected attribute
   */
  select () { this.selected = true; }
  deselect () { this.selected = false; }

  /**
   * Builds the html for the given card
   * @return {string} HTML string for the given card
   */
  render () {
    return "<span>" + this.text + "</span>";
  }
}

/**
 * Builds upon the Card class functionality unique to an Answer
 * @type {Answer}
 */
class Answer extends Card {
  /**
   * Builds the html for the given card
   * @return {string} HTML string for the given card
   */
  render (index) {
    return "<div class='card answer' data-index='" + index + "'>" + super.render() + "</div>";
  }
}

/**
 * Builds upon the Card class functionality unique to a Question
 * @type {Question}
 */
class Question extends Card {
  constructor (text, pick) {
    super(text);
    this.pick = pick;
  }

  /**
   * Builds the html for the given card
   * @return {string} HTML string for the given card
   */
  render () {
    return "<div class='card question'>" + super.render() + "</div>";
  }
}
