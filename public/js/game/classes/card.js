/**
 * Defines the basic structure for a card
 * @type {Card}
 */
class Card {
  constructor (text, selector) {
    this.text = text;
    this.selector = selector;
  }

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
  constructor (text, index, selector) {
    super(text, selector);
    this.index = index;
    this.selected = false;
  }

  /**
   * Toggles the selected attribute
   */
  select () { this.selected = true; $(this.selector + "[data-index='" + this.index + "']").addClass("selected"); }
  deselect () { this.selected = false; $(this.selector + "[data-index='" + this.index + "']").removeClass("selected"); }

  /**
   * Builds the html for the given card
   * @return {string} HTML string for the given card
   */
  render () {
    return "<div class='card answer' data-index='" + this.index + "'>" + super.render() + "</div>";
  }
}

/**
 * Builds upon the Card class functionality unique to a Question
 * @type {Question}
 */
class Question extends Card {
  constructor (text, pick, selector) {
    super(text, selector);
    this.pick = pick;
  }

  /**
   * Builds the html for the given card
   * @return {string} HTML string for the given card
   */
  render () {
    return "<div class='card question'>" + super.render() + " (" + this.pick + ")</div>";
  }
}
