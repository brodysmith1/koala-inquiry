import * as d3 from "d3";
import * as topojson from "topojson"
import textures from 'textures'

var targetSLN = 'georges',
    town

const extents = {
  "nsw": {
    "scale": 3550,
    "center": [151.8,-31.4]
  },
  "georges": {
    "scale": 60000,
    "center": [151.1,-33.95]
  },
  "gknp": {
    "scale": 30000,
    "center": [153.1,-30.1]
  },
  "default": {
    "scale": 15000,
    "center": [152,-31.4]
  }
}

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
  ]).then( (data) => drawMapNSW(data, hubs) );

}

export function triggerMapNSW() {

  // Animation defs
  const n = 4,
        delay = 5000;

  d3.selectAll(".hubs")
    .transition()
    .duration(1000)
    .delay( (d,i) => i ? i*delay : 0)
    .style("opacity", 1)
    .transition()
    .duration(1000)
    .delay(delay-1000)
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

  d3.select("#nsw-instructions")
    .transition()
    .duration(1000)
    .delay((n+1)*delay)
    .style("opacity",.5);

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
function drawMapNSW(data) {

  // Svg defs
  let w = 900,
      h = 1000;

  // Data defs
  let map   = data[0]
  let fires = data[6]
  let hubs  = {}

  town         = data[1]
  hubs.all     = data[2]
  hubs.crown   = data[3]
  hubs.private = data[4]
  hubs.state   = data[5]

  // Map defs
  const towns = ["Coffs Harbour", "Byron Bay", "Newcastle", "Wollongong", "Port Macquarie", "Sydney", "Eden"]
  let projection = setProjection(extents.nsw)

  // Create svg canvas
  var svg = d3.select("body #nsw-map")
      .append("svg")
      .attr("width", "100%")
      .attr("height", h)
      .attr("viewBox", [0,0,w,h])
      .attr("preserveAspectRatio", "xMinYMin");

  // Basemap
  svg.append('g')
    .selectAll('path')
    .data(map.features)
    .join('path')
    .attr('d', d3.geoPath(projection))
    .attr('class', 'basemap fill-current text-green-400')
    .attr('stroke', 'white')
    .attr('stroke-width', 0.2);

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
    .attr('class', 'hubs-fires fill-current text-red-300 opacity-0');

  // Town names
  svg.append('g')
    .selectAll('text')
    .data( town.features.filter( t => towns.includes(t.properties.name)) )
    .join('text')
      .attr('class', 'towns fill-current text-gray-200 opacity-50 text-sm uppercase font-medium tracking-wide')
      .attr('x', d => projection(d.geometry.coordinates)[0] )
      .attr('y', d => projection(d.geometry.coordinates)[1] )
      .attr('dx', -1)
      .attr('dy', 7)
      .attr("text-anchor", "start")
      .text( (d) => "— " + d.properties.name );

}

export function loadMapSLN() {

  // Data defs
  let map   = "./map-data/nsw-rda.json",
      wsap = "./map-data/wsia-4326.json",
      grnp = "./map-data/grknp-4326.json",
      grco = "./map-data/sws-corridors.json",
      grrv = "./map-data/grrv.json",
      gknp = "./map-data/gknp-split.json"

  Promise.all([
    d3.json(map),
    d3.json(wsap),
    d3.json(grnp),
    d3.json(grco),
    d3.json(grrv),
    d3.json(gknp)
  ]).then( (data) => drawMapSLN(data) )

}
export function triggerMapSLN(view) {
  let svg     = d3.select("#soln-map svg")
  let paths   = svg.selectAll("g path")
  let labls   = svg.selectAll("text")
  let proj    = setProjection(extents[view])
  let projOut = setProjection(extents.default)

  if (targetSLN != view) {
    targetSLN = view
    paths
      .transition()
      .ease(d3.easeSinIn)
      .duration(800)
      .attr('d', d3.geoPath(projOut))
      .transition()
      .ease(d3.easeSinOut)
      .duration(800)
      .attr('d', d3.geoPath(proj))
    labls
      .transition()
      .ease(d3.easeSinIn)
      .duration(800)
      .attr('x', d => projOut(d.geometry.coordinates)[0])
      .attr('y', d => projOut(d.geometry.coordinates)[1])
      .transition()
      .ease(d3.easeSinOut)
      .duration(800)
      .attr('x', d => proj(d.geometry.coordinates)[0])
      .attr('y', d => proj(d.geometry.coordinates)[1])
  }
}

function drawMapSLN(data) {

  // Svg defs
  let w = 900,
      h = 1000;

  // Data defs
  let map  = data[0],
      wsap = data[1],
      grnp = data[2],
      grco = data[3],
      grrv = data[4],
      gknp = data[5]

  // Map defs
  let projection = setProjection(extents['georges']),
      towns = ["Parramatta", "Campbelltown", "Helensburgh", "Sydney Airport", "Coffs Harbour", "Sydney CBD"],
      feats = ["Western Sydney Intl. Airport", "National Park", "State Forest"]

  // Textures
  let texture = {}
      texture.scrub = textures.lines().size(4).strokeWidth(.5).stroke('#a4e3ad')
      texture.build = textures.lines().size(8).strokeWidth(1).orientation("3/8", "7/8").stroke("#909090")

  // Create svg canvas
  var svg = d3.select("#soln-map")
      .append("svg")
      .attr("width", "100%")
      .attr("height", h)
      .attr("viewBox", [0,0,w,h])
      .attr("preserveAspectRatio", "xMinYMin")
      .call(texture.scrub)
      .call(texture.build);

  // Basemap
  svg.append('g')
    .selectAll('path')
    .data(map.features)
    .join('path')
    .attr('d', d3.geoPath(projection))
    .attr('class', 'basemap fill-current text-green-400')
    .attr('stroke', 'white')
    .attr('stroke-width', 0.2);

  // ---- GEORGES RIVER ---- //
  // River
  svg.append('g')
    .selectAll('path')
    .data(grrv.features)
    .join('path')
    .attr('d', d3.geoPath(projection))
    .style('fill','#000a19')
    .style('stroke','#000a19')
    .style('stroke-width', '1px');

  // Corridors
  svg.append('g')
    .selectAll('path')
    .data(grco.features)
    .join('path')
    .attr('d', d3.geoPath(projection))
    .attr('class', 'opacity-50')
    .style('fill', texture.scrub.url() );

  // Koala Reserve
  svg.append('g')
    .selectAll('path')
    .data(grnp.features)
    .join('path')
    .attr('d', d3.geoPath(projection))
    .attr('class', 'fill-current text-green-200')
    .style('stroke', 'white');

  // Airport
  svg.append('g')
    .selectAll('path')
    .data(wsap.features)
    .join('path')
    .attr('d', d3.geoPath(projection))
    .attr('class', 'stroke-current text-gray-400')
    .style('fill', texture.build.url() );

  // --- GREAT KOALA NATIONAL PARK --- //
  // Koala Reserve
  svg.append('g')
    .selectAll('path')
    .data(gknp.features)
    .join('path')
    .attr('d', d3.geoPath(projection))
    .style('fill',  (d,i) => i ? "#4c8075" : texture.scrub.url())
    .style('stroke',(d,i) => i ? "white"   : "");


  // Towns
  svg.append('g')
    .selectAll('text')
    .data( town.features.filter( t => towns.includes(t.properties.name)) )
    .join('text')
    .attr('class', 'fill-current text-white text-sm uppercase font-medium tracking-wide')
    .attr('x', d => projection(d.geometry.coordinates)[0] )
    .attr('y', d => projection(d.geometry.coordinates)[1] )
    .attr('dy', 8)
    .attr("text-anchor", "start")
    .text( (d) => "▪ " + d.properties.name );

  // Features
  svg.append('g')
    .selectAll('text')
    .data( town.features.filter( t => feats.includes(t.properties.name)) )
    .join('text')
    .attr('class', 'fill-current text-gray-300 text-sm font-light italic')
    .attr('x', d => projection(d.geometry.coordinates)[0] )
    .attr('y', d => projection(d.geometry.coordinates)[1] )
    .attr('dy', 8)
    .attr("text-anchor", "start")
    .text( (d) => "— " + d.properties.name );

}

// Helpers
function setProjection(target) {
  return d3.geoMercator()
    .center(target.center)
    .scale(target.scale)
}
function showData() {
  let t = this.dataset.target;
  if (t==4) {
    this.classList.toggle('text-black');
    this.classList.toggle('bg-red-300');
    d3.select('.hubs-fires')
      .transition()
      .duration(500)
      .style('opacity', this.classList.contains('bg-red-300') ? 0.75 : 0 );
  }
  else {
    d3.selectAll('.hubs')
      .transition()
      .duration(500)
      .style('opacity', (d,i) => i==t ? 1 : 0 );

    d3.selectAll(".map-p .cursor-pointer")
      .classed('bg-yellow-300', false)
      .classed('text-black', false);

     this.classList.toggle('bg-yellow-300');
     this.classList.toggle('text-black');
  }
}
