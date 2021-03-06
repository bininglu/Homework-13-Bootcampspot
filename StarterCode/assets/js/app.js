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

// // Create an SVG wrapper, append an SVG group that will hold our chart,
// // and shift the latter by left and top margins.
// // =================================
// var svg = d3
//   .select("div#scatter")
//   .append("svg")
//   .attr("width", svgWidth)
//   .attr("height", svgHeight);
// // Append an SVG group
// var chartGroup = svg.append("g")
//   .attr("transform", `translate(${margin.left}, ${margin.top})`)
//   .classed("chart",true);


// Initial parameters
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label
function xScale(targetData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(targetData, d => d[chosenXAxis]) * 0.8,
      d3.max(targetData, d => d[chosenXAxis]) * 1.2])
    .range([0, width]);
  return xLinearScale;
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating y-scale var upon click on axis label
function yScale(targetData, chosenYAxis) {
  // create scales
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(targetData, d => d[chosenYAxis]) * 0.8,
      d3.max(targetData, d => d[chosenYAxis]) * 1.2])
    . range([height, 0]);
  return yLinearScale;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}


// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]))
    .attr("cy", d => newYScale(d[chosenYAxis]));

  circlesGroup.selectAll("g.chart").transition()
  .duration(1000)
  .attr("dx", d => xLinearScale(d[chosenXAxis]))
  .attr("dy", d => yLinearScale(d[chosenYAxis])+5)

  return circlesGroup;
}

