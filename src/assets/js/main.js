import VanillaTilt from "vanilla-tilt";
import { mapTriggerNSW } from "./mapping.js";
import { loadMapNSW } from "./mapping.js";

// Vars
var x = 0;
var n = 18;
var i = 0;

// ENUMS
const COVER = 0;
const CULTURE = 8;
const INDIGENOUS = 9;
const NSW_MAP = 14;

// Colors
const cream = "#ece5d8";
const black = "#232626";
const green400 = "#2f493d";
const blue300 = "#2b314f";

// Misc
let mapTriggered = false;
let invert = true;

// Event listeners
document.addEventListener('DOMContentLoaded', onLoad);   // TODO: DEBOUNCE
document.addEventListener('keydown', checkKey);   // TODO: DEBOUNCE
window.onresize = onResize;                       // TODO: DEBOUNCE


// Load
function onLoad() {
  onSlide(0);
  setNavigation();
  document.querySelector('#video-container').addEventListener( 'click', togglePlay );
  document.querySelector('#volume').addEventListener( 'click', toggleSound );
  loadMapNSW();
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

  e.keyCode == 32 && i==CULTURE ? togglePlay() : "";   // spacebar
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

  update(p); // Execute specific behaviour for targeted slides
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


function update(p) {
  let body = document.querySelector('body');

  // Update nav trackbar
  pager();

  // Execute specific behaviour for targeted slides
  if (p == COVER) { body.style.background = cream; invert = false; }
  if (i == COVER) { body.style.background = green400; invert = true; }
    else if (i==1 || i==n) { body.style.background = cream; }
  if (i == CULTURE) { document.querySelector('video').play(); }
    else if (Math.abs(CULTURE-i) == 1) { document.querySelector('video').pause(); }
  if (i == INDIGENOUS) { body.style.background = black; invert = true;}
    else if (Math.abs(INDIGENOUS-i) == 1) { body.style.background = cream; invert = false;}
  if (i == NSW_MAP) { if(!mapTriggered){mapTriggerNSW(); document.querySelector('#nsw-map-text').style.display = 'flex'; mapTriggered = true;}  }
}

// Video functions
function togglePlay() {
  let v = document.querySelector('video');
  let p = v.paused;
  let icons = document.querySelectorAll('#video-controls svg');

  if (p) { v.play(); icons[0].classList.add('animate-ping-once'); icons[1].classList.remove('animate-ping-once'); }
  else  { v.pause(); icons[1].classList.add('animate-ping-once'); icons[0].classList.remove('animate-ping-once'); }
}

function toggleSound() {
  let v = document.querySelectorAll('#volume svg');
  v.forEach( btn => btn.classList.toggle('opacity-0') );
  document.querySelector('video').muted = !document.querySelector('video').muted;
}


// Other events
function setNavigation() {
  let nav = document.querySelector('#nav');
  let navItems = document.querySelectorAll('.nav-item');

  nav.addEventListener('mouseover',  () => toggleNav(true) );
  nav.addEventListener('mouseleave', () => toggleNav(false) );

  navItems.forEach( el => {
    el.addEventListener('click', () => jumpTo(parseInt(el.dataset.slide, 10)) );
  });

}

function pager() {
  let steps = document.querySelectorAll('#nav .flex-1');
  if (invert) { steps.forEach( (s,ix) => s.style.background = ix < i ?  'white' : ix == i ? 'black' : 'none' ); }
  else { steps.forEach( (s,ix) => s.style.background = ix < i ?  'black' : ix == i ? 'white' : 'none' ); }
}


// Helpers
function translateX(el, x) {                  // Apply slide transform
  el.style.transform = `translateX(${x}px)`;
}
function checkX(fwd) {                        // Check for start or end position
  if (fwd) { i<n ? slide(fwd) : ""; }
  else { i==0 ? "" : slide(fwd); }
}
function toggleNav(show) {
  if (show) { document.querySelectorAll('.nav-item').forEach( el => el.classList.remove('hidden') ); }
  else { document.querySelectorAll('.nav-item').forEach( el => el.classList.add('hidden') ); }
}
