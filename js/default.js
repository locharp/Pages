function showRandom(className) {
  let elements = document.getElementsByClassName(className);
  for (let i = 0; i < elements.length; i++)
    elements[i].style.visibilty = 'collapse';
  elements[random(elements.length)].visibility = 'visible';
}


onload = () => {
  showRandom('quotes');
}
