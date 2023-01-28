'use strict';

function hideAll(className) {
  let elements = document.getElementsByClassName(className);
  for (let i = 0; i < elements.length; i++)
    elements[i].hidden = 'hidden';
}

function showRandom(className) {
  let elements = document.getElementsByClassName(className);
  elements[Math.floor(Math.random() * elements.length)].removeAttribute('hidden');
}

onload = () => {
  showRandom('quotes');
}
