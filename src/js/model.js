import { API_TYPES, API_URL, MAX_LETTERS } from "./config.js";
import { AJAX } from "./helpers.js";

export const wordObject = {
  wordName: "",
  scrambledWord: "",
  wordArrCorrectAndWrong: [],
  tries: 0,
  written: "",
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
  console.log(wordObject);
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
};

export const resetWordObject = function () {
  wordObject.wordArrCorrectAndWrong.map((el) => (el.mistake = []));
  wordObject.tries = 0;
};
