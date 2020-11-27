var x0
var threshold = 30
const slides = document.querySelector('.slides')

slides.addEventListener('touchstart', touchStart)
slides.addEventListener('touchmove', touchMove)
slides.addEventListener('touchend', touchEnd)

function touchStart(e) {
  console.log('start')
  x0 = e.pageX
}

function touchMove(e) {
  console.log('move')
}

function touchEnd(e) {
  console.log(e.touches[0])
  e.pageX - x0 > threshold ? slide(true)
    : e.pageX - x0 < -threshold ? slide(false)
    : ""
}
