import { API_TYPES, API_URL, MAX_LETTERS, MAX_TRIES } from "./config.js";
import { AJAX } from "./helpers.js";

export const wordObject = {
  wordName: "",
  scrambledWord: "",
  wordArrCorrectAndWrong: [],
  tries: MAX_TRIES,
  written: [],
};

const fetchWord = async function () {
  try {
    //random number between 0-2
    const randomTypeIndex = Math.trunc(Math.random() * 3);
    const url = API_URL + API_TYPES[randomTypeIndex];
    wordObject.wordName = await AJAX(url, MAX_LETTERS);
  } catch (err) {
    console.log(err);
  }
};

const insertCorrectWord = function (wordArr) {
  wordObject.wordArrCorrectAndWrong = wordArr.map((letter) => {
    return { correct: letter, mistake: [] };
  });
};
export const resetWritten = function (wordLength) {
  wordObject.written = new Array(wordLength);
};

export const getScrambledWord = async function () {
  await fetchWord();
  const word = wordObject.wordName;
  const wordArrOld = word.split("");
  const wordArr = word.split("").map((_, i) => {
    const random = Math.trunc(Math.random() * wordArrOld.length);
    return wordArrOld.splice(random, 1);
  });
  const scrambledWord = wordArr.join("");
  wordObject.scrambledWord = scrambledWord;
  insertCorrectWord([...word]);
  resetWritten(word.length);
};

export const resetTries = function () {
  wordObject.tries = MAX_TRIES;
};

export const resetWordObject = function () {
  wordObject.wordArrCorrectAndWrong.map((el) => (el.mistake = []));
  resetTries();
  resetWritten(wordObject.wordName.length);
};

export const pushWrittenWord = function (value, index) {
  wordObject.written[+index] = value.toLowerCase();
};

export const checkWord = function (value, index) {
  if (wordObject.wordName[index] === value) return true;
  return false;
};

export const checkallWordsinWritten = function () {
  if (
    !wordObject.written.includes("") &&
    !(wordObject.written.join("") !== wordObject.wordName)
  )
    return true;

  return false;
};

export const pushInMistakes = function (index, value) {
  wordObject.wordArrCorrectAndWrong[index].mistake.push(value);
  const result = removeTries();

  return result;
};
const removeTries = function () {
  wordObject.tries--;

  if (wordObject.tries < 0) return false;
  return true;
};
