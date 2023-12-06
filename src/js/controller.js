import gameView from "./Views/gameView.js";
import { CURRENT, NEXT, PREV, RANDOM, RESET } from "./config.js";
import * as model from "./model.js";

const getRandom = async function () {
  await model.getScrambledWord();
  gameView.updateShowcase(model.wordObject);
  gameView.resetGame();
  gameView.addInputHandler(controlInput);
};

const controlGame = function (ev) {
  if (ev === RESET) {
    model.resetWordObject();
    console.log(model.wordObject);
    gameView.resetGame(model.wordObject);
    gameView.addInputHandler();
  }
  if (ev === RANDOM) {
    getRandom();
  }
};

const controlInput = function (value, index, where) {
  if (where === PREV) {
    gameView.inputFocusNext(+index - 1);
  }
  if (where === NEXT) {
    if (value) gameView.inputClearAndSubs(index, value);
    gameView.inputFocusNext(+index + 1);
  }
  if (where === CURRENT) {
  }
};

const init = async function () {
  await getRandom();
  gameView.addClickHandler(controlGame);
};

init();
