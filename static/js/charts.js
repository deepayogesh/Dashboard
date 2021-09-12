 // Starter code starts here 
function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("static/data/samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}  // End of init function

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);  
}
// Demographics Panel 
function buildMetadata(sample)
{
  d3.json("static/data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });  //  end of d3 in buildmetadata
}  //function build metadat ends here

// 1. Create the buildCharts function.
function buildCharts(sample) 
{
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("static/data/samples.json").then((data) =>
  {
      // 3. Create a variable that holds the samples array. 
    var samplesArray = data.samples; 
    var metadata =data.metadata; 
    // this one for gauge chart need to extract washing frquency 
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    var washFrequency = result.wfreq;

    //console.log(samplesArray);
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var resultArray = samplesArray.filter(sampleObj => sampleObj.id == sample);
    //console.log(resultArray);
    //  5. Create a variable that holds the first sample in the array.
    var result1 = resultArray[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_idsArray  = result1.otu_ids;    
    var otu_labels = result1.otu_labels;
    var sample_values =result1.sample_values;
    
    //console.log("otu_ids");
    //console.log(otu_idsArray);
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last.   
    // two ways to get lebales and otu ids
    //var slicedTopten = otu_idsArray.slice(0, 10).map(value => `OTU ${value.toString()}`).reverse(); 
    var slicedTopten = otu_idsArray.slice(0, 10).map(value => `OTU ${value}`).reverse();

    var bellyButtonType = result1.sample_values.slice(0,10).reverse();
    //console.log(bellyButtonType);

    var yticks = {
      x: bellyButtonType,
      y: slicedTopten,
      type: "bar",
      orientation : "h"   
    };    
    // 8. Create the trace for the bar chart. 
    var barData = [yticks];          
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title :"Bar chart displaying Top 10 bacterial species",
      xaxis:{title:"Sample Values"},
      yaxis:{title: "Top 10 OTU id"}      
    };
    // 10. Use Plotly to plot the data with the layout. type, trace, layout
    Plotly.newPlot ("bar", barData, barLayout );
    //-----------------------  Del 2  ----------------------------------------//
    // 1. Create the trace for the bubble chart.       
    var bubbleDataTrace = [{
      x: otu_idsArray,
      y: sample_values,
      text : otu_labels,
      mode :'markers',
      marker: {
              //color: 'rgb(31, 119, 180)',
              color :otu_idsArray,  // use different color for each otu id 
              colorscale: 'Earth',
              size :sample_values,
              //setting 'sizeref' to less than 1, increases the rendered marker sizes
              sizeref:2       
            }, 
      sizemode :'area',
      type: 'scatter'   
    }];        
    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title :'Bacteria Cultures per Sample',
      showlegend :false,
      //height:600,
      //width :600      
    };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble',bubbleDataTrace,bubbleLayout);
    //-------------------------  Del 3  ----------------------------------// 
    
          // 3. Create a variable that holds the washing frequency.
          //Already created this one  before           
          // Create the yticks for the bar chart.          
          // 4. Create the trace for the gauge chart.
          // using dtick and steps gauge divided in to 10 range in parts of 2 using steps
          // added color to guage as shown in image
          var gaugeDataTrace = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: washFrequency,
              title: { text: "Belly button Washing Frequency"},
              type: "indicator",
              mode: "gauge+number",
              gauge :{  
                  axis :{range:[null,10],
                  dtick:2     
                         },
              steps :[
                    {range :[0,2],color :"red"},
                    {range :[2,4],color :"orange"} ,
                    {range :[4,6],color :"yellow"} ,
                    {range :[6,8],color :"lightgreen"},
                    {range :[8,10],color :"green"} 
                    ],
              bar : {color:"black"}
                    } 
            }];    
            
          // 5. Create the layout for the gauge chart.
          var gaugeLayout = { 
              width: 600, 
              height: 500, 
              margin: { t: 0, b: 0 }      
          };
          // 6. Use Plotly to plot the gauge data and layout.
          Plotly.newPlot('gauge',gaugeDataTrace, gaugeLayout);    
  });  //   end of d3  // Use d3.json to load and retrieve the samples.json file
  
}  // end of build charts function 