// function used for updating texts group with a transition to
// new texts
function renderTexts(textsGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

  textsGroup.transition()
    .duration(1000)
    .attr("dx", d => newXScale(d[chosenXAxis]))
    .attr("dy", d => newYScale(d[chosenYAxis])+5);

  return textsGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {
  
  switch (chosenXAxis) {
    case "poverty":
      var xlabel = "Poverty";
      break;
    case "age":
      var xlabel = "Age";
      break;
    case "income":
      var xlabel = "Invome";
      break;
    default:
      var xlabel = "Poverty";      
  };

  switch (chosenYAxis) {
    case "obesity":
      var ylabel = "Obesity";
      break;
    case "smokes":
      var ylabel = "Smokes";
      break;
    case "healthcare":
      var ylabel = "Healthcare";
      break;
    default:
      var ylabel = "Healthcare";      
  };


  // circlesGroup.selectAll("text")
  //   .attr("dx", d => xLinearScale(d[chosenXAxis]))
  //   .attr("dy", d => yLinearScale(d[chosenYAxis])+5)
    // .text(function(d){return d["abbr"]})
    // .classed("stateText",true);
  // =======================================================
  var toolTip = d3.select("div#scatter")
    .append("div")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .classed("d3-tip",true);
    

  circlesGroup.on("mouseover", function(d,i){
      return toolTip.style("visibility", "visible")
      .html(`<html>${d.state}<br>
          ${xlabel}: ${d[chosenXAxis]}<br>
          ${ylabel}: ${d[chosenYAxis]}</html>` );
    })
    .on("mousemove", function(){return toolTip
      .style("top", (d3.event.pageY-margin.top)+"px")
      .style("left",(d3.event.pageX-margin.left)+"px");})
    .on("mouseout", function(){return toolTip.style("visibility", "hidden");});

  // var toolTip = d3.tip()
  //   .attr("class", "d3-tip")
  //   .offset([80, -60])
  //   .html(function(d) {
  //     return (`<html>${d.state}<br>
  //     ${xlabel}: ${d[chosenXAxis]}<br>
  //     ${ylabel}: ${d[chosenYAxis]}</html>` );
  //   });

  // circlesGroup.call(toolTip);

  // circlesGroup.on("mouseover", function(data) {
  //   toolTip.show(data);
  // })
  //   // onmouseout event
  //   .on("mouseout", function(data, index) {
  //     toolTip.hide(data);
  //   });

  return circlesGroup;
}




// Import data from the data.csv file
// =================================
d3.csv("assets/data/data.csv").then(function(targetData) {
  // Create an SVG wrapper, append an SVG group that will hold our chart,
  // and shift the latter by left and top margins.
  // =================================
  var svg = d3
    .select("div#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);
  // Append an SVG group
  var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .classed("chart",true);

    
  // Format the data and convert to numerical and date values
  // =================================
  targetData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.age = +data.age;
    data.income = +data.income;
    data.healthcare = +data.healthcare;
    data.obesity = +data.obesity;
    data.smokes = +data.smokes;
    console.log(data);
  });

  var xLinearScale = xScale(targetData, chosenXAxis);
  var yLinearScale = yScale(targetData, chosenYAxis);
  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    // .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var yAxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
  .data(targetData)
  .enter()
  .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .classed("stateCircle",true);

  // ```````````~~~~~~~~~~~~~~~~~~~~~~~
  // append initial circle labels
  var textsGroup = chartGroup.selectAll("g.chart")
    .data(targetData)
    .enter()
    .append("text")
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis])+5)
    .text(function(d){return d["abbr"]})
    .classed("stateText",true);

  // Create group for  3 x- axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty")// value to grab for event listener
    .classed("active", true)
    // .attr("id","xlegends")
    .text("In Poverty (%)");

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age")// value to grab for event listener
    .classed("inactive", true)
    // .attr("id","xlegends")
    .text("Age (Median)");

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income")// value to grab for event listener
    .classed("inactive", true)
    // .attr("id","xlegends")
    .text("Household Income (Median)");

  // Create group for  3 y- axis labels
  var ylabelsGroup = chartGroup.append("g");

  var obesityLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+20)
    .attr("x",0 - (height / 2))
    // .attr("dy","iem")
    .attr("value", "obesity")
    // .attr("id","ylegends")
    .classed("inactive",true)
    .text("Obese (%)");

  var smokesLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+40)
    .attr("x",0 - (height / 2))
    .attr("value", "smokes")
    // .attr("id","ylegends")
    .classed("inactive",true)
    .text("Smokes (%)");

  var healthcareLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left+60)
    .attr("x",0 - (height / 2))
    .attr("value", "healthcare")
    // .attr("id","ylegends")
    .classed("active",true)
    .text("Lacks Healthcare (%)");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  // x axis labels event listener
  xlabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenXAxis) {

        // replaces chosenXAxis with value
        chosenXAxis = value;

        console.log(chosenXAxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(targetData, chosenXAxis);

        // updates x axis with transition
        xAxis = renderXAxes(xLinearScale, xAxis);

        // updates circles with new x,y values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        // updates texts with new x,y values
        textsGroup = renderTexts(textsGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        switch (chosenXAxis) {
          case "poverty":
            povertyLabel.classed("active", true).classed("inactive", false);
            ageLabel.classed("active", false).classed("inactive", true);
            incomeLabel.classed("active", false).classed("inactive", true);
            break;
          case "age":
            povertyLabel.classed("active", false).classed("inactive", true);
            ageLabel.classed("active", true).classed("inactive", false);
            incomeLabel.classed("active", false).classed("inactive", true);
            break;
          case "income":
            povertyLabel.classed("active", false).classed("inactive", true);
            ageLabel.classed("active", false).classed("inactive", true);
            incomeLabel.classed("active", true).classed("inactive", false);
            break;   
        }
        
        // chartGroup.selectAll("g.chart")
        //   .data(targetData)
        //   .enter()
        //   .append("text")
        //   .attr("dx", d => xLinearScale(d[chosenXAxis]))
        //   .attr("dy", d => yLinearScale(d[chosenYAxis])+5)
        //   .text(function(d){return d["abbr"]})
        //   .classed("stateText",true);
      
       
      }
    });
  // y axis labels event listener

  ylabelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== chosenYAxis) {

        // replaces chosenXAxis with value
        chosenYAxis = value;

        console.log(chosenYAxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(targetData, chosenYAxis);

        // updates x axis with transition
        yAxis = renderYAxes(yLinearScale, yAxis);

        // updates circles with new x,y values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
        // updates texts with new x,y values
        textsGroup = renderTexts(textsGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

        // changes classes to change bold text
        switch (chosenYAxis) {
          case "obesity":
            obesityLabel.classed("active", true).classed("inactive", false);
            smokesLabel.classed("active", false).classed("inactive", true);
            healthcareLabel.classed("active", false).classed("inactive", true);
            break;
          case "smokes":
            obesityLabel.classed("active", false).classed("inactive", true);
            smokesLabel.classed("active", true).classed("inactive", false);
            healthcareLabel.classed("active", false).classed("inactive", true);
            break;
          case "healthcare":
            obesityLabel.classed("active", false).classed("inactive", true);
            smokesLabel.classed("active", false).classed("inactive", true);
            healthcareLabel.classed("active", true).classed("inactive", false);
            break;   
        }
      
       
      }
    });
  });
  

  //   // Append the axes to the chartGroup
  //   // ==============================================
  //   // Add x-axis
  //   chartGroup.append("g")
  //     .attr("transform", `translate(0, ${height})`)
  //     .call(bottomAxis);
  //   // Add y-axis
  //   chartGroup.append("g").call(leftAxis);

  // function activePlot(activeX, activeY){

  //   // Create the scales for the chart
  //   // =================================
  //   var xLinearScale = d3.scaleLinear()
  //     .domain(d3.extent(targetData, d => d.tempX))
  //     .range([0, width]);

  //   var yLinearScale = d3.scaleLinear()
  //     .domain(d3.extent(targetData, d => d.tempY))
  //     .range([height, 0]);



  
  //   // Set up circle generators
  //   // ==============================================
  //   // append circles to data points
  //   var circles = chartGroup.selectAll("circlesGroup1")
  //     .data(targetData)
  //     .enter()
  //     .append("circle")
  //     .attr("cx", d => xLinearScale(d.tempX))
  //     .attr("cy", d => yLinearScale(d.tempY))
  //     .attr("r", "15")
  //     .classed("stateCircle",true);
      
      
  //   var texts = chartGroup.selectAll("circlesGroup1")
  //     .data(targetData)
  //     .enter()
  //     .append("text")
  //     .attr("text-anchor", "middle")
  //     .attr("x", d => xLinearScale(d.tempX))
  //     .attr("y", d => yLinearScale(d.tempY)+5)
  //     .text(function(d){return d.abbr})
  //     .classed("stateText",true);

  //       // =======================================================
  //   var toolTip = d3.select("div#scatter")
  //     .append("div")
  //     .style("position", "absolute")
  //     .style("visibility", "hidden")
  //     .classed("d3-tip",true);

  //     circles.on("mouseover", function(d,i){
  //       return toolTip.style("visibility", "visible")
  //       .html(`<html>${d.state}<br>
  //       Poverty: ${d.tempX}<br>
  //       Healthcare: ${d.tempY}</html>` );
  //     })
  //     .on("mousemove", function(){return toolTip
  //       .style("top", (d3.event.pageY-margin.top)+"px")
  //       .style("left",(d3.event.pageX-margin.left)+"px");})
  //     .on("mouseout", function(){return toolTip.style("visibility", "hidden");});
      
  

  // };


  // // Add X legend
   
  // d3.select("g.chart").append("text")
  //   .attr("transform", `translate(${width / 2}, ${height + margin.top + 20})`)
  //   .attr("text-anchor", "middle")
  //   .attr("text-size", "16px")
  //   .text("In Poverty (%)")
  //   .attr("value", "poverty")
  //   .attr("id","xlegends")
  //   .classed("active",true)
  //   .on("click",function(){
  //     prevX = activeX;
  //     activeX = d3.select(this).attr("value");
  //     console.log(`activeX is ${activeX}, prevX is ${prevX}`);
  //     d3.selectAll("text#xlegends").attr("class","inactive");
  //     d3.select(this).attr("class","active");
  //     activePlot(activeX, activeY);
  //   });

  //   d3.select("g.chart").append("text")
  //   .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
  //   .attr("text-anchor", "middle")
  //   .attr("text-size", "16px")
  //   .text("Age (Median)")
  //   .attr("value", "age")
  //   .attr("id","xlegends")
  //   .classed("inactive",true)
  //   .on("click",function(){
  //     prevX = activeX;
  //     activeX = d3.select(this).attr("value");
  //     console.log(`activeX is ${activeX}, prevX is ${prevX}`);
  //     d3.selectAll("text#xlegends").attr("class","inactive");
  //     d3.select(this).attr("class","active");
  //     activePlot(activeX, activeY);

  //   });

  //   d3.select("g.chart").append("text")
  //   .attr("transform", `translate(${width / 2}, ${height + margin.top + 60})`)
  //   .attr("text-anchor", "middle")
  //   .attr("text-size", "16px")
  //   .text("Household Income (Median)")
  //   .attr("value", "income")
  //   .attr("id","xlegends")
  //   .classed("inactive",true)
  //   .on("click",function(){
  //     prevX = activeX;
  //     activeX = d3.select(this).attr("value");
  //     console.log(`activeX is ${activeX}, prevX is ${prevX}`);
  //     d3.selectAll("text#xlegends").attr("class","inactive");
  //     d3.select(this).attr("class","active");
  //     activePlot(activeX, activeY);

  //   });

  // // Add Y legend
  // d3.select("g.chart").append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 0 - margin.left+20)
  //   .attr("x",0 - (height / 2))
  //   .attr("text-anchor", "middle")
  //   .attr("text-size", "16px")
  //   .attr("value", "obesity")
  //   .attr("id","ylegends")
  //   .classed("inactive",true)
  //   .text("Obese (%)")
  //   .on("click",function(){
  //     prevY = activeY;
  //     activeY = d3.select(this).attr("value");
  //     console.log(`activeY is ${activeY}, prevY is ${prevY}`);
  //     d3.selectAll("text#ylegends").attr("class","inactive");
  //     d3.select(this).attr("class","active");
  //     activePlot(activeX, activeY);

  //   });

  //   d3.select("g.chart").append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 0 - margin.left+40)
  //   .attr("x",0 - (height / 2))
  //   .attr("text-anchor", "middle")
  //   .attr("text-size", "16px")
  //   .attr("value", "smokes")
  //   .attr("id","ylegends")
  //   .classed("inactive",true)
  //   .text("Smokes (%)")
  //   .on("click",function(){
  //     prevY = activeY;
  //     activeY = d3.select(this).attr("value");
  //     console.log(`activeY is ${activeY}, prevY is ${prevY}`);
  //     d3.selectAll("text#ylegends").attr("class","inactive");
  //     d3.select(this).attr("class","active");
  //     activePlot(activeX, activeY);

  //   });

  //   d3.select("g.chart").append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 0 - margin.left+60)
  //   .attr("x",0 - (height / 2))
  //   .attr("text-anchor", "middle")
  //   .attr("text-size", "16px")
  //   .attr("value", "healthcare")
  //   .attr("id","ylegends")
  //   .classed("active",true)
  //   .text("Lacks Healthcare (%)")
  //   .on("click",function(){
  //     prevY = activeY;
  //     activeY = d3.select(this).attr("value");
  //     console.log(`activeY is ${activeY}, prevY is ${prevY}`);
  //     d3.selectAll("text#ylegends").attr("class","inactive");
  //     d3.select(this).attr("class","active");
  //     activePlot(activeX, activeY);
  //   });



  //   activePlot(activeX, activeY);
  // });


