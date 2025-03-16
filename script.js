/**
 * CLASES: Tablero, Barco, Celda
 */

class Tablero{
    tamanyo;
    matrizCasillas;
    listaBarcos;
}

class Barco{
    nombre;
    tamanyo;
    listaPosiciones;
    posicionesTocadas;
}

class Celda{
    posicionX;
    posicionY;
    estado;
}

class PosicionBarco{
    posicionX;
    posicionY;
}

/**
 * INCIALIZAMOS POSCIONES DE LOS BARCOS
 */
function incializarBarcos(){

    let barcosJSON = `[
        { "name": "Portaaviones", "size": 5 },
        { "name": "Acorazado", "size": 4 },
        { "name": "Crucero", "size": 3 },
        { "name": "Submarino", "size": 3 },
        { "name": "Destructor", "size": 2 }
    ]`;

    let listaBarcos = JSON.parse(barcosJSON)

    for(let i = 0; i < 4; i++){
        Math.random
    }

    listaBarcos.forEach(barco => {
        console.log(`Nombre: ${barco.name}, Tamaño: ${barco.size}`);
     });
    
     colocarBarcos(listaBarcos)
}

incializarBarcos()

function inicializarTablero() {
    let tableroHTML = document.getElementById("tablero");
    let contenido = "";
    let listaLetras = [" ","A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    let listaNumeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    for (let i = 0; i < 11; i++) {
        contenido += `<th>${listaLetras[i]}</th>`; 
    }

    for (let i = 0; i < 10; i++) {
        contenido += "<tr>";
        contenido += `<tr><th>${listaNumeros[i]}</th>`;
        for (let j = 0; j < 10; j++) { 
            contenido += `<td id="celda-${i}-${j}"></td>`;
        }
        contenido += "</tr>";
    }

    tableroHTML.innerHTML = contenido;
}

/**
 * COLOCAR BARCOS:
 */

function colocarBarcos(listaBarcos){
    let posX = Math.random()
    
    
}

document.addEventListener("DOMContentLoaded", inicializarTablero);