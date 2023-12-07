import gameView from "./Views/gameView.js";
import { FOCUS, RANDOM, RESET } from "./config.js";
import * as model from "./model.js";
import "core-js/stable";
import "regenerator-runtime/runtime";
import { async } from "regenerator-runtime";

const getRandom = async function () {
  await model.getScrambledWord();
  gameView.updateShowcase(model.wordObject);
  gameView.resetGame();
  gameView.addInputHandler(controlInput);
};

const controlGame = function (ev, value) {
  gameView.removeEventListenersInput();
  if (ev === RESET) {
    model.resetWordObject();
    gameView.resetGame(model.wordObject);
    gameView.addInputHandler(controlInput);
  }
  if (ev === RANDOM) {
    getRandom();
    gameView.disableReset(false);
  }
  if (ev === FOCUS) {
    gameView.resetTriesMistakes(
      model.wordObject.tries,
      model.wordObject.wordArrCorrectAndWrong[value].mistake
    );
  }
};
const checkAllWords = function () {
  if (model.checkallWordsinWritten()) {
    gameView.updateShowcase("Success!🎉", true);
    gameView.disableReset();
    return;
  }
};

const controlInput = function (value, index, isdisabled = false) {
  if (isdisabled && model.wordObject.wordName.length - 1 > index) {
    gameView.inputFocusNext(index + 1, controlInput);
    return;
  }
  if (isdisabled && model.wordObject.wordName.length - 1 === index) {
    checkAllWords();
    return;
  }

  //check if input is correct for the index
  if (model.checkWord(value, index)) {
    //same for all cases
    gameView.inputClearAndSubs(index, value);
    model.pushWrittenWord(value, index);
    gameView.inputDisable(index);

    //check if last word
    if (model.wordObject.wordName.length - 1 === index) {
      checkAllWords();
      return;
    }

    //reset
    model.resetTries();
    gameView.resetTriesMistakes(
      model.wordObject.tries,
      model.wordObject.wordArrCorrectAndWrong[index + 1].mistake
    );

    gameView.inputFocusNext(index + 1, controlInput);
    return;
  }

  //if not correct
  gameView.inputClearAndSubs(index, value);
  const result = model.pushInMistakes(index, value);
  if (!result) {
    controlGame(RESET);
    return;
  }
  gameView.resetTriesMistakes(
    model.wordObject.tries,
    model.wordObject.wordArrCorrectAndWrong[index].mistake
  );
};

const init = async function () {
  await getRandom();
  gameView.addClickHandler(controlGame);
};

init();
