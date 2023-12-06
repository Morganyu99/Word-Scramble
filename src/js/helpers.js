export const AJAX = async function (url, max) {
  let condition = false;
  let word;
  while (!condition) {
    const response = await fetch(url);
    [word] = await response.json();
    if (word.length <= max) condition = true;
  }
  return word;
};

export const changeInnerHTML = function (element, markup) {
  document.querySelector(`.${element}`).innerHTML = markup;
};

export const appendHTML = function (element, markup) {
  document.querySelector(`.${element}`).insertAdjacentHTML("beforeend", markup);
};

export const changeText = function (element, text) {
  document.querySelector(`.${element}`).textContent = text;
};
