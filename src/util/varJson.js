//import {readFile} from './readJson.js';
import { csv, csvParse } from 'd3';
import * as fs from 'fs';
import * as parse from 'csv-parse';


const readableStream = fs.createReadStream('src/assets/vueModule.csv');

// Crear un parser de CSV
const parser = parse.parse({
  delimiter: ',', // Delimitador utilizado en el CSV
  columns: true, // Si es true, la primera fila del CSV se tratará como nombres de columnas
});

// Leer y parsear el CSV
let object = [];
let csvData = "";
var modifiedCsvData;
readableStream.pipe(parser)
  .on('data', (row) => {
    // Aquí tienes cada fila del CSV como un objeto
    object = object.concat(row)
  })
  .on('end', () => {
    console.log('Parseo completado');
    csvData = convertirA_CSV(object);
    let rows = csvData.split('\\n');
    let modifiedRows = rows.map((row, index) => {
        // Para la primera fila (cabecera), añadimos el nombre de la nueva columna
        if (index === 0) {
            return row + ',idParent';
        }
        // Para las demás filas, añadimos los datos de la nueva columna
        // Aquí puedes modificar para añadir los datos que necesites
        console.log(row + `, ${row.split('.').length-1}`);
        return row + `,${row.split('.').length-1}`;
      });
      
      // Unimos las filas modificadas para formar el nuevo CSV
    modifiedCsvData = modifiedRows.join('\\n');
  })
  .on('error', (err) => {
    console.error(err);
  });

function convertirA_CSV(objetos) {
    // Extraemos los encabezados (keys) del primer objeto para la cabecera del CSV
    const encabezados = Object.keys(objetos[0]);
    // Convertimos la lista de objetos a un array de strings en formato CSV
    const csv = objetos.map(obj => encabezados.map(encabezado => obj[encabezado]).join(','));
    // Unimos los encabezados y el contenido con saltos de línea
    csv.unshift(encabezados.join(','));
    return csv.join('\\n');
}

console.log(csvData)
let rows = csvData.split('\\n');

let modifiedRows = rows.map((row, index) => {
    // Para la primera fila (cabecera), añadimos el nombre de la nueva columna
    if (index === 0) {
        return row + ',idParent';
    }
    // Para las demás filas, añadimos los datos de la nueva columna
    // Aquí puedes modificar para añadir los datos que necesites
    return row + '1';
  });
  
  // Unimos las filas modificadas para formar el nuevo CSV

//console.log(modifiedCsvData)
// Convertimos y mostramos el CSV

// fs.readFile('src/assets/vueModule.csv', (err,buffer)=>{
//     console.log(parse.parse(buffer))
    
// })
// var dirNameDistCr = 'src/assets/distritoCrJson.json';
// var dirNameClass = 'src/assets/classActScript.json';
// var dirNameVueMod = 'src/assets/vueModule.json';

// let JsonClass = readFile(dirNameClass);
// let JsonDistCr = readFile(dirNameDistCr);
// let JsonVueM = readFile(dirNameVueMod);
export {modifiedCsvData};
// export {JsonClass, JsonDistCr, JsonVueM}

/*
function transformarObjeto(obj = [{pathname:"nombre", size:"size"},{pathname:"nombre.nombre2", size:"size2"}]) {
    //'.d.ts', '.js', '.mjs'(ESModules), '.md', '.json', '.js.map','.coffee', '.cjs'(commun modules)
    
    var eSplit=[];
    var arreglarExt = [];
    var exepciones = ['tsbuildinfo', 'js', 'mjs', 'md', 'json', 'map','coffee', 'cjs'] //js.flow, node, browser.cjs, markdown
    var newArrary = [];
    for (let i = 0; i < obj.length; i++) {
        const element = obj[i];
        eSplit = element.pathname.split('.') //array: ['','','','']
        console.log('cjs'.includes(eSplit[eSplit.length-2]) && 'flow'.includes(eSplit[eSplit.length-1]))
        if('js'.includes(eSplit[eSplit.length-2]) && 'flow'.includes(eSplit[eSplit.length-1])){
            arreglarExt = eSplit.slice(eSplit.length-3,eSplit.length).join('.');
            eSplit = eSplit.slice(0, eSplit.length-3).concat(arreglarExt);
            eSplit = eSplit.join("/")
            
            newArrary = newArrary.concat({pathname:eSplit, size:element.size});
        } else if('browser'.includes(eSplit[eSplit.length-2]) && 'cjs'.includes(eSplit[eSplit.length-1])){
            arreglarExt = eSplit.slice(eSplit.length-3,eSplit.length).join('.');
            eSplit = eSplit.slice(0, eSplit.length-3).concat(arreglarExt);
            eSplit = eSplit.join("/")
            
            newArrary = newArrary.concat({pathname:eSplit, size:element.size});
        }
        else if(exepciones.includes(eSplit[eSplit.length-1])){
            arreglarExt = eSplit.slice(eSplit.length-2,eSplit.length).join('.');
            eSplit = eSplit.slice(0, eSplit.length-2).concat(arreglarExt);
            eSplit = eSplit.join('/');
            newArrary = newArrary = newArrary.concat({pathname:eSplit, size:element.size});
        }else if('d'.includes(eSplit[eSplit.length-2] || ['ts'.includes(eSplit[eSplit.length-1])])){
            arreglarExt = eSplit.slice(eSplit.length-3,eSplit.length).join('.');
            eSplit = eSplit.slice(0, eSplit.length-3).concat(arreglarExt);
            eSplit = eSplit.join("/")
            
            newArrary = newArrary.concat({pathname:eSplit, size:element.size});
        }else if(['ts'].includes(eSplit[eSplit.length-1])){
            //console.log(eSplit)
            arreglarExt = eSplit.slice(eSplit.length-2,eSplit.length).join('.');
            eSplit = eSplit.slice(0, eSplit.length-2).concat(arreglarExt);
            eSplit = eSplit.join('/');
            newArrary = newArrary.concat({pathname:eSplit, size:element.size});
        }else if('node'.includes(eSplit[eSplit.length-1])){
            arreglarExt = eSplit.slice(eSplit.length-2,eSplit.length).join('.');
            eSplit = eSplit.slice(0, eSplit.length-2).concat(arreglarExt);
            eSplit = eSplit.join('/');
            newArrary = newArrary = newArrary.concat({pathname:eSplit, size:element.size});
        } else if('markdown'.includes(eSplit[eSplit.length-1])){
            arreglarExt = eSplit.slice(eSplit.length-2,eSplit.length).join('.');
            eSplit = eSplit.slice(0, eSplit.length-2).concat(arreglarExt);
            eSplit = eSplit.join('/');
            newArrary = newArrary = newArrary.concat({pathname:eSplit, size:element.size});
        } else if('yml'.includes(eSplit[eSplit.length-1])){
            arreglarExt = eSplit.slice(eSplit.length-2,eSplit.length).join('.');
            eSplit = eSplit.slice(0, eSplit.length-2).concat(arreglarExt);
            eSplit = eSplit.join('/');
            newArrary = newArrary = newArrary.concat({pathname:eSplit, size:element.size});
        }
        else{
            eSplit = eSplit.join('/')
            newArrary = newArrary.concat({pathname:eSplit, size:element.size});
        }
    }
    return newArrary;
}
*/