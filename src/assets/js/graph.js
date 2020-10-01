import * as d3 from "d3";

// Svg defs
let w = 200,
    h = 150,
    scale = 2;

w *= scale;
h *= scale;

// Anim defs
let aoo = 0.7,
    eoo = 0.5,
    shrink = false;

// Calculations:
// Base size = 200 x 150 = 30K pixels
// Base occupancy = 100 dots per 30K pixels (1 dot per 300px)
// Scaled extent = 166 x 125 = 21K pixels (0.7 x 30K)
// Scaled occupancy:
//    -> 21K / 300 = 70 dots
//    -> 0.5 x 70 dots = 35 dots

// Get svg canvas
let svg = d3.select("#graph-extent-occurence")
let dots = svg.select('#occupancy');
let dissolve = dots.select('.dissolve');
let rect = svg.selectAll("#occurence");

loopShrinkDots();
loopShrinkRect();
loopDissolve();

function loopShrinkDots() {
  shrink = !shrink;
  dots
    .transition()
      .delay(shrink ? 2500 : 3000)
      .duration(1500)
      .on('end',loopShrinkDots)
      .selectAll('circle')
      .attr('transform', function() {
        if (!shrink) { return "translate(0 0)" }
        else {
          let dx = 100*(0.5-this.getAttribute('cx')*scale/w)*(1-eoo);
          let dy = 100*(0.5-this.getAttribute('cy')*scale/h)*(1-eoo);
          return `translate(${dx} ${dy})`;
        }
      });
}

function loopShrinkRect() {
  rect
    .transition()
      .delay(shrink ? 2500 : 3000)
      .duration(1500)
      .attr('transform', shrink ? 'scale(0.833)' : 'scale(1)' )
      .attr('stroke-width', shrink ? '1' : '0' )
    .on('end',loopShrinkRect);
}

function loopDissolve() {
  dissolve
    .transition()
      .delay(shrink ? 2500 : 3000)
      .duration(1500)
      .attr('opacity', () => shrink ? 0 : 1 )
    .on('end',loopDissolve);
}