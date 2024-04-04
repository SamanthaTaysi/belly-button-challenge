// Fetch data and initialize dashboard
function init() {
    d3.json('https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json').then((data) => {
        // Populate dropdown menu
        const dropdown = d3.select('#selDataset');
        data.names.forEach((name) => {
            dropdown.append('option').attr('value', name).text(name);
        });
        // Initialize plots and metadata for first sample
        updatePlots(data.names[0], data);
        displayMetadata(data.metadata[0]);
    });
}

// Function to update plots and metadata when a new sample is selected
function optionChanged() {
    const selectedID = d3.select('#selDataset').property('value');
    d3.json('https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json').then((data) => {
        updatePlots(selectedID, data);
        const selectedMetadata = data.metadata.find((d) => d.id === parseInt(selectedID));
        displayMetadata(selectedMetadata);
    });
}

// Function to update bar and bubble charts
function updatePlots(selectedID, data) {
    const selectedSample = data.samples.find((d) => d.id === selectedID);
    const otu_ids = selectedSample.otu_ids.slice(0, 10).reverse();
    const sample_values = selectedSample.sample_values.slice(0, 10).reverse();
    const otu_labels = selectedSample.otu_labels.slice(0, 10).reverse();

    // Bar chart
    const trace1 = {
        x: sample_values,
        y: otu_ids.map((id) => `OTU ${id}`),
        text: otu_labels,
        type: 'bar',
        orientation: 'h',
    };
    const layout1 = {
        title: 'Top 10 OTUs',
        xaxis: { title: 'Sample Values' },
        yaxis: { title: 'OTU ID' },
    };
    Plotly.newPlot('bar', [trace1], layout1);

    // Bubble chart
    const trace2 = {
        x: selectedSample.otu_ids,
        y: selectedSample.sample_values,
        mode: 'markers',
        marker: {
            size: selectedSample.sample_values,
            color: selectedSample.otu_ids,
            colorscale: 'Earth',
        },
        text: selectedSample.otu_labels,
    };
    const layout2 = {
        title: 'Bubble Chart for Samples',
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' },
    };
    Plotly.newPlot('bubble', [trace2], layout2);
}

// Function to display metadata
function displayMetadata(metadata) {
    const metadataDiv = d3.select('#sample-metadata');
    metadataDiv.html('');
    Object.entries(metadata).forEach(([key, value]) => {
        metadataDiv.append('p').text(`${key.toUpperCase()}: ${value}`);
    });
}

// Initialize dashboard
init();
