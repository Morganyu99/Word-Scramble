import { CURRENT, MAX_TRIES, NEXT, RANDOM, RESET } from "../config.js";
import { appendHTML, changeInnerHTML, changeText } from "../helpers.js";

class GameView {
  _parentElement = document.querySelector(".game__container");
  _inputElements = document.querySelectorAll(".input__field");
  _wordDetails;

  addClickHandler(handler) {
    this._parentElement.addEventListener("click", function (e) {
      if (e.target.closest(".reset__button")) handler(RESET);
      if (e.target.closest(".random__button")) handler(RANDOM);
    });
  }
  inputFocusNext(nextIndex) {
    this._inputElements[nextIndex].focus();
  }
  inputClearAndSubs(index, value) {
    this._inputElements[index].value = value;
  }

  addInputHandler(handler) {
    //So that event listener can be removed when needed
    const inputHandle = function (e) {
      //check state
      console.log(e);
      const index = e.target.id.slice().split("").pop();

      const value = this._inputElements[index].value;
      console.log(value);
      //if only 1 letter currently-> go next(or) more than 1 letter -> replace and go next
      if (value.length >= 1) handler(e.data, index, NEXT); //////
      //currently 0 ->stay
      if (value.length === 0) handler(e.data, index, CURRENT);
      //previous 0 current 0-> go back
    };
    //as input elements dom keep changing
    this._inputElements = document.querySelectorAll(".input__field");
    //Auto focus on input for initialization
    this.inputFocusNext(0);
    console.log(this._inputElements);
    [...this._inputElements].map((el) =>
      el.addEventListener("input", inputHandle.bind(this))
    );
  }

  updateShowcase(wordDetails) {
    this._wordDetails = wordDetails;
    changeText("showcase__heading", this._wordDetails.scrambledWord);
  }

  resetGame() {
    changeInnerHTML(
      "tries-mistakes__container",
      `
    <div class="tries-mistakes">
    <span class="tries-mistakes__context small-text"
      >Tries <span class="tries--number">(0/${MAX_TRIES})</span>
    </span>
    <span class="tries__dots">
      <span class="tries__dot tries__dots" id="dot-1"></span>
      <span class="tries__dot tries__dots" id="dot-2"></span>
      <span class="tries__dot tries__dots" id="dot-3"></span>
      <span class="tries__dot tries__dots" id="dot-4"></span>
      <span class="tries__dot tries__dots" id="dot-5"></span>
    </span>
  </div>
  <div class="tries-mistakes">
    <span class="tries-mistakes__context small-text">Mistakes </span>
    <span class="mistakes--word">_,_,_,_,_</span>
  </div>
    `
    );
    changeInnerHTML("input__fields-container", "");
    this._wordDetails.wordName.split("").map((letter, i) => {
      appendHTML(
        "input__fields-container",
        `
        <input
        type="text"
        required
        class="input__field"
        id="field-${i}"
      />
        `
      );
    });
  }
}

export default new GameView();
