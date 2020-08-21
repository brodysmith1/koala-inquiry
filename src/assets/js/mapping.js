import * as d3 from "d3";
import * as topojson from "topojson"


let nsw = "../map-data/nsw-outline.json";

console.log(d3);

// Map defs
let projection = d3.geoEquirectangular();
let path = d3.geoPath().projection(projection);

// let topology = topojson.topology({foo: json})
// let topojsonObject = topojson.feature(nsw, nsw.FeatureCollection.features);
// let topojsonDataSet = topojsonObject.features;

let width = 1200,
    height = 800;

var svg = d3.select("body #nsw-map")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("preserveAspectRatio", "xMinYMin");


// svg.append("g")
//   .selectAll("path")
//   .data(topojsonDataSet)
//   .join("path")
//   .attr("fill", d => color(data.get(d.id)))
//   .attr("d", path);

// d3.json(nsw, function(error, mapData) {
//   var features = mapData.features;
//
//   // Update color scale domain based on data
//   color.domain([0, d3.max(features, nameLength)]);
//
//   // Draw each province as a path
//   mapLayer.selectAll('path')
//       .data(features)
//       .enter()
//       .append('path')
//       .attr('d', path)
//       .attr('vector-effect', 'non-scaling-stroke')
//       .style('fill', fillFn)
//       .on('mouseover', mouseover)
//       .on('mouseout', mouseout)
//       .on('click', clicked);
// });

console.log(svg);
