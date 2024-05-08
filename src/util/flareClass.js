//import * as fs from 'fs';
import * as d3 from 'd3';
//import {modifiedCsvData} from './varJson.js';

d3.dsv(",","src/assets/classActScript.csv").then(data => {
    console.log(data);
})

class TreeNode {
    constructor(id, value) {
        this.id = id;
        this.value = value;
        this.children = [];
    }
}

function convertToHierarchy(flareClasses) {
    const root = new TreeNode("flare", null);
    
    flareClasses.forEach(item => {
        const classes = item.id.split(".");
        let currentNode = root;
        
        classes.forEach(className => {
            let childNode = currentNode.children.find(child => child.id === className);
            if (!childNode) {
                childNode = new TreeNode(className, null);
                currentNode.children.push(childNode);
            }
            currentNode = childNode;
        });
        
        currentNode.value = item.value;
    });
    
    return root;
}

// Ejemplo de uso
// Función para imprimir el árbol jerárquico
function printHierarchy(node, indent = 0) {
    console.log("  ".repeat(indent) + `${node.id} (${node.value})`);
    node.children.forEach(child => printHierarchy(child, indent + 1));
}


d3.csv('src/assets/classActScript.csv').then(data => {
    console.log(data)

    const rootNode = convertToHierarchy(data);
    console.log(rootNode)

    //console.log(data)
    // var root = d3.stratify()
    //     .id(d => d.pathname) // Usa la columna 'path' como ID
    //     .parentId(d => d.pathname.lastIndexOf(".")) // Usa la columna 'path' para determinar el padre
    // .path(d => d.pathname) // Usa la columna 'path' para construir la jerarquía
    // (data);
    
   // var nodos = arbolLayout(root).descendants();
 //   console.log(nodos)
 //Radial
 var root =  d3.hierarchy(rootNode)

 const treeLayout = d3.cluster().size([360*6, 100*6]);
 treeLayout(root);
 console.log(root)
 const svg = d3.select('#part3');

 // Dibuja los enlaces (líneas)
 console.log(root)
 svg.select('g.nodes')
 .selectAll('circle.node')
 .data(root.descendants())
 .enter()
 .append('circle')
 .classed('node', true)
 .attr('cx', 0)
 .attr('cy', d => -d.y)
 .attr('r', 5)
 .attr("fill", "lightblue")
 .attr('stroke', "darkgray")
 .attr('stroke-width', 1)
 .attr("transform", d => `
     rotate(${d.x}, 0, 0)
 `)
 .text((d) => d.id)
 .style("font-size", "2000px");
 // Dibuja los nodos (círculos)
 var lineGen = d3.lineRadial()
  .angle(d => d.x * Math.PI / 180)
  .radius(d => d.y);

var linkGen =  d3.linkRadial()
  .angle(d => d.x * Math.PI / 180)
  .radius(d => d.y)

// draw links
svg.select('g.links')
  .selectAll('path.link')
  .data(root.links())
  .enter()
  .append("path")
  .classed('link', true)
  .attr('stroke', "darkgray")
  .attr('stroke-width', 2)
  .attr("d", linkGen)
  .attr("d", (d) => lineGen([d.target, d.source]))

svg.selectAll('.label')
  .data(root.descendants())
  .enter()
  .append('text')
  .attr('class', 'label')
  .attr('x', d => d.y + 10)
  .attr('y', d => d.x)
  .text(d => d.pathname);
//fin rad

//circle
root = d3.hierarchy(rootNode)
const pack = d3.pack()
    .size([1000, 1000])
    .padding(3);

pack(root);
d3.select("#demo7 g")
  .selectAll('circle.node')
  .data(root.descendants())
  .enter()
  .append('circle')
  .classed('node', true)
  .attr('cx', d => d.x -200)
  .attr('cy', d => d.y - 200)
  .attr('r', d => 300)
  .style('fill', 'steelblue');

//fin circle

//ini squarify
var root = d3.hierarchy(rootNode)
  .sum(d => d.hasOwnProperty("size") ? d.size : 0)
  .sort((a, b) => b.value - a.value);

var renderRect = function(id, tileMap) {

  var treemap = d3.treemap()
    .size([1440,900])
    .tile(tileMap)
    .paddingOuter(1);

  treemap(root);

  console.log(root.leaves())
  d3.select("#" + id)
    .selectAll('rect.node')
    .data(root.leaves())
    .enter()
    .append('rect')
    .classed('node', true)
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr("fill", "steelblue");
};

renderRect("demo8", d3.treemapSquarify);
//fin squarify
var drawPartition = function() {
  let root = d3.hierarchy(rootNode)
  .count();

  let partition = d3.partition()
    .size([1440,1440]);

  partition(root);

  d3.select("#demo9")
    .selectAll('rect.node')
    .data(root.descendants())
    .enter()
    .append('rect')
    .classed('node', true)
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => d.x1 - d.x0 )
    .attr('height', d => d.y1 - d.y0 );
};

    drawPartition();
    // console.log(svg)
  })
  .catch(error => {
    console.error('Error al cargar el archivo JSON:', error);
  });

