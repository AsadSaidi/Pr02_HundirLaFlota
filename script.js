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

function incializarTablero(){
    let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let letras = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let tableroHTML = document.getElementById(tablero);
    let codigoHTML = "";

    for(let i = 1; i < numeros.size; i++){
        codigoHTML += "<tr>"
        for(let j = 1; i < numeros.size; i++){
            codigoHTML += `<td id="celda-${i}-${j}"`>
        }
    }
}

/**
 * COLOCAR BARCOS:
 */

function colocarBarcos(listaBarcos){
    let listaPosiciones = []
    for(let i = 0; i < listaBarcos.size; i++){

        listaBarcos.forEach( barco => {
                
        });
    }
    
    
}