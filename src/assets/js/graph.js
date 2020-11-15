import * as d3 from "d3";

// AREA OF OCCUPANCY AND EXTENT OF OCCURENCE GRAPHS
// eoo = 0.7, aoo = 0.5
// Calculations:
// Base size = 200 x 150 = 30K pixels
// Base occupancy = 100 dots per 30K pixels (1 dot per 300px)

// Scaled extent = 166 x 125 = 21K pixels (0.7 x 30K)
// Scaled occupancy:
//    -> 21K / 300 = 70 dots
//    -> 0.5 x 70 dots = 35 dots

// VERSION 2
// Scaled extent = 140 x 150 = 21K pixels
// Scaled occupancy remains as above

export function loadGraphEOC() {

  let shrink = false;

  // ui elements
  let btn1 = d3.select("#radio-first");
  let btn2 = d3.select("#radio-second");

  btn1.on('click', () => { shrink = !shrink; !shrink ? trigger(shrink) : "" });
  btn2.on('click', () => { shrink = !shrink;  shrink ? trigger(shrink) : "" });

}

function trigger(shrink) {
  shrinkDots(shrink);
  shrinkRect(shrink);
  dissolveDots(shrink);
}

function shrinkDots(shrink) {

  let dots = d3.select("#graph-extent-occurence #occupancy");
  let w = 200,
      h = 150,
      eoo = 0.7,
      scale = 2;

  w *= scale;
  h *= scale;

  dots.transition()
    .duration(1500)
    .selectAll('circle')
    .attr('transform', function() {
      if (!shrink) { return "translate(0 0)" }
      else {
        let dx = 100*eoo*(0.5-this.getAttribute('cx')*scale/w)
        let dy = 0
        return `translate(${dx} ${dy})`
      }
    });
}

function shrinkRect(shrink) {
  let rect = d3.select("#graph-extent-occurence #occurence");
  rect.transition()
    .duration(1500)
    .attr('transform', shrink ? 'scale(0.7, 1)' : 'scale(1)' )
    .attr('stroke-width', shrink ? '1' : '0' )
}

function dissolveDots(shrink) {
  let dissolve = d3.select('#graph-extent-occurence #occupancy .dissolve');
  dissolve
    .transition()
    .duration(1500)
    .style('opacity', () => shrink ? 0 : 1 )
}


// ---   1000 CUTS ANIMATION   --- //

export function triggerForestCuts() {

  let trees = d3.selectAll("#trees rect")
  trees.style("opacity",1)
  trees.transition()
    .duration(500)
    .delay( (d,i) => 1000 + 350*Math.floor(1 + i/5) + 350*Math.abs(i%10 - 5) )
    .style('opacity',0)
// Math.sqrt((i+15)%20) * 1500 * Math.max(0.5,Math.random())
}
