export const layoutGrid = (nodes) => {

  nodes.forEach( (r, i) => {
    let t = 100 * Math.floor(i/7)/7
    let l = 100 * (i%7) / 7
    r.style = `top: ${t}%; left: ${l}%`
  })

  // Re-allow pointer events for faded nodes
  let fade = [...nodes].filter((n,i) => [1,18,28,29,30,32,34,35].includes(i+1))
      fade.forEach( r => r.classList.remove('pointer-events-none') )

  let a = nodes[0].parentElement.querySelectorAll('.annotation')
      a.forEach( ai => ai.style.opacity = 0 )

  layoutMove(nodes[0], false)

}

export const layoutSplit = (nodes) => {

  let t, x
  let a = nodes[0].parentElement.querySelectorAll('.annotation')

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
  soln.forEach( (r,i) => r.style = `top: 80%; left: ${100*(i+2)/6}%; transform: scale(1.1); z-index: 10` )

  frag.forEach( (r,i) => {
    [t,x] = [100 * Math.floor(i/5)/7, 100 * (i%5) / 8]
    r.style = `top: ${t}%; left: ${x}%` })

  fire.forEach( (r,i) => {
    [t,x] = [100 * Math.floor(i/2)/7, 100 - 100 * ((i+1)%2) / 8]
    r.style = `top: ${t}%; left: calc(${x}% - 48px)` })

  a[0].style = "opacity: 1; top: -13%; left: 8px;"
  a[1].style = `opacity: 1; top: -13%; left: calc(${100*7/8}% + ${16-a[1].offsetWidth/2}px);`
  a[2].style = `opacity: 1; top: 95%;  left: calc(50% - 90px);`

  layoutMove(nodes[0], true)

}

function layoutMove(n,i) {
  let c = n.parentElement.parentElement
  let x = i ? document.querySelector('.slide').getBoundingClientRect().width : 0
  c.style.transform = `translateX(${x}px)`
}
