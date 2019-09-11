// @TODO: YOUR CODE HERE!

// Chart Params
var svgWidth = 900;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 40 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  console.log("width = ", width)

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


  var chosenXAxis = "poverty";


  // function used for updating x-scale var upon click on axis label
function xScale(journalData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(journalData, d => d[chosenXAxis]) * 0.8,
      d3.max(journalData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}


// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXaxis]));

  return circlesGroup;
}




// Import data from an external CSV file
d3.csv("assets/data/data.csv")
.then(function( journalData) {

  //  if (error) throw error;

  journalData.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
    });

//console.log("journalData = ", journalData[0].poverty)   

  // Create scaling functions
  var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(journalData, d => d.poverty))
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(journalData, d => d.healthcare) - 1 , d3.max(journalData, d => d.healthcare)])
    .range([height, 0]);
    // .domain([0, 100])
    // .range([0, 1000]);



  // Create axis functions
    
  var yAxis = d3.axisLeft(yLinearScale);
  var xAxis = d3.axisBottom(xLinearScale);
  
  // console.log("XLS = " , xLinearScale)
  // console.log("YLS = " , yLinearScale)

  
    

  // chartGroup.append("circle")
  //   .attr("cx", journalData, d => d.healthcare*10) 
  //   .attr("cy", journalData, d => d.poverty*10)
  //   .attr("cx", journalData, d => d.healthcare*10)
  //   .attr("cy", journalData, d => d.poverty*10)
  //   .attr("r", 25)
  //   .attr("stroke", "gray")
  //   .attr("stroke-width", "5")
  //   .attr("fill", "none");


  // Append a path for line1
  var circlesGroup = chartGroup.selectAll("circle").data(journalData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", 10)
    //.attr("text", "state")
    .attr("stroke", "gray")
    .attr("stroke-width", "1")
    .attr("fill", "blue")
    .attr("opacity", ".5");

 
    var statesGroup = chartGroup.selectAll("text").data(journalData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("value", "hair_length") // value to grab for event listener
    .classed("active", true)
    .style("font-size", "10px")
    .style('fill', 'black')
    .text( d =>  d.abbr);

  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var hairLengthLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty % ");

    var hairLengthLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age(Median)");

    var hairLengthLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income(Median)");

  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  // Add y1-axis to the left side of the display
  chartGroup.append("g")
    // Define the color of the axis text
    //.classed("green", true)
    //.attr("transform", `translate(0, ${width})`)
    .call(yAxis);

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height/2))
    .attr("dy", "1em")
    .classed("active", true)
    .text("Lacks Healthcare %");



    // x axis labels event listener
  labelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    if (value !== chosenXAxis) {

      // replaces chosenXaxis with value
      chosenXAxis = value;

      // console.log(chosenXAxis)

      // functions here found above csv import
      // updates x scale for new data
      xLinearScale = xScale(journalData, chosenXAxis);

      // updates x axis with transition
      xAxis = renderAxes(xLinearScale, xAxis);

      // updates circles with new x values
      circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

      // updates tooltips with new info
      circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenXAxis === "num_albums") {
        albumsLabel
          .classed("active", true)
          .classed("inactive", false);
        hairLengthLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        albumsLabel
          .classed("active", false)
          .classed("inactive", true);
        hairLengthLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });



});
