// Vars
var x = 0;
var i = 0;

// Event listeners
document.addEventListener('keydown', checkKey);   // TODO: DEBOUNCE
window.onresize = onResize;                       // TODO: DEBOUNCE


// Resize
function onResize(e) {
  let slides = document.querySelector('.slides');
  let vw = document.querySelector('.slide').getBoundingClientRect().width;
  x = - i * vw;
  translateX(slides, x);
}


// Check keypress
function checkKey(e) {
  e.keyCode == 37 ? slide(true) :
  e.keyCode == 39 ? slide(false) : "";
}


// Slide
function slide(fwd) {
  let slides = document.querySelector('.slides');
  let slide = document.querySelector('.slide');
  let dx = slide.getBoundingClientRect().width;

  x += fwd ? dx : -dx;
  i += fwd ? -1 : 1;
  translateX(slides, x);
}


// Helpers
function translateX(el, x) {
  el.style.transform = `translateX(${x}px)`;
}
