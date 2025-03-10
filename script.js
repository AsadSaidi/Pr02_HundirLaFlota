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

    let barcosJSON = `{
   { "name": "Portaaviones", "size": 5 },
   { "name": "Acorazado", "size": 4 },
   { "name": "Crucero", "size": 3 },
   { "name": "Submarino", "size": 3 },
   { "name": "Destructor", "size": 2 }
    }`

    let listaBarcos = JSON.parse(barcosJSON)

    for(let i = 0; i < 4; i++){
        Math.random
    }
}
