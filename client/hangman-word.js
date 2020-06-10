/* exported HangmanWord */

const w = "http://www.w3.org/2000/svg";

function attrStroke(elt) {
  elt.setAttribute('stroke', 'black');
  elt.setAttribute('stroke-width', '5');
  elt.setAttribute('fill', '#fff');
  elt.style.transform = 'translate(-2500px, 0px)';
  elt.classList.add('scales-up');
}

function svgLine(x1, y1, x2, y2) {
  let l = document.createElementNS(w, 'line');
  l.setAttribute('x1', `${x1}px`);
  l.setAttribute('y1', `${y1}px`);
  l.setAttribute('x2', `${x2}px`);
  l.setAttribute('y2', `${y2}px`);
  attrStroke(l);
  return l;
}

class HangmanWord {
  constructor(phrase, guessParent, barracksContainer) {
    this.phrase = phrase.toLowerCase();
    this.guessParent = guessParent;
    this.barracksContainer = barracksContainer;
    this.unique = 0;
    this.letters = {};
    let s = new Set();
    for (let i = 0; i < phrase.length; i++) {
      this.letters[this.phrase.charAt(i)] = true;
      if (!s.has(this.phrase.charAt(i))) {
        this.unique++;
        s.add(this.phrase.charAt(i));
      }
    }
    if (s.has(' ')) {
      this.unique--;
    }

    this.guessed = {};

    this.body = [];
    this.nextShow = 0;

    this.createStickFigure(barracksContainer.getBoundingClientRect());
  }

  isPhrase(phrase) {
    phrase = phrase.trim().toLowerCase();
    return this.phrase == phrase;
  }

  solve() {
    for (let letter of Object.keys(this.letters)) {
      this.guessed[letter] = true;
    }
    this.show();
  }

  guess(letter) {
    letter = letter.toLowerCase();
    if (this.guessed[letter] && !this.checkWin()) {
      return "GUESSED"
    }

    if (!this.guessed[letter] && this.letters[letter]) {
      this.unique--;
    }

    this.guessed[letter] = true;

    if (this.hasLetter(letter)) {
      this.show();
      if (this.checkWin()) {
        return 'WIN';
      } else {
        return 'YES';
      }
    } else {
      if (this.nextShow == this.body.length - 1) {
        return 'DEAD';
      }
      this.body[this.nextShow++].style.transform = 'translate(0px, 0px)';
      return 'NO';
    }
  }

  createStickFigure(bounds) {
    let bodyX = bounds.width / 2;
    let bodyY = bounds.height / 2 - bounds.height / 4 + bounds.height / 15;
    let bodyHeight = bounds.height / 5;

    let circle = document.createElementNS(w, 'circle');
    circle.setAttribute('cx', `${bounds.width / 2}px`);
    circle.setAttribute('cy', `${bounds.height / 2 - bounds.height / 4}px`);
    circle.setAttribute('r', `${bounds.height / 15}px`);
    attrStroke(circle);
    circle.style.transform = 'translate(0px, -200vh)';
    this.barracksContainer.appendChild(circle);
    this.body.push(circle);

    let bod = svgLine(bodyX, bodyY, bodyX, bodyY + bodyHeight);
    bod.style.transform = 'translate(0px, 200vh)';
    this.barracksContainer.appendChild(bod);
    this.body.push(bod);

    let leftArm = svgLine(bodyX, bodyY, bodyX - bounds.height / 8, bodyY + bounds.height / 12);
    leftArm.style.transform = 'translate(-200vw, 0px)';
    this.barracksContainer.appendChild(leftArm);
    this.body.push(leftArm);

    let rightArm = svgLine(bodyX, bodyY, bodyX + bounds.height / 8, bodyY + bounds.height / 12);
    rightArm.style.transform = 'translate(200vw, 0px)';
    this.barracksContainer.appendChild(rightArm);
    this.body.push(rightArm);

    let leftLeg = svgLine(bodyX, bodyY + bodyHeight, bodyX - bounds.height / 8, bodyY + bounds.height / 12 + bodyHeight);
    leftLeg.style.transform = 'translate(-200vw, 0px)';
    this.barracksContainer.appendChild(leftLeg);
    this.body.push(leftLeg);

    let rightLeg = svgLine(bodyX, bodyY + bodyHeight, bodyX + bounds.height / 8, bodyY + bounds.height / 12 + bodyHeight);
    rightLeg.style.transform = 'translate(200vw, 0px)';
    this.barracksContainer.appendChild(rightLeg);
    this.body.push(rightLeg);
  }

  windowResized() {
    this.body = [];
    this.barracksContainer.innerHTML = '';
    this.createStickFigure(this.barracksContainer.getBoundingClientRect());
    for (let i = 0; i < this.nextShow; i++) {
      this.body[i].style.transform = 'translate(0px, 0px)'
    }
  }

  isRevealed(letter) {
    letter = letter.toLowerCase();
    return this.guessed[letter] && this.letters[letter];
  }

  hasLetter(letter) {
    letter = letter.toLowerCase();
    return this.letters[letter];
  }

  show() {
    let x = this.phrase.split(' ').map(v => v.split('').map(c => this.guessed[c] ? c : '_').join(''));
    this.guessParent.textContent = x.join(' ');
  }

  checkWin() {
    return this.unique == 0;
  }
}
