export const layoutSetup = () => {

  document.querySelectorAll('.recommendation').forEach( el =>
    el.addEventListener( 'click', e => {
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

      e.stopPropagation();
    }))

  document.querySelector("#recs").addEventListener('click', collapseAnnotations);

}

export const layoutGrid = (nodes) => {

  nodes.forEach( (r, i) => {
    let t = 100 * Math.floor(i/7)/7
    let l = 100 * ((i%7) / 7 + 1/21)
    r.style = `top: ${t}%; left: ${l}%`
  })

  // Re-allow pointer events for faded nodes
  let fade = [...nodes].filter((n,i) => [1,18,28,29,30,32,34,35].includes(i+1))
      fade.forEach( r => r.classList.remove('pointer-events-none') )

  let a = nodes[0].parentElement.querySelectorAll('.annotation')
      a.forEach( ai => ai.style.opacity = 0 )

  layoutMove(nodes[0], 0)
  collapseAnnotations()
  showText(0)
}

export const layoutSplit = (nodes, page) => {

  let t, x
  let a  = nodes[0].parentElement.querySelectorAll('.annotation')

  let r = [
        [5, 7, 41],
        [1, 18, 28, 29, 30, 32, 34, 35],
        [15, 16, 17, 19, 20, 21, 22, 42],
        [2, 3, 4, 6, 8, 9, 10, 11, 12, 13, 14, 23, 24, 25, 26, 27, 31, 33, 36, 37, 38, 39, 40]
      ]

  let soln = [...nodes].filter( (n,i) => r[0].includes(i+1) ),
      fade = [...nodes].filter( (n,i) => r[1].includes(i+1) ),
      fire = [...nodes].filter( (n,i) => r[2].includes(i+1) ),
      frag = [...nodes].filter( (n,i) => r[3].includes(i+1) )


  fade.forEach( r => {r.style.opacity = 0; r.classList.add('pointer-events-none')} )
  soln.forEach( (r,i) => r.style = `top: 80%; left: ${100*(i+2)/6}%; transform: scale(1.1);` )
  a.forEach( ai => ai.style.opacity = 1)

  if (page == 1) {

    frag.forEach( (r,i) => {
      r.classList.remove('pointer-events-none');
      [t,x] = [100 * Math.floor(i/5)/7, 100 * (i%5) / 8]
      r.style = `top: ${t}%; left: ${x}%` })

    fire.forEach( (r,i) => {
      r.classList.remove('pointer-events-none');
      [t,x] = [100 * Math.floor(i/2)/7, 100 - 100 * ((i+1)%2) / 8]
      r.style = `top: ${t}%; left: calc(${x}% - 48px)` })


    soln[1].classList.remove('pointer-events-none')

  }

  if (page == 2) {

    fire.forEach( r => {r.style.opacity = 0; r.classList.add('pointer-events-none')} )
    frag.forEach( r => {r.style.opacity = 0; r.classList.add('pointer-events-none')} )
    a.forEach( (ai,i) => i!=2 ? ai.style.opacity = 0 : "" )

    soln[1].classList.add('pointer-events-none')
    soln[1].style.opacity = 0
    soln[0].style.left = "42.5%"
    soln[2].style.left = "57.5%"

  }

  layoutMove(nodes[0], page)
  collapseAnnotations()
  showText(page)

}

function collapseAnnotations() {
  let active = document.querySelector('#recs .active')
  if (active) {
    active.firstElementChild.classList.toggle('opacity-0')
    active.classList.remove('active')
  }
}

function showText(i) {
  let t = document.querySelectorAll('.recommendation-text')
  t.forEach( (e,j) => e.style.opacity = i==j ? 1 : 0 )
}

function layoutMove(n,i) {
  let c = n.parentElement.parentElement
  let x = i*c.offsetWidth;
  c.style.transform = `translateX(${x}px)`
}

function positionTT(tt) {
  let rec = tt.getBoundingClientRect()
  let l = rec.left, t = rec.top

  // t < 0 ? tt.style.lineHeight = '1.25rem' : ""
  // t < 0 ? tt.style.fontSize = '.8rem' : ""
  if ( t < 0 ) { tt.style.bottom = "unset"; tt.style.top = "110%" }
  tt.parentElement.parentElement.appendChild(tt.parentElement)

}
