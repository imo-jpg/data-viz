const w = 1200;
const h = 550;
const padding = 20;

const svg =
d3.select("body")
    .append("svg")
    .attr("height", h)
    .attr("width", w);

const div = d3.select("body")
            .append("div")
            .attr("opacity", 0)
            .attr("class", "tooltip");

const line = d3.select("svg")
            .append("line")
            .attr("x1", 2*padding)
            .attr("x2", w-padding)
            .attr("stroke-width", .5)
            .attr("stroke", "#111aaa")
            .attr("opacity", 0);

const formatYear = d3.timeFormat("%y");


d3.csv("books.csv").then(function(data) {
    // console.log(data[2].Pages);
    // console.log(d3.min(data, function(d) { return parseInt(d.Pages); }));
    // console.log(d3.max(data, function(d) { return parseInt(d.Pages); }));
    
    let toggleValue = true;

    function toggleSwitch(d, toggleValue) {
        if (toggleValue) {
            return parseInt(d.Pages);
        } else { return parseInt(d.YearWritten); }
    };

    xScale = d3.scaleLinear()
        .domain([
            d3.min(data, toggleSwitch(toggleValue)),
            d3.max(data, toggleSwitch(toggleValue))
        ])
        .range([padding, w - 4*padding]);
        // .domain([80, 1030])
        // .range([padding, w - 4*padding]);
    
    yScale = d3.scaleLinear()
        .domain([
            0,
            d3.max(data, function(d) {return (d.Rating)*2 ;}) ])
        .range([h-(padding), padding]);
    // rScale = d3.scaleLinear()
    //     .domain([
    //         d3.min(data, function(d) {return d.Pages;}),
    //         d3.max(data, function(d) {return d.Pages;}) ])
    //     .range([0, 100]);

    xAxis = d3.axisBottom()
        .scale(xScale)
        .tickFormat(d3.format(10));

    svg.append("g")
        .attr("class", "xaxis")
        // .attr("transform", "translate(0," + (h - padding) + ")")
        .attr("transform", "translate(" + (2*padding) + "," + (h-padding) + ")")
        .call(xAxis);

    yAxis = d3.axisLeft()
        .scale(yScale);

    svg.append("g")
        .attr("class", "yaxis")
        .attr("transform", "translate(" + (2 * padding) + ", 0)")
        .call(yAxis);       

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {return (d.Pages);})
        .attr("cy", function(d) {return yScale((d.Rating)*2);})
        // .attr("r", function(d) {return (d.Pages)/35})
        .attr("r", 10)    
        .attr("opacity", .75)
        .attr("fill", function(d) {
            if ((d.AuthorGender) == "M") {return "#0f62fe";}
            else {return "#42be65";}
        })
        .attr("stroke-weight", 1)
        .attr("stroke", "#111aaa")
        .on("mouseover", function(d) {
            console.log("gotit");
            div.style("opacity", .9)
                .html( d.Book + ", " + d.Author)
                .style("left", (d3.event.pageX - 60) + "px")		
                .style("top", (d3.event.pageY - 30) + "px"); 

            line.style("opacity", 1)
                .attr("y1", yScale((d.Rating)*2))
                .attr("y2", yScale((d.Rating)*2));

        })
        .on("mousemove", function(d) {
            div.style("left", (d3.event.pageX - 60) + "px")		
            .style("top", (d3.event.pageY - 30) + "px");

            
        })
        .on("mouseout", function(d){
            div.style("opacity", 0);
            line.style("opacity", 0);	
        })
        ;

    const button = d3.select("body").append("div")
        .attr("class", "button")
        .append("text")
        .text("toggle view")
        .on("click", reScale);

    function reScale() {

        console.log(toggleValue);

        toggleValue = !toggleValue;

        console.log(toggleValue);

        xScale.domain([
                    d3.min(data, toggleSwitch(toggleValue)),
                    d3.max(data, toggleSwitch(toggleValue)) ])
                .range([padding, w - 4*padding]);
        svg.select(".xaxis")
            .transition(500)
            .call(xAxis);
        
        svg.selectAll("circle")
            .transition().ease(d3.easeBounceOut)
            .attr("cx", function(d) {return (2*padding) + xScale(toggleSwitch(toggleValue));})
            ;
        
    };

});


