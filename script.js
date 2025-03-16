class Tablero {
    constructor() {
        this.tamanyo = 10;
        this.matrizCasillas = [];
        this.listaBarcos = [];
    }
}

class Barco {
    constructor(nombre, tamanyo, orientacion) {
        this.nombre = nombre;
        this.tamanyo = tamanyo;
        this.orientacion = orientacion;
        this.listaPosiciones = [];
    }
}

class Celda {
    constructor(posicionX, posicionY, estado) {
        this.posicionX = posicionX;
        this.posicionY = posicionY;
        this.estado = estado;
    }
}

class PosicionBarco {
    constructor(posicionX, posicionY) {
        this.posicionX = posicionX;
        this.posicionY = posicionY;
    }
}

/**
 * INICIALIZAR TABLERO HTML
 */
function inicializarTablero() {
    let tableroHTML = document.getElementById("tablero");
    let contenido = "";
    let letras = [" ", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
    let numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    contenido += "<tr>";
    for (let i = 0; i < 11; i++) {
        contenido += `<th>${letras[i]}</th>`;
    }
    contenido += "</tr>";

    for (let i = 0; i < 10; i++) {
        contenido += `<tr><th>${numeros[i]}</th>`;
        for (let j = 0; j < 10; j++) {
            contenido += `<td id="celda-${i}-${j}" class="celda"></td>`;
        }
        contenido += "</tr>";
    }

    tableroHTML.innerHTML = contenido;
}

/**
 * INICIALIZAR POSICIONES DE LOS BARCOS
 */
function inicializarBarcos() {
    let barcosJSON = `[ 
        { "name": "Portaaviones", "size": 5, "orientacion": "vertical" },
        { "name": "Acorazado", "size": 4, "orientacion": "vertical" },
        { "name": "Crucero", "size": 3, "orientacion": "horizontal" },
        { "name": "Submarino", "size": 3, "orientacion": "vertical" },
        { "name": "Destructor", "size": 2, "orientacion": "horizontal" }
    ]`;

    let listaBarcosJSON = JSON.parse(barcosJSON);

    let listaBarcos = listaBarcosJSON.map(barco =>
        new Barco(barco.name, barco.size, barco.orientacion)
    );

    colocarBarcos(listaBarcos);
}

/**
 * COLOCAR BARCOS:
 */
function colocarBarcos(listaBarcos) {
    let tablero = document.getElementById("tablero");
    let lineaMatriz = Array(10).fill()
    let matrizOcupada = lineaMatriz.map(() => Array(10).fill(false));

    tablero.style.backgroundColor = "#grey";

    listaBarcos.forEach(barco => {
        let colocado = false;
        barco.listaPosiciones = [];

        while (!colocado) {
            let posX = Math.floor(Math.random() * 10);
            let posY = Math.floor(Math.random() * 10);
            let posicionesTemp = [];
            let puedeColocar = true;

            if (barco.orientacion === "horizontal") {
            
                if (posY + barco.tamanyo <= 10) {
                    for (let i = 0; i < barco.tamanyo; i++) {
                        if (matrizOcupada[posX][posY + i]) {
                            puedeColocar = false;
                            break;
                        } else {
                            posicionesTemp.push({ posicionX: posX, posicionY: posY + i });
                        }
                    }
                } else {
                    puedeColocar = false;
                }
            } else { // Vertical
                if (posX + barco.tamanyo <= 10) {
                    for (let i = 0; i < barco.tamanyo; i++) {
                        if (matrizOcupada[posX + i][posY]) {
                            puedeColocar = false;
                            break;
                        } else {
                            posicionesTemp.push({ posicionX: posX + i, posicionY: posY });
                        }
                    }
                } else {
                    puedeColocar = false;
                }
            }

            if (puedeColocar) {
                
                posicionesTemp.forEach(posicion => {
                    matrizOcupada[posicion.posicionX][posicion.posicionY] = true;
                    let celda = document.getElementById(`celda-${posicion.posicionX}-${posicion.posicionY}`);
                    if (celda) {
                        celda.style.backgroundColor = "gray"; 
                        celda.innerText = barco.nombre[0].toUpperCase(); 
                    }
                });

                barco.listaPosiciones = posicionesTemp;
                colocado = true;
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    inicializarTablero();
    inicializarBarcos();
});
