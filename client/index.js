/* eslint-disable object-curly-spacing */
/* global HangmanWord */
/* exported submitGuessAll modalToggle */
/* eslint-disable no-return-assign, quote-props, no-console */

const guessAllBtn = document.querySelector('#guess-all-btn');
const drawing = document.querySelector('#drawing');
const answerPlace = document.querySelector('#answer');
const barracks = document.querySelector('#barracks');
const loser = document.querySelector('#loser');
const winner = document.querySelector('#winner');
const letterContainer = document.querySelector('#letters');
const useKeyboard = document.querySelector("#useKeyboardCheckbox");

let modalShowing = false;

const hangman = new HangmanWord('this is a test', answerPlace, drawing);
addEventListener('resize', hangman.windowResized.bind(hangman));

function modalToggle() {
  modalShowing = !modalShowing;
}

function charIsAlpha(char) {
  return /^[a-z]$/i.test(char);
}

function submitGuessAll() {
  let guess = document.querySelector('#guess-all-in').value.trim().toLowerCase();
  hangman.solve();
  barracks.setAttribute('hidden', true);
  if (hangman.isPhrase(guess)) {
    winner.removeAttribute('hidden');
  } else {
    loser.removeAttribute('hidden');
  }
  guessAllBtn.setAttribute('disabled', true);
  letterContainer.innerHTML = '';
  modalShowing = false;
}

function doGuess(guess) {
  if (!charIsAlpha(guess)) {
    return;
  }

  let result = hangman.guess(guess);

  if (result == 'DEAD' || result == 'WIN') {
    barracks.setAttribute('hidden', true);
    guessAllBtn.setAttribute('disabled', true);
    letterContainer.innerHTML = '';
    hangman.solve();

    (result == 'DEAD' ? loser : winner).removeAttribute('hidden');
  }

  /*
   * don't care about these cases
   * if (result == 'NO' || result == 'GUESSED') { }
   */
}

let letterButtons = document.getElementsByClassName('letter');
for (let button of letterButtons) {
  button.onclick = function () {
    let [l] = this.id.split('-');
    this.classList.add('clicked');
    doGuess(l);
    Reflect.deleteProperty(this, 'onclick');
    this.blur();
  }
}

document.onkeypress = function (event) {
  if (!useKeyboard.checked) {
    return;
  }
  let { key } = event;
  if (!charIsAlpha(key)) {
    return;
  }
  let btn = document.querySelector(`#${key}-letter`);
  btn.click();
}

hangman.show();
