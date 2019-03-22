// @TODO: YOUR CODE HERE!
// Set up our chart
// ================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("div#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
  .classed("chart",true);

// Import data from the data.csv file
// =================================
d3.csv("assets/data/data.csv").then(function(targetData) {

  // Parse the data
  // Format the data and convert to numerical and date values
  // =================================

  // Format the data
  targetData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    console.log(data);
  });

  // Select active x and y data here
  // =================================
  // var selectX = "poverty";
  
  // targetData.forEach(function(data) {
  //   var activeX = `data.${selectX}`;

  //   console.log(data.selectX);
  // });
  var activeX = "poverty";
  var activeY = "healthcare";
  var prevX = activeX;
  var prevY = activeY;
 

  // Create the scales for the chart
  // =================================
  var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(targetData, d => d.poverty))
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain(d3.extent(targetData, d => d.healthcare))
    .range([height, 0]);



  // Set up the y-axis domain
  // ==============================================
  // @NEW! determine the max y value
  // var povertyMax = d3.max(targetData, d => d.poverty);

  // var healthcareMax = d3.max(targetData, d => d.healthcare);

  // // Use the yMax value to set the yLinearScale domain
  // yLinearScale.domain([0, yMax]);


  // Create the axes
  // =================================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);



  // Append the axes to the chartGroup
  // ==============================================
  // Add x-axis
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  // Add y-axis
  chartGroup.append("g").call(leftAxis);


  // Set up circle generators
  // ==============================================
  // append circles to data points
  
  // var activeX = "poverty";
  // var activeY = "healthcare";


  var circles = chartGroup.selectAll("circlesGroup1")
    .data(targetData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "15")
    .classed("stateCircle",true);
  var texts = chartGroup.selectAll("circlesGroup1")
    .data(targetData)
    .enter()
    .append("text")
    .attr("text-anchor", "middle")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.healthcare)+5)
    .text(function(d){return d.abbr})
    .classed("stateText",true);



  // Add X legend
   
  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
    .attr("text-anchor", "middle")
    .attr("text-size", "16px")
    .text("In Poverty (%)")
    .attr("value", "poverty")
    .attr("id","xlegends")
    .classed("active",true)
    .on("click",function(){
      prevX = activeX;
      activeX = d3.select(this).attr("value");
      console.log(`activeX is ${activeX}, prevX is ${prevX}`);
      d3.selectAll("text#xlegends").attr("class","inactive");
      d3.select(this).attr("class","active");

    });

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
    .attr("text-anchor", "middle")
    .attr("text-size", "16px")
    .text("Age (Median)")
    .attr("value", "age")
    .attr("id","xlegends")
    .classed("inactive",true)
    .on("click",function(){
      prevX = activeX;
      activeX = d3.select(this).attr("value");
      console.log(`activeX is ${activeX}, prevX is ${prevX}`);
      d3.selectAll("text#xlegends").attr("class","inactive");
      d3.select(this).attr("class","active");

    });

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 60})`)
    .attr("text-anchor", "middle")
    .attr("text-size", "16px")
    .text("Household Income (Median)")
    .attr("value", "income")
    .attr("id","xlegends")
    .classed("inactive",true)
    .on("click",function(){
      prevX = activeX;
      activeX = d3.select(this).attr("value");
      console.log(`activeX is ${activeX}, prevX is ${prevX}`);
      d3.selectAll("text#xlegends").attr("class","inactive");
      d3.select(this).attr("class","active");

    });

  // Add Y legend
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+20)
    .attr("x",0 - (height / 2))
    .attr("text-anchor", "middle")
    .attr("text-size", "16px")
    .attr("value", "obesity")
    .attr("id","ylegends")
    .classed("inactive",true)
    .text("Obese (%)")
    .on("click",function(){
      prevY = activeY;
      activeY = d3.select(this).attr("value");
      console.log(`activeY is ${activeY}, prevY is ${prevY}`);
      d3.selectAll("text#ylegends").attr("class","inactive");
      d3.select(this).attr("class","active");

    });

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+40)
    .attr("x",0 - (height / 2))
    .attr("text-anchor", "middle")
    .attr("text-size", "16px")
    .attr("value", "smokes")
    .attr("id","ylegends")
    .classed("inactive",true)
    .text("Smokes (%)")
    .on("click",function(){
      prevY = activeY;
      activeY = d3.select(this).attr("value");
      console.log(`activeY is ${activeY}, prevY is ${prevY}`);
      d3.selectAll("text#ylegends").attr("class","inactive");
      d3.select(this).attr("class","active");

    });

  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+60)
    .attr("x",0 - (height / 2))
    .attr("text-anchor", "middle")
    .attr("text-size", "16px")
    .attr("value", "healthcare")
    .attr("id","ylegends")
    .classed("active",true)
    .text("Lacks Healthcare (%)")
    .on("click",function(){
      prevY = activeY;
      activeY = d3.select(this).attr("value");
      console.log(`activeY is ${activeY}, prevY is ${prevY}`);
      d3.selectAll("text#ylegends").attr("class","inactive");
      d3.select(this).attr("class","active");

    });

  // Step 1: Append a div to the body to create tooltips, assign it a class
  // =======================================================
  var toolTip = d3.select("div#scatter")
	.append("div")
	.style("position", "absolute")
	.style("visibility", "hidden")
  // .text("a simple tooltip")
  .classed("d3-tip",true);

  // Step 2: Add an onmouseover event to display a tooltip
  // ========================================================
  // circles.on("mouseover", function(d, i) {
  //   toolTip.style("visibility", "visible");
  //   toolTip.html(`Donut craving level: <strong>${d.poverty}</strong>` )
  //     .style("left", d3.event.pageX + "px")
  //     .style("top", d3.event.pageY + "px");
  // })

  circles.on("mouseover", function(d,i){
    return toolTip.style("visibility", "visible")
    .html(`<html>${d.state}<br>
    Poverty: ${d.poverty}<br>
    Healthcare: ${d.healthcare}</html>` );
  })
  .on("mousemove", function(){return toolTip
    .style("top", (d3.event.pageY-margin.top)+"px")
    .style("left",(d3.event.pageX-margin.left)+"px");})
  .on("mouseout", function(){return toolTip.style("visibility", "hidden");});
  
  // Step 3: Add an onmouseout event to make the tooltip invisible
  // .on("mouseout", function() {
  //   toolTip.style("display", "none");
  // });

});
