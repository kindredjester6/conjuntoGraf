import * as d3 from "d3" 
var xScale = d3.scaleLinear().domain([-66.419422, -125.786406]).range([500*3, 50]);
var yScale = d3.scaleLinear().domain([23.982057,50.508481]).range([500*3, 350]);
async function prepareCoord(){
    try {
        const req = 'states_usa.bna';
        const res = await fetch(req, {
        headers: {
        'Content-Type': 'text/csv', 
        },
        });
    if (res.ok) {
        const csvContent = await res.text(); 
        var arrayCoord = csvContent.split('\n'); 
        var newCoord = [];
        var posc = 0;
        var areaAll = [];
        var listCoord = [];
        arrayCoord.forEach(elem => { 
            elem =elem.split(',');
            if(elem.length == 3){
                newCoord = newCoord.concat({id:elem[0],idUser:elem[1],
                                             numState:elem[2], coord:[]});
                if(listCoord.length != 0){
                    areaAll = areaAll.concat([listCoord]); 
                }
                posc ++;
                listCoord=[];
            }else{
                newCoord[posc-1].coord = {x:elem[0],y:elem[1]};
                listCoord = listCoord.concat({x:elem[0], y:elem[1]});
            }
        });
    }else{
        console.error('Error al descargar el archivo:', res.status);
    }

    return [newCoord,areaAll];
    } catch (error) {
        console.error('Error en la solicitud:', error);
    }
}
let prepareCoordRes = await prepareCoord();
let coord = prepareCoordRes[0]
let areaAll = prepareCoordRes[1]
console.log(areaAll)
var area = d3.area()
            .x(d => xScale(d.x))
            .y0(d => yScale(d.y))
            .y1(d => yScale(d.y));


areaAll.forEach(element => {
    d3.select("#mapa")
    .append("path")
    .attr("d", area(element))
    .attr("fill", "red")
    .attr("stroke", "black"); 
});
