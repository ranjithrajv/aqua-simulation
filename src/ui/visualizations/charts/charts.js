/**
 * Charting utilities using D3.js
 */
// D3.js is loaded via CDN in index.html, using global d3 object
const d3 = (typeof window !== 'undefined' && window.d3) ? window.d3 : globalThis.d3;

/**
 * Create a volume comparison bar chart
 * @param {string|HTMLElement} selector - Selector or element to attach chart to
 * @param {Object} data - Data for the chart
 */
export function createVolumeChart(selector, data) {
    // Clear previous chart
    d3.select(selector).selectAll("*").remove();

    const margin = {top: 20, right: 30, bottom: 40, left: 40};
    const width = 500 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Data preparation
    const chartData = [
        {name: 'Geometric Volume', value: data.geometricGallons || 0},
        {name: 'Water Volume', value: data.waterGallons || 0}
    ];

    // Scales
    const xScale = d3.scaleBand()
        .domain(chartData.map(d => d.name))
        .rangeRound([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.value)])
        .nice()
        .rangeRound([height, 0]);

    // Bars
    g.selectAll(".bar")
        .data(chartData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.name))
        .attr("y", d => yScale(d.value))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d.value))
        .attr("fill", "steelblue");

    // Axes
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yScale));

    // Add labels
    g.selectAll(".label")
        .data(chartData)
        .enter().append("text")
        .attr("class", "label")
        .attr("x", d => xScale(d.name) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.value) - 5)
        .attr("text-anchor", "middle")
        .text(d => d.value.toFixed(1));

    return svg;
}

/**
 * Create a weight distribution pie chart
 * @param {string|HTMLElement} selector - Selector or element to attach chart to
 * @param {Object} data - Data for the chart
 */
export function createWeightChart(selector, data) {
    // Clear previous chart
    d3.select(selector).selectAll("*").remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(selector)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg.append("g")
        .attr("transform", `translate(${width/2}, ${height/2})`);

    // Data preparation
    const chartData = [
        {name: 'Water Weight', value: parseFloat(data.waterLbs) || 0},
        {name: 'Glass Weight', value: parseFloat(data.glassLbs) || 0}
    ].filter(d => d.value > 0); // Filter out zero values

    // Color scale
    const color = d3.scaleOrdinal()
        .domain(chartData.map(d => d.name))
        .range(["#4e79a7", "#f28e2c"]);

    // Pie generator
    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    // Arc generator
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius - 10);

    // Generate pie slices
    const arcs = g.selectAll(".arc")
        .data(pie(chartData))
        .enter().append("g")
        .attr("class", "arc");

    // Draw slices
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", d => color(d.data.name));

    // Add labels
    arcs.append("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(d => d.data.name);

    return svg;
}

/**
 * Create a glass thickness recommendation line chart
 * @param {string|HTMLElement} selector - Selector or element to draw chart on
 * @param {Object} data - Data for the chart
 */
export function createGlassThicknessChart(selector, data) {
    // Clear previous chart
    d3.select(selector).selectAll("*").remove();

    const margin = {top: 20, right: 30, bottom: 40, left: 40};
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(selector)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    const g = svg.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Data preparation
    const chartData = [
        {name: 'Front', value: data.front?.thicknessMm || 0},
        {name: 'Back', value: data.back?.thicknessMm || 0},
        {name: 'Left', value: data.left?.thicknessMm || 0},
        {name: 'Right', value: data.right?.thicknessMm || 0},
        {name: 'Bottom', value: data.bottom?.thicknessMm || 0}
    ];

    // Scales
    const xScale = d3.scalePoint()
        .domain(chartData.map(d => d.name))
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(chartData, d => d.value)])
        .nice()
        .range([height, 0]);

    // Line generator
    const line = d3.line()
        .x(d => xScale(d.name))
        .y(d => yScale(d.value))
        .curve(d3.curveMonotoneX);

    // Draw line
    g.append("path")
        .datum(chartData)
        .attr("class", "line")
        .attr("d", line)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2);

    // Draw points
    g.selectAll(".dot")
        .data(chartData)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => xScale(d.name))
        .attr("cy", d => yScale(d.value))
        .attr("r", 5)
        .attr("fill", "steelblue");

    // Axes
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(yScale));

    return svg;
}