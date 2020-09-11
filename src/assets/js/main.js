import va from "vanilla-tilt";

// Vars
var x = 0;
var n = 16;
var i = 0;

// ENUMS
const COVER = 0;
const INDIGENOUS = 8;
const NSW_MAP = 9;

// Colors
const cream = "#ece5d8";
const black = "#232626";
const green400 = "#2f493d";
const blue300 = "#2b314f";


// Event listeners
document.addEventListener('DOMContentLoaded', onLoad);   // TODO: DEBOUNCE
document.addEventListener('keydown', checkKey);   // TODO: DEBOUNCE
window.onresize = onResize;                       // TODO: DEBOUNCE


// Load
function onLoad() {
  onSlide(0);
}


// Resize
function onResize(e) {
  let slides = document.querySelector('.slides');
  let vw = document.querySelector('.slide').getBoundingClientRect().width;
  x = - i * vw;
  translateX(slides, x);
}


// Check keypress
function checkKey(e) {
  e.keyCode == 39 ? checkX(true) :    // right
  e.keyCode == 37 ? checkX(false) :   // left
  e.keyCode == 35 ? jumpTo(n) :       // end
  e.keyCode == 36 ? jumpTo(0) : "";   // home
}


// Slide across
function slide(fwd) {
  let p = i;
  let slides = document.querySelector('.slides');
  let dx = document.querySelector('.slide').getBoundingClientRect().width;

  x += fwd ? -dx : dx;
  i += fwd ? 1 : -1;

  translateX(slides, x);
  onSlide(p);
}


// Execute methods when a slide becomes in view
function onSlide(p) {
  let prev = document.querySelectorAll('.slide')[p];
  let cur = document.querySelectorAll('.slide')[i];
  let bgPrev = prev.querySelector('.bg-image');
  let bgCur = cur.querySelector('.bg-image');

  bgPrev ? bgPrev.classList.remove('active') : "";
  bgCur  ? bgCur.classList.add('active')  : "";

  uniqueSlide(); // Execute specific behaviour for targeted slides
}


// Jump to specific slide
function jumpTo(index) {
  let p = i;
  let slides = document.querySelector('.slides');
  let vw = document.querySelector('.slide').getBoundingClientRect().width;

  i = index;
  x = - index * vw;
  translateX(slides, x);
  onSlide(p);
}

// Execute specific behaviour for targeted slides
function uniqueSlide() {
  let body = document.querySelector('body');

  if (i == COVER) { body.style.background = green400; }
    else if (i==1 || i==n) { body.style.background = cream; }
  if (i == INDIGENOUS) { body.style.background = black; }
    else if (Math.abs(INDIGENOUS-i) == 1) { body.style.background = cream; }
  if (i == NSW_MAP) { document.querySelector('#nsw-map').style.display = 'block'; document.querySelector('#nsw-map-text').style.display = 'flex';  }
}


// Helpers
function translateX(el, x) {                  // Apply slide transform
  el.style.transform = `translateX(${x}px)`;
}
function checkX(fwd) {                        // Check for start or end position
  if (fwd) { i<n ? slide(fwd) : ""; }
  else { i==0 ? "" : slide(fwd); }
}



import "./mapping.js";
