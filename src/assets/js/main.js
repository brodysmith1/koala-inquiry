var SWIPE_THRESHOLD = 1

import VanillaTilt from "vanilla-tilt";
import Tocca from "tocca";

import { loadMaps } from "./mapping.js";
import { triggerMapSLN } from "./mapping.js";

import { loadGraphEOC } from "./graph.js";

import { layoutGrid } from "./force.js";
import { layoutSetup } from "./force.js";
import { layoutSplit } from "./force.js";

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
    mapNSWPlay = false,
    loaded     = false,
    timeout    = false

// ELEMENTS
const body      = document.querySelector('body'),
      nav       = document.querySelector('#nav'),
      slides    = document.querySelector('.slides'),
      mapSLN    = document.querySelector('#soln-map'),
      navLine   = document.querySelector('#nav-line'),
      navItems  = document.querySelectorAll('.nav-item'),
      navLabel  = document.querySelector('#nav-label'),
      pager     = document.querySelector('#pager'),
      recoms    = document.querySelectorAll('.recommendation')

// Misc
var vw, vh
document.addEventListener('DOMContentLoaded', onDOMLoad)


function onDOMLoad() {

  vw = document.documentElement.clientWidth

  setTimeout(onFontLoad, 3000 ) // fallback if fonts don't load
  document.fonts.ready.then(onFontLoad)

  setNav()
  loadMaps()
  loadGraphEOC()
  layoutSetup()

  document.addEventListener('keydown', checkKey);
  window.onresize = () => { clearTimeout(timeout); timeout = setTimeout(onResize, 250) };
  document.querySelector('#video-container').addEventListener( 'click', togglePlay );
  document.querySelector('#volume').addEventListener( 'click', toggleSound );

  // Touch listeners
  slides.addEventListener('touchstart', e => e.preventDefault() );
  slides.addEventListener('touchmove', e => e.preventDefault() );
  slides.addEventListener('touchend', e => e.preventDefault() );

  slides.addEventListener('swipeleft',  e => checkX(true) );
  slides.addEventListener('swiperight', e => checkX(false) );
}

function onFontLoad() {
  if (loaded) { return }
  loaded = true
  const end = new Date()
  console.log(`Fonts loaded in ${end-start}ms`)
  document.querySelector('#loader').style.opacity = 0
  setTimeout( () => update(null), 200 )
}


// Resize
function onResize(e) {
  vw = document.documentElement.clientWidth;
  vh = document.documentElement.clientHeight;
  x = - i * vw;
  translateX(slides, x);
  console.log(vw, vh)
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
  if (p == null) { document.querySelector('#title-slide').style.display = 'block' }
  else if (p == COVER) { offHome() }
  else if ( p == CULTURE)  { document.querySelector('video').pause(); }

  if (i == COVER) { onHome(); }
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
