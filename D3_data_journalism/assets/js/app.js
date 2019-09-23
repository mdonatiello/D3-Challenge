var svgWidth = 960;
var svgHeight = 500;
var margin = {top: 20, right: 40, bottom: 60, left: 100};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select('#scatter')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var chartGroup = svg.append('g');

  // Append a div to the body to create tooltips
  d3.select("#scatter").append("div").attr("class", "tooltip").style("opacity", 0);

  // Import Data
  d3.csv("assets/data/data.csv") .then(function(data) {
    
    // Parse Data/Cast as numbers
    data.forEach(function(data) {
        data.poverty = +data.poverty;
        data.healthcare = +data.healthcare;});
    
    // Create scale functions
    var yLinearScale = d3.scaleLinear().range([height, 0]);
    var xLinearScale = d3.scaleLinear().range([0, width]);

    // Scale the domain
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    xMin = d3.min(data, function(data) {
        return +data.poverty * 0.98;});

    xMax = d3.max(data, function(data) {
        return +data.poverty * 1.02;
    });

    yMin = d3.min(data, function(data) {
        return +data.healthcare * 0.95;});

    yMax = d3.max(data, function(data) {
        return +data.healthcare *1.05;});
    
    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);

// Create axis functions
 var bottomAxis = d3.axisBottom(xLinearScale);
 var leftAxis = d3.axisLeft(yLinearScale);

// Append x-axis to the chart 
chartGroup.append("g")
.attr('transform', `translate(0, ${height})`)
.call(bottomAxis);

// Append y-axis to the chart
chartGroup.append("g").call(leftAxis);

// Create circles
var circlesGroup = chartGroup.selectAll("circle")
.data(data)
.enter()
.append("circle")
.attr("cx", function(data, index) {
    return xLinearScale(data.poverty)})
.attr("cy", function(data, index) {
    return yLinearScale(data.healthcare)})
.attr("r", "12")
.attr("fill", "blue");

  // Append a label to each data point
     chartGroup.append("text")
     .style("text-anchor", "middle")
     .style("font-size", "12px")
     .selectAll("tspan")
     .data(data)
     .enter()
     .append("tspan")
     .attr("x", function(data) {
         return xLinearScale(data.poverty - 0);})
     .attr("y", function(data) {
         return yLinearScale(data.healthcare - 0.2);})
     .text(function(data) {
         return data.abbr});

 // Initialize tooltip 
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(data) {
            var stateName = data.state;
            var healthcare = +data.healthcare;
            var pov = +data.poverty;
            return (
                stateName + '<br> In Poverty: ' + pov + '% <br> Lacks Healthcare: ' + healthcare +'%'
            );
        });

    // Create tooltip in the chart
    chartGroup.call(toolTip);
  
// Create event listeners to display and hide tooltip
circlesGroup.on("mouseenter", function(data) {
    toolTip.show(data, this);})
// hide tooltip on mouseout
.on("mouseout", function(data, index) {
    toolTip.hide(data);});
          
    // Create axes labels
    // Create y-axis label
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.left + 40)
        .attr("x", 0 - height/2)
        .attr("dy","1em")
        .attr("class", "axis-text")
        .text("Lacks Healthcare (%)")

    // Create x-axis label
    chartGroup.append("text")
        .attr("transform", "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")")
        .attr("class", "axis-text")
        .text("In Poverty (%)");
      });

 