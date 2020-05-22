const width = 550;
const height = 550;
const padding = 40;
// let parsedData;
let newNodes;
const borrowedPerson = "#5392ff";
const borrowedLibrary = "#1f57a4";
const mineGift = "#fed500";
const mineBought = "#b3901f";

let flag = true;

const svg = d3.select("body")
    .append("svg")
    .attr("height", height)
    .attr("width", width);

const labelLeftOne = svg.append("g")
    .attr("transform", "translate (" + width / 4 + ", 400)");

labelLeftOne.append("text")
    .text("mine");

const labelRightOne = svg.append("g")
    .attr("transform", "translate (" + width * 5/8 + ", 400)");

labelRightOne.append("text")
    .text("borrowed");

const labelLeftTwo = svg.append("g")
    .attr("transform", "translate (" + width / 4 + ", 400)"); 

labelLeftTwo.append("text")
    .text("human");

labelLeftTwo.attr("class", "hide");

const labelRightTwo = svg.append("g")
    .attr("transform", "translate (" + width * 5/8 + ", 400)");

labelRightTwo.append("text")
    .text("institution");    

labelRightTwo.attr("class", "hide");

async function parseData() {
    let parsedData = await d3.csv("books2.csv");
    return parsedData;
}

function createNodes(data) {
    nodes = data.map(d => ({
    ...d,
      radius: parseInt(+d.Pages),
      x: parseInt(+d.Ident),
      y: parseInt(+d.Rating)
    }))
console.log(nodes[4].x);
    return nodes;
};

(async function main() {

    let parsedData = await parseData();
    
    let newNodes = createNodes(parsedData);

    xScale = d3.scaleLinear()
        .domain([
            d3.min(newNodes, d => parseInt(d.x)),
            d3.max(newNodes, d => parseInt(d.x))
        ])
        .range([padding, width - padding]);

    yScale = d3.scaleLinear()
        .domain([
            d3.min(newNodes, d => d.y),
            d3.max(newNodes, d => d.y)
        ])
        .range([height - padding, padding]);   

    simulation = d3.forceSimulation(newNodes)
        .force('x', d3.forceX().x(d => {
            if (d.Origin == "mine" ) {
                return width/4;
            } else {
                return width * 5/8;
            }
        }))
        .force('y', d3.forceY().y(function(d) {
            return 225;
        }))
        .force("charge", d3.forceManyBody().strength(5))
        .force("collision", d3.forceCollide().radius(d => (d.radius)/40))
        // .force("collision", d3.forceCollide().radius(10))
        .on("tick", ticked);

    const button = svg.append("g")
        .attr("transform", "translate (" + ((width / 2) - (padding*2)) + ", 50)");
    
    button.append("text")
        .attr("class", "button")
        .text("switch")
        .on("click", switchCenter);
        
    function switchCenter() {
        
        flag = !flag;

        if (flag === false) {
            
            labelLeftOne.attr("class", "hide");
            labelRightOne.attr("class", "hide");

            labelLeftTwo.attr("class", "show");
            labelRightTwo.attr("class", "show");

            simulation
            .force('x', d3.forceX().x(d => {
                
                if (d.Where == "gift" || d.Where == "person") {
                    return width/4;
                } else {
                    return width * 5/8;
                }
            }))
            .force('y', d3.forceY().y(function(d) {
                return 225;
            }));
        } else {
            labelLeftOne.attr("class", "show");
            labelRightOne.attr("class", "show");

            labelLeftTwo.attr("class", "hide");
            labelRightTwo.attr("class", "hide");

            simulation
            .force('x', d3.forceX().x(d => {
                if (d.Origin == "mine" ) {
                    return width/4;
                } else {
                    return width * 5/8;
                }
            }))
            .force('y', d3.forceY().y(function(d) {
                return 225;
            }))
        }

        simulation.alpha(1).restart();


        
        
    };

    function ticked() {

        bubbles = svg.selectAll("circle")
            .data(newNodes)
        
        bubbles.enter()
            .append("circle")
            .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
            // .attr("r", 10)
            .attr("r", d => (d.radius)/40)
            .attr("fill", function(d) {
                if (d.Where == "person") {
                    return borrowedPerson;
                } else if (d.Where == "library") {
                    return borrowedLibrary;
                } else if (d.Where == "gift") {
                    return mineGift;
                } else {
                    return mineBought;
                }
            })
            .attr("opacity", .85)
            .attr("stroke-weight", 1)
            .attr("stroke", "#111aaa")
            .merge(bubbles)
            .attr("cx", d => {
                return d.x;
            })
            .attr("cy", d => {
                return d.y;
            });


        bubbles.exit().remove();

        function dragstarted(d) {
            if (!d3.event.active) simulation.alphaTarget(.05).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
        
        function dragged(d) {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }
        
        function dragended(d) {
            if (!d3.event.active) simulation.alphaTarget(.05);
            d.fx = null;
            d.fy = null;
        }
    }
}());






