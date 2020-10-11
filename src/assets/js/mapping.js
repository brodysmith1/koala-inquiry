import * as d3 from "d3";
import * as topojson from "topojson"

export function loadMapNSW() {

  // Data defs
  let ausmap = "./map-data/sa4-au-east.json";
  let towns = "./map-data/nsw-towns.json";
  let hubs = {};

  hubs.src = ["./map-data/wwf_all.json",
               "./map-data/wwf_crown.json",
               "./map-data/wwf_private.json",
               "./map-data/wwf_state.json",
               "./map-data/burned-area.json",
              ];

  Promise.all([
    d3.json(ausmap),
    d3.json(towns),
    d3.json(hubs.src[0]),
    d3.json(hubs.src[1]),
    d3.json(hubs.src[2]),
    d3.json(hubs.src[3]),
    d3.json(hubs.src[4])
  ]).then( (data) => drawMap(data, hubs) );

  console.log('loaded');
}
export function mapTriggerNSW() {

  // Animation defs
  const n = 5,
        delay = 4000;

  d3.selectAll(".hubs")
    .transition()
    .duration(1000)
    .delay( (d,i) => i ? (i+1)*delay : 0)
    .style("opacity", 1)
    .transition()
    .duration(1000)
    .delay( (d,i) => i ? delay-1000 : 2*delay-1000)
    .style("opacity",0);

  d3.select(".hubs-fires")
    .transition()
    .duration(1000)
    .delay(n*delay)
    .style("opacity",0.75)
    .transition()
    .duration(1000)
    .delay(delay-1000)
    .style("opacity",0);

  d3.select(".hubs-all")
    .transition()
    .duration(1000)
    .delay((n)*delay)
    .style("opacity",1);

  // TRANSITIONS: towns
  d3.selectAll(".towns")
    .transition()
    .duration(1000)
    .delay(delay)
    .style("opacity",1);

  // TRANSITIONS: Accompanying paragraphs
  d3.selectAll(".map-p")
    .transition()
    .duration(1000)
    .delay( (d,i) => i*delay )
    .style("opacity",1)
    .transition()
    .duration(1000)
    .delay(delay-1000)
    .style("opacity",0.2);

  d3.selectAll(".map-p")
    .transition()
    .delay((n+1)*delay)
    .duration(1000)
    .style("opacity",1);

  d3.selectAll(".map-p .cursor-pointer")
    .style('transition', 'background-color 0.5s, color 0.5s')
    .on('click', showData);

  d3.select(".map-p .cursor-pointer")
    .transition()
    .delay((n+1)*delay)
    .on('end', showData);

  d3.select("#map-progress")
    .transition()
      .duration((n+1)*delay)
      .ease(d3.easeLinear)
      .style('height','100%');

  d3.select("#map-progress")
    .transition()
    .delay((n+1)*delay)
      .duration(0)
      .style('bottom','0')
    .transition()
      .duration(1000)
      .ease(d3.easeElasticIn.amplitude(1).period(0.841))
      .style('height','0%');

}

function drawMap (data) {

  // Svg defs
  let w = 900,
      h = 1000;

  let extents = {
    "au": {
      "scale": 1050,
      "center": [138, -23.5],
      "bb": [[110, -6], [157, -46]]
    },
    "nsw": {
      "scale": 3550,
      "center": [151.8,-31.4],
      "bb": [[140, -27], [154, -39]]
    }
  };

  // Data defs
  let map   = data[0];
  let towns = data[1];
  let fires = data[6];
  let hubs = {};

  hubs.all = data[2];
  hubs.crown = data[3];
  hubs.private = data[4];
  hubs.state = data[5];

  // Map defs
  const highlights = ["Greater Sydney","Southern Highlands and Shoalhaven","Coffs Harbour - Grafton","Richmond - Tweed","Mid North Coast"];
  let target = extents.nsw;
  let projection = d3.geoMercator()
    .center(target.center)
    .scale(target.scale);

  // Create svg canvas
  var svg = d3.select("body #nsw-map")
      .append("svg")
      .attr("width", "100%")
      .attr("height", h)
      .attr("viewBox", [0,0,w,h])
      .attr("preserveAspectRatio", "xMinYMin")
      .attr("class", "bg-white");

  // Basemap
  svg.append('g')
    .selectAll('path')
    .data(map.features)
    .join('path')
    .attr('d', d3.geoPath(projection))
    .attr('class', 'basemap fill-current text-green-400')
    .attr('stroke', 'white')
    .attr('stroke-width', 0.2)
    .classed('highlight', d => highlights.includes(d.properties.name) );

  // ALL HUBS
  svg.append('g')
    .selectAll('path')
    .data(hubs.all.features)
    .join('path')
    .attr('d', d3.geoPath(projection))
    .attr('class', 'hubs hubs-all stroke-current fill-current text-yellow-300 opacity-0');

  // CROWN HUBS
  svg.append('g')
    .selectAll('path')
    .data(hubs.crown.geometries)
    .join('path')
    .attr('d', d3.geoPath(projection))
    .attr('class', 'hubs hubs-crown stroke-current fill-current text-yellow-300 opacity-0');

  // STATE HUBS
  svg.append('g')
    .selectAll('path')
    .data(hubs.state.geometries)
    .join('path')
    .attr('d', d3.geoPath(projection))
    .attr('class', 'hubs hubs-state stroke-current fill-current text-yellow-300 opacity-0');

  // PRIVATE HUBS
  svg.append('g')
    .selectAll('path')
    .data(hubs.private.geometries)
    .join('path')
    .attr('d', d3.geoPath(projection))
    .attr('class', 'hubs hubs-private stroke-current fill-current text-yellow-300 opacity-0');

  // BUSHFIRES
  svg.append('g')
    .selectAll('path')
    .data(fires.geometries)
    .join('path')
    .attr('d', d3.geoPath(projection))
    .attr('class', 'hubs-fires fill-current text-black opacity-0');

  // Town names
  svg.append('g')
    .selectAll('text')
    .data(towns.features)
    .join('text')
      .attr('class', 'towns fill-current text-green-400 opacity-0')
      .attr('x', d => projection(d.geometry.coordinates)[0] )
      .attr('y', d => projection(d.geometry.coordinates)[1] )
      .attr('dx', -1)
      .attr('dy', 7)
      .attr("text-anchor", "start")
      .text( (d) => "– " + d.properties.name )
      .attr('display', d => {
        return d.properties.name == "Coffs Harbour" || d.properties.name == "Byron Bay" ||
        d.properties.name == "Newcastle" || d.properties.name == "Wollongong" ||
        d.properties.name == "Port Macquarie" || d.properties.name == "Sydney" ? "block" : "none"
      });

}
function showData() {
  let t = this.dataset.target;
  if (t==4) {
    this.classList.toggle('text-white');
    this.classList.toggle('bg-black');
    d3.select('.hubs-fires')
      .transition()
      .duration(500)
      .style('opacity', this.classList.contains('bg-black') ? 0.75 : 0 );
  }
  else {
    d3.selectAll('.hubs')
      .transition()
      .duration(500)
      .style('opacity', (d,i) => i==t ? 1 : 0 );

    d3.selectAll(".map-p .cursor-pointer")
      .classed('bg-yellow-300', false);

     this.classList.toggle('bg-yellow-300');
  }
}
