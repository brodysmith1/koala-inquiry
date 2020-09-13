import * as d3 from "d3";

// Svg defs
let w = 200,
    h = 150;

// Get svg canvas
let svg = d3.select("#graph-extent-occurence")
let dots = svg.select('#occupancy');
let rect = svg.selectAll("#occurence");

//loopD();
//loopR();

function loopD() {
  dots
    .transition()
      .duration(100)
      .delay(1500)
      .selectAll('circle')
      .attr('cx', function(){ return this.getAttribute('cx')/2; } )
      .attr('cy', function(){ return this.getAttribute('cy')/2; } );

  dots
    .transition()
      .delay(3100)
      .duration(100)
      .selectAll('circle')
      .attr('cx', function() {return this.getAttribute('cx')*2;} )
      .attr('cy', function() {return this.getAttribute('cy')*2;} )
    .on('end',loopD);
}

function loopR() {
  rect
    .transition()
      .delay(1500)
      .duration(1500)
      .attr('transform','scale(0.7)')
    .transition()
      .delay(1500)
      .duration(1500)
      .attr('transform','scale(1)')
    .on('end',loopR);
}


// svg.append('g')
//   .selectAll('circle')
//   .data(cx)
//   .enter()
//   .append('circle')
//   .attr('r', 2)
//   .attr('cx', (d,i) => cx[i] )
//   .attr('cy', (d,i) => cy[i] );
//
// svg.append('g')
//   .append('polygon')
//   .attr('points',)

// function saveSvg(svgEl, name) {
//     svgEl.setAttribute("xmlns", "http://www.w3.org/2000/svg");
//     var svgData = svgEl.outerHTML;
//     var preface = '<?xml version="1.0" standalone="no"?>\r\n';
//     var svgBlob = new Blob([preface, svgData], {type:"image/svg+xml;charset=utf-8"});
//     var svgUrl = URL.createObjectURL(svgBlob);
//     var downloadLink = document.createElement("a");
//     downloadLink.href = svgUrl;
//     downloadLink.download = name;
//     document.body.appendChild(downloadLink);
//     downloadLink.click();
//     document.body.removeChild(downloadLink);
// } saveSvg(document.querySelector("#graph-extent-occurence svg"), 'dots');
