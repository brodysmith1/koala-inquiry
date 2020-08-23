import * as d3 from "d3";
import * as topojson from "topojson"

// Svg defs
let w = 900,
    h = 1000;

// Data defs
let ausmap = "./map-data/sa4-au-geo.json";
let towns = "./map-data/nsw-towns.json";
let arks = "./map-data/koala-arks-geo.json";
let extents = {
  "au": {
    "scale": 1050,
    "center": [138, -23.5],
    "bb": [[110, -6], [157, -46]]
  },
  "nsw": {
    "scale": 3550,
    "center": [148.8,-31.6],
    "bb": [[140, -27], [154, -39]]
  }
};


Promise.all([
  d3.json(ausmap),
  d3.json(towns),
  d3.json(arks)
]).then( (data) => drawMap(data) );


function drawMap (data) {

  let map = data[0];
  let towns = data[1];
  let arks = data[2];

  // Map defs
  let target = extents.nsw;
  let projection = d3.geoMercator()
    .center(target.center)
    .scale(target.scale);

  // Create svg canvas
  var svg = d3.select("body #nsw-map")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("viewBox", [0,0,w,h])
      .attr("preserveAspectRatio", "xMinYMin");

  // Define hatching pattern
  var defs = svg.append('defs');
  var g = defs.append("pattern")
     .attr('id', 'hatch')
     .attr('patternUnits', 'userSpaceOnUse')
     .attr('width', '5')
     .attr('height', '5')
     .attr("x", 0).attr("y", 0)
     .append("g")
      .style("fill", "none")
      .style("stroke", "white");
    g.append("path").attr("d", "M0,5 l5,-5");

  // Basemap
  svg.append('g')
    .selectAll('path')
    .data(map.features)
    .join('path')
    .attr('d', d3.geoPath(projection))
    .attr('fill','none')
    .attr('stroke', (d) => d.properties.state=="NSW" ? '#fffa' : "#fff3")
    .attr('stroke-width', '.5')
    .attr('stroke-linejoin', 'round');

  // ARKS
  svg.append('g')
    .selectAll('path')
    .data(arks.features)
    .join('path')
    .attr('d', d3.geoPath(projection))
    // .attr('fill', 'url(#hatch)')
    .attr('fill', 'none')
    .attr('stroke', '#0a0')
    .attr('stroke-linejoin', 'round');

  // Town dots
  svg.append('g')
    .selectAll('circle')
    .data(towns.features)
    .join('circle')
    .attr('r', 3)
    .attr('cx', (d) => projection(d.geometry.coordinates)[0] )
    .attr('cy', (d) => projection(d.geometry.coordinates)[1] )
    .attr('fill','white');

  // Town names
  svg.append('g')
    .selectAll('text')
    .data(towns.features)
    .join('text')
      .attr('fill', 'white' )
      .attr('x', (d) => projection(d.geometry.coordinates)[0] )
      .attr('y', (d) => projection(d.geometry.coordinates)[1] )
      .attr('dx', 12)
      .attr('dy', 6)
      .attr("text-anchor", "start")
      .text( (d) => d.properties.name );


}


// Helpers

function toXY(lon, lat) {
  let x = lon > 0  ? 180 + lon : -lon;
  let y = lat < 0  ?  90 - lat : lat;
  return [w*x/360, h*y/180];
}
function scaleToBB(bb) {
  let x0 = bb[0][0], x1 = bb[1][0], y0 = bb[0][1], y1 = bb[1][1];
  return Math.min(8, 0.9 / Math.max((x1 - x0) / w, (y1 - y0) / h));
}
function mean(a,b) {
  return (a + b) / 2;
}
