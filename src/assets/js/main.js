import VanillaTilt from "vanilla-tilt";

import { triggerMapNSW } from "./mapping.js";
import { triggerMapSLN } from "./mapping.js";
import { loadMapNSW } from "./mapping.js";
import { loadMapSLN } from "./mapping.js";

import { loadGraphEOC } from "./graph.js";
import { triggerForestCuts } from "./graph.js";

import { layoutGrid } from "./force.js";
import { layoutSplit } from "./force.js";

// Vars
var x = 0;
var n = 32;
var i = 0;

// ENUMS
const COVER = 0;
const LOCATION = 3;
const TOURISM = 8;
const CULTURE = 9;
const INDIGENOUS = 10;
const CUTS = 12;
const RECOS = 17;
const SOLNS = 19;

// Colors
const cream = "#ece5d8";
const black = "#232626";
const green100 = "#a4e3ad";
const green200 = "#6da990";
const green300 = "#4c8075";
const green400 = "#2f493d";
const yellow100 = "#fffff0";
const blue300 = "#2b314f";

// Responsiveness
var vw = document.querySelector('.slide').getBoundingClientRect().width;

// Misc
let navActive = true;
let mapNSWTriggered = false;
let invert = false;

// Handles
const body = document.querySelector('body');
const nav = document.querySelector('#nav');
const mapSLN = document.querySelector('#soln-map');
const navLine = document.querySelector('#nav-line');
const navItemBg = document.querySelectorAll('.nav-item-bg');
const pager = document.querySelector('#pager');
const recommendations = document.querySelectorAll('.recommendation');


// Event listeners
document.addEventListener('DOMContentLoaded', onLoad);  // TODO: DEBOUNCE
document.addEventListener('keydown', checkKey);         // TODO: DEBOUNCE
window.onresize = onResize;                             // TODO: DEBOUNCE


// Load
function onLoad() {
  update(null);
  setNav();
  loadMapNSW();
  loadMapSLN();
  loadGraphEOC();

  document.querySelector('#video-container').addEventListener( 'click', togglePlay );
  document.querySelector('#volume').addEventListener( 'click', toggleSound );
  document.querySelectorAll('.recommendation').forEach( el =>
    el.addEventListener( 'click', () => {
      let tt = el.querySelector('.tooltip')
      let toggle = el.classList.contains('active')
      let active = el.parentElement.querySelector('.active')

      if (active && !toggle) {
        active.firstElementChild.classList.toggle('opacity-0')
        active.classList.toggle('active')
      }

      el.classList.toggle('active')
      tt.classList.toggle('opacity-0')
      positionTT(tt)
    }))

}


// Resize
function onResize(e) {
  let slides = document.querySelector('.slides');
  vw = document.querySelector('.slide').getBoundingClientRect().width;
  x = - i * vw;
  translateX(slides, x);
}


// Check keypress
function checkKey(e) {
  e.keyCode == 39 ? checkX(true) :    // right
  e.keyCode == 37 ? checkX(false) :   // left
  e.keyCode == 35 ? jumpTo(n-1) :       // end
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

  i = index;
  x = - index * vw;
  translateX(slides, x);
  onSlide(p);
}


