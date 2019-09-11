// @TODO: YOUR CODE HERE!

// Chart Params
var svgWidth = 850;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 60, left: 80 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

  //console.log("width = ", width)

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

  xAxis
   .transition()
     .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}


// function used for updating states group with a transition to
// new states
function renderStates(statesGroup, newXScale, chosenXAxis) {

  console.log(" renderStates ")

  statesGroup.transition()
    .duration(1000)
    .attr("x", d => newXScale(d[chosenXAxis]));

    return statesGroup;
}


// Import data from an external CSV file
d3.csv("assets/data/data.csv")
.then(function( journalData) {

  //  if (error) throw error;

  journalData.forEach(function(data) {
      data.healthcare = +data.healthcare;
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
    });

//console.log("journalData = ", journalData[0].poverty)   

  // Create scaling functions
  // var xLinearScale = d3.scaleLinear()
  //   .domain(d3.extent(journalData, d => d.poverty))
  //   .range([0, width]);
  var xLinearScale = xScale(journalData, chosenXAxis);

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(journalData, d => d.healthcare) - 1 , d3.max(journalData, d => d.healthcare)])
    .range([height, 0]);
    
  // Create axis functions

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

    
  //var yAxis = d3.axisLeft(yLinearScale);
  //var xAxis = d3.axisBottom(xLinearScale);

 
  
  // console.log("XLS = " , xLinearScale)
  // console.log("YLS = " , yLinearScale)

  // Append circles
  var circlesGroup = chartGroup.selectAll("circle").data(journalData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
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
    .attr("x", d => xLinearScale(d[chosenXAxis]))
    .attr("y", d => yLinearScale(d.healthcare))
    .attr("value", "hair_length") // value to grab for event listener
    //.attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .style("font-size", "10px")
    .style('fill', 'black')
    .text( d =>  d.abbr);
    
    console.log("State 1 = ", journalData[1].abbr)
    console.log("chartGroup 1 = ", chartGroup)
    console.log("statesGroup 1 = ", statesGroup)

  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 10)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty % ");

    var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 25)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age(Median)");

    var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household Income(Median)");

   // append x axis
   var xAxis = chartGroup.append("g")
   .classed("x-axis", true)
   .attr("transform", `translate(0, ${height})`)
   .call(bottomAxis);
 // append y axis
 
 var yAxis = chartGroup.append("g")
   .call(leftAxis);


   
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 40 - margin.left)
    .attr("x", 0 - (height/2))
    .attr("dy", "1em")
    .classed("active", true)
    .text("Lacks Healthcare %");

    
    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20 - margin.left)
    .attr("x", 0 - (height/2))
    .attr("dy", "1em")
    .classed("inactive", true)
    .text("Smokes %");

    chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height/2))
    .attr("dy", "1em")
    .classed("inactive", true)
    .text("Obese %");

    // x axis labels event listener
  labelsGroup.selectAll("text")
  .on("click", function() {
    // get value of selection
    var value = d3.select(this).attr("value");
    console.log("value = ", value)
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


      statesGroup = renderStates(statesGroup, xLinearScale, chosenXAxis);

      // updates tooltips with new info
//      circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

      // changes classes to change bold text
      if (chosenXAxis === "poverty") {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });



});
