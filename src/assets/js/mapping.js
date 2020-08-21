import * as d3 from "d3";
import * as topojson from "topojson"


// Svg defs
let width = 800,
    height = 420;

// Data defs
let nsw = "./map-data/nsw-outline.json";

d3.json(nsw).then( (data) => {

  // Map defs
  let projection = d3.geoEquirectangular().fitSize([width, height], data),
      path = d3.geoPath().projection(projection);

  var svg = d3.select("body #nsw-map")
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("preserveAspectRatio", "xMinYMin");

  svg.append('g')
    .selectAll('path')
    .data(data.features)
    .join('path')
    .attr('d', path)
    .attr('fill','none')
    .attr('stroke', 'black');

    console.log(data.features);
});
