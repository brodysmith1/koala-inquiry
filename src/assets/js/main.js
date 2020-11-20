import VanillaTilt from "vanilla-tilt";

import { triggerMapSLN } from "./mapping.js";
import { loadMaps } from "./mapping.js";

import { loadGraphEOC } from "./graph.js";
import { triggerForestCuts } from "./graph.js";

import { layoutGrid } from "./force.js";
import { layoutSplit } from "./force.js";

import "./graph.js"

const start = new Date();

// ENUMS
const COVER = 0,
      LOCATION = 3,
      TOURISM = 7,
      CULTURE = 8,
      INDIG = 9,
      CUTS = 11,
      RECOS = 16,
      SOLNS = 19

// COLORS
const cream     = "#ece5d8",
      black     = "#191c1c",
      green100  = "#a4e3ad",
      green200  = "#6da990",
      green300  = "#4c8075",
      green400  = "#2f493d",
      yellow100 = "#fffff0",
      blue300   = "#2b314f",
      blue400   = "#000a19"

// STATE
var x  = 0,
    n  = 33,
    i  = 0,
    bg         = green400,
    navActive  = false,
    mapNSWPlay = false

// ELEMENTS
const body      = document.querySelector('body'),
      nav       = document.querySelector('#nav'),
      mapSLN    = document.querySelector('#soln-map'),
      navLine   = document.querySelector('#nav-line'),
      navItems  = document.querySelectorAll('.nav-item'),
      navLabel  = document.querySelector('#nav-label'),
      pager     = document.querySelector('#pager'),
      recoms    = document.querySelectorAll('.recommendation')

// Responsiveness
var vw = document.querySelector('.slide').getBoundingClientRect().width;

// Event listeners
document.addEventListener('DOMContentLoaded', onLoad);  // TODO: DEBOUNCE
document.addEventListener('keydown', checkKey);         // TODO: DEBOUNCE
window.onresize = onResize;                             // TODO: DEBOUNCE


// Load
function onLoad() {

  document.fonts.ready.then( () => { const end = new Date(); console.log (`Fonts loaded in ${end-start}ms`) } )

  update(null);
  setNav();
  loadMaps();
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
  switch(e.keyCode){
    // R
    case 39: checkX(true); break;
    // L
    case 37: checkX(false); break;
    // End
    case 35: jumpTo(n-1); break;
    // Home
    case 36: document.activeElement.tagName === "BODY" ? jumpTo(0) : ""; break;
    // Space
    case 32: if (i==CULTURE) togglePlay(); break;
    // Tab
    case 9: i!=(n-1) ? e.preventDefault() : ""; break;
  }
}


// Slide across
function slide(fwd) {
  let p = i;
  let slides = document.querySelector('.slides');

  x += fwd ? -vw : vw;
  i += fwd ? 1 : -1;

  translateX(slides, x);
  onSlide(p);
}


// Execute methods when a slide becomes in view
function onSlide(p) {
  let prev = document.querySelectorAll('.slide')[p];
  let cur  = document.querySelectorAll('.slide')[i];
  let bgPrv = prev.querySelector('.bg-image');
  let bgCur = cur.querySelector('.bg-image');

  bgPrv ? bgPrv.classList.remove('active') : "";
  bgCur ? bgCur.classList.add('active')  : "";

  update(p); // Execute specific behaviour for targeted slides
}

function update(p) {

  let bgi = green400

  // Execute specific behaviour for targeted slides
  if (p == COVER) { offHome() }
  //else if ( p == TOURISM)  { document.querySelector('#obama').classList.toggle('hidden') }
  else if ( p == CULTURE)  { document.querySelector('video').pause(); }

  if (i == COVER) { onHome(); }
  //else if (i == TOURISM)  { document.querySelector('#obama').classList.toggle('hidden') }
  else if (i == CULTURE)  { document.querySelector('video').play(); }
  else if (i == INDIG)    { bgi = black; }
  else if (i == LOCATION) { bgi = blue400; }
  else if (i == CUTS)     { triggerForestCuts(); }
  else if (i == RECOS)    { layoutGrid(recoms); }
  else if (i == RECOS+1)  { layoutSplit(recoms, 1); }
  else if (i == RECOS+2)  { layoutSplit(recoms, 2); }
  else if (i == SOLNS)    { mapSLN.style.transform = "translateX(0)"; triggerMapSLN('georges');   bgi=blue400; }
  else if (i == SOLNS+1)  { mapSLN.style.transform = `translateX(${vw}px`; triggerMapSLN('gknp'); bgi=blue400; }

  pager.style.width = `${(100*i/(n-1)).toFixed(0)}%`       // Update progress bar
  bg != bgi ? setBackground(bgi) : "";   // Update color scheme
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
  nav.addEventListener('mouseenter', () => toggleNav(true)  )
  nav.addEventListener('mouseleave', () => toggleNav(false) )
  navItems.forEach( el => el.addEventListener('click', () => jumpTo(+el.dataset.slide)) )
}

function toggleNav(show) {

  if (show && !navActive) {
    navActive = !navActive;
    navLabel.style.opacity = 0;
    navItems.forEach( el => {
      el.style.opacity = 0;
      el.style.animationDirection = 'normal';
      restartAnimation(el, 'slide-up');
    });
  }
  else if (!show && navActive && i != COVER) {
    navActive = !navActive;
    navLabel.style.opacity = 0.75;
    navItems.forEach( el => {
      el.style.opacity = 1;
      el.style.animationDirection = 'reverse';
      restartAnimation(el, 'slide-up');
    });
  }

}

// Helpers
function setBackground(b) { body.style.background = bg = b }
function onHome() {
  toggleNav(true)
  nav.style.transform = ''
  navLine.style.opacity = 0.5
  navItems.forEach( e => e.classList.add('bg-green-400'))
}
function offHome() {
  toggleNav(false)
  navLine.style.opacity = 0
  nav.style.transform = 'translateY(5rem)'
  navItems.forEach( e => e.classList.remove('bg-green-400'))
}
function jumpTo(index) { // Jump to specific slide
  let p = i;
  let slides = document.querySelector('.slides');

  i = index;
  x = - index * vw;
  translateX(slides, x);
  onSlide(p);
}
function translateX(el, x) {    // Apply slide transform
  el.style.transform = `translateX(${x}px)`;
}
function checkX(fwd) {          // Check for start or end position
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
