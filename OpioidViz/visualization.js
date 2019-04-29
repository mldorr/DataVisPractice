
// color scales
var income_domain = [0, 25, 50, 75, 100, 125, 150, 175, 200];
var income_color = d3.scaleThreshold()
    .domain (income_domain)
    .range (d3.schemeBlues[8])

// data
var incomeData = d3.map();

// asynchronous tasks, load topojson map and data
d3.queue()
    .defer(d3.json, "WACounty.json")
    .defer(d3.csv, "data_13_17.csv", function(d){
        incomeData.set (d.County, +d.Count);
    })
    .await(ready);

// callback function
function ready (error, data){
    if (error) throw error;
    
    // washington
    var washington = topojson.feature(data, {
        type: "GeometryCollection",
        geometries: data.objects.WACounty.geometries
    });
    
    // projection
    var projection = d3.geoAlbersUsa()
        .fitExtent([[20,20], [460,580]], washington)
    
    // path
    var geoPath = d3.geoPath()
        .projection (projection);
    
    // 
    d3.select("svg.data").selectAll("path")
        .data(washington.features)
        .enter()
        .append ("path")
        .attr ("d", geoPath)
        .attr ("fill", function(d){
            return income_color(d.income = incomeData.get(d.properties.NAME))
    });
}