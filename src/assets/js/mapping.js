import * as d3 from "d3";
import * as topojson from "topojson"

let nsw = "../map-data/nsw-outline.json";
console.log(nsw);
let topojsonObject = topojson.feature(nsw, nsw.FeatureCollection.features);
let topojsonDataSet = topojsonObject.features;

let width = 960,
    height = 1160;

const svg = d3.create("svg").attr("viewBox", [0, 0, 975, 610]);

svg.append("g")
  .selectAll("path")
  .data(topojsonDataSet)
  .join("path")
  .attr("fill", d => color(data.get(d.id)))
  .attr("d", path);