function update(p) {

  let bg = cream
  let colorScheme = invert

  // Execute specific behaviour for targeted slides
  if (p == COVER) { offHome() }
  else if (p == CULTURE) { document.querySelector('video').pause(); }
  else if (p == INDIGENOUS) { invert = false; }
  else if ( p == RECOS || p == RECOS+1 )  { invert = false; }
  else if ( p == SOLNS+1 )  { invert = false; }

  if (i == COVER) { onHome(); bg = green400; }
  else if (i == TOURISM || p == TOURISM) { document.querySelector('#obama').classList.toggle('hidden') }
  else if (i == CULTURE) { document.querySelector('video').play(); }
  else if (i == INDIGENOUS) { bg = black; invert = true;}
  else if (i == LOCATION) { if(!mapNSWTriggered){triggerMapNSW(); mapNSWTriggered = true;}  }
  else if (i == CUTS) { triggerForestCuts(); }
  else if (i == RECOS-1) { invert=false; }
  else if (i == RECOS)   { invert=true; bg=green400; layoutGrid(recommendations);  }
  else if (i == RECOS+1) { colorScheme=""; bg=green400; layoutSplit(recommendations); }
  else if (i == SOLNS)   { mapSLN.style.transform = "translateX(0)"; triggerMapSLN('georges');   colorScheme=""; invert=true; bg=green400;  }
  else if (i == SOLNS+1) { mapSLN.style.transform = `translateX(${vw}px`; triggerMapSLN('gknp'); colorScheme=""; invert=true; bg='#000a19'; }
  else if (i == SOLNS+2) { p==SOLNS+1 ? document.querySelector('#soln-map svg').style.background = 'none' : "" }

  pager.style.left = `calc(${(100*i/n).toFixed(2)}% + 10px)`       // Update progress bar
  colorScheme != invert ? updateColorScheme(bg) : "";   // Update color scheme
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
function setNav() {
  let navItems = document.querySelectorAll('.nav-item');

  nav.addEventListener('mouseenter', () => toggleNav(true)  )
  nav.addEventListener('mouseleave', () => toggleNav(false) )
  navItems.forEach( el => el.addEventListener('click', () => jumpTo(+el.dataset.slide)) )

}

function toggleNav(show) {

  if (show && !navActive) {
    navActive = !navActive;
    document.querySelectorAll('.nav-item').forEach( el => {
      el.classList.add('opacity-0');
      el.style.animationDirection = 'normal';
      restartAnimation(el, 'slide-up');
    });
  }
  else if (!show && navActive && i != COVER) {
    navActive = !navActive;
    document.querySelectorAll('.nav-item').forEach( el => {
      el.classList.remove('opacity-0');
      el.style.animationDirection = 'reverse';
      restartAnimation(el, 'slide-up');
    });
  }

}

function updateColorScheme(bg) {

  body.style.background = bg

  if (invert) {
    // ON FOR DEFAULT SCHEME
    nav.classList.remove('text-green-400')
    nav.classList.remove('border-transparent')
    // ON FOR DARK (inverted) SCHEME
    nav.classList.add('text-white')
    nav.classList.add('border-white')
  }
  else {
    // ON FOR DEFAULT SCHEME
    nav.classList.add('text-green-400')
    nav.classList.add('border-transparent')
    // ON FOR DARK (inverted) SCHEME
    nav.classList.remove('text-white')
    nav.classList.remove('border-white')
  }
}


// Helpers
function onHome() {
  invert = true
  toggleNav(true)
  nav.style.transform = ''
  setTimeout( () => {
   navLine.style.opacity = 0.5
   navItemBg.forEach( e => e.style.display = 'block')
  }, 500)
}
function offHome() {
  invert = false
  toggleNav(false)
  navLine.style.opacity = 0
  nav.style.transform = 'translateY(5rem)'
  navItemBg.forEach( e => e.style.display = 'none')
}

function translateX(el, x) {                  // Apply slide transform
  el.style.transform = `translateX(${x}px)`;
}
function checkX(fwd) {                        // Check for start or end position
  if (fwd) { i<(n-1) ? slide(fwd) : ""; }
  else { i==0 ? "" : slide(fwd); }
}
function restartAnimation(el, animationClassName) {
  el.classList.remove(animationClassName);
  el.offsetHeight; // trigger reflow
  el.classList.add(animationClassName);
}
function toggleClasses(el,classes) {
  for(var i=0; i < classes.length; i++) {
    el.classList.toggle(classes[i])
  }
}

function positionTT(tt){
  let rec = tt.getBoundingClientRect()
  let l = rec.left, t = rec.top
  t < 0 ? tt.style.lineHeight = '1.25rem' : ""
  t < 0 ? tt.style.fontSize = '.8rem' : ""
}


import "./graph.js"
