function showRandom(className) {
  let elements = document.getElementsByClassName(className);
  for (let i = 0; i < elements.length; i++)
    elements[i].style.visibility = 'collapse';
  elements[random(elements.length)].visibility = 'visible';
}


onload = () => {
  showRandom('quotes');
}
