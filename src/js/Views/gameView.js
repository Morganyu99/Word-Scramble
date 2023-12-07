import { MAX_TRIES, RANDOM, RESET, FOCUS } from "../config.js";
import { appendHTML, changeInnerHTML, changeText } from "../helpers.js";

class GameView {
  _parentElement = document.querySelector(".game__container");
  _inputElements = document.querySelectorAll(".input__field");
  _wordDetails;
  _inputHandle;

  addClickHandler(handler) {
    // for this keyword to be linked to gameView
    const targetChecker = function (e) {
      if (e.target.closest(".reset__button")) handler(RESET);
      if (e.target.closest(".random__button")) handler(RANDOM);
      if (e.target.closest(".input__field")) {
        const id = e.target.id.slice().split("").pop();
        this.inputFocusNext(id);
        handler(FOCUS, e.target.id.slice().split("").pop());
      }
    };

    //click event handler
    this._parentElement.addEventListener("click", targetChecker.bind(this));
  }
  //disable input
  inputDisable(index) {
    this._inputElements[index].setAttribute("disabled", "true");
  }

  //focus the input
  inputFocusNext(nextIndex, handler) {
    //checking if input is disabled
    const attributeRes =
      this._inputElements[nextIndex].getAttribute("disabled");
    //callback if the input is disabled
    if (attributeRes) {
      handler("", nextIndex, true);
      return;
    }

    [...this._inputElements].map((el) => el?.setAttribute("placeholder", ""));
    this._inputElements[nextIndex]?.focus();
    this._inputElements[nextIndex]?.setAttribute("placeholder", "_");

    return;
  }

  //substitute the prev value with new value in input
  inputClearAndSubs(index, value) {
    this._inputElements[index].value = value;
  }

  //to remove input listener
  removeEventListenersInput() {
    [...this._inputElements].map((el) =>
      el.removeEventListener("input", this._inputHandle)
    );
  }

  addInputHandler(handler) {
    this._inputHandle = function (e) {
      //check if the input is correct by sending to controller

      const index = +e.target.id.slice().split("").pop();
      const value = e.data ? e.data.slice().split("").pop() : "";

      handler(value.toLowerCase(), index);
    };

    // as input elements dom keep changing
    this._inputElements = document.querySelectorAll(".input__field");
    //Auto focus on input for initialization
    this.inputFocusNext(0);
    //adding input event listener
    [...this._inputElements].map((el) =>
      el.addEventListener("input", this._inputHandle.bind(this))
    );
  }

  //Update showcase with scrambled word
  updateShowcase(wordDetails, success = false) {
    if (success) {
      changeText("showcase__heading", wordDetails);
      return;
    }
    this._wordDetails = wordDetails;
    changeText("showcase__heading", this._wordDetails.scrambledWord);
  }

  //reset game html
  resetGame() {
    this.resetTriesMistakes(MAX_TRIES, []);
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

  //if won disable reset button
  disableReset(state = true) {
    if (state) {
      this._parentElement
        .querySelector(".reset__button")
        .setAttribute("disabled", "true");
      return;
    }
    this._parentElement
      .querySelector(".reset__button")
      .removeAttribute("disabled");
  }
  resetTriesMistakes(tries, mistakes) {
    const triesHTML = Array.from({ length: MAX_TRIES }, (_, i) => {
      if (i < tries) {
        return `<span class="tries__dot tries__dots--highlight" id="dot-${
          i + 1
        }"></span>`;
      }
      return `<span class="tries__dot" id="dot-${i + 1}"></span>`;
    }).join("");
    const mistakesHTML = Array.from({ length: MAX_TRIES }, (_, i) => {
      if (i < MAX_TRIES - 1) return (mistakes[i] ? mistakes[i] : "_") + `,`;
      if (i === MAX_TRIES - 1) return mistakes[i] ? mistakes[i] : "_";
    }).join("");

    changeInnerHTML(
      "tries-mistakes__container",
      `
      <div class="tries-mistakes">
      <span class="tries-mistakes__context small-text"
        >Tries <span class="tries--number">(${tries}/${MAX_TRIES})</span>
      </span>
      <span class="tries__dots">
      ${triesHTML}  
      </span>
    </div>
    <div class="tries-mistakes">
      <span class="tries-mistakes__context small-text">Mistakes </span>
      <span class="mistakes--word">${mistakesHTML}</span>
    </div>
      `
    );
  }
}

export default new GameView();
