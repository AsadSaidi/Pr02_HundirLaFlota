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
        this.colocado = false
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

// Crear un tablero HTML con prefijos únicos
function inicializarTablero(tipo) {
    let tableroHTML;
    if(tipo === "usuario"){
        tableroHTML = document.getElementById("tableroUsuario");
    } else {
        tableroHTML = document.getElementById("tableroIA");
    }
    
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
            let celdaId = `${tipo}-celda-${i}-${j}`;
            contenido += `<td id="${celdaId}" class="celda" data-x="${i}" data-y="${j}"></td>`;
        }
        contenido += "</tr>";
    }

    tableroHTML.innerHTML = contenido;

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let celda = document.getElementById(`${tipo}-celda-${i}-${j}`);
            celda.addEventListener("mouseover", function() {
                let x = celda.dataset.x;
                let y = celda.dataset.y;
                console.log("Posición X:", x, "Posición Y:", y); // Aquí tienes las coordenadas de la celda
            });
        }
    }
}


function colocarBarcosIA(listaBarcos, tipo = "ia") {
    let lineaMatriz = Array(10).fill()
    let matrizOcupada = lineaMatriz.map(() => Array(10).fill(false));

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
            } else {
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
                    let celdaId = `${tipo}-celda-${posicion.posicionX}-${posicion.posicionY}`;
                    let celda = document.getElementById(celdaId);
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

function colocarBarcoUsuario(listaBarcos, tipo = "ia") {
    let lineaMatriz = Array(10).fill()
    let matrizOcupada = lineaMatriz.map(() => Array(10).fill(false));

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
            } else {
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
                    let celdaId = `${tipo}-celda-${posicion.posicionX}-${posicion.posicionY}`;
                    let celda = document.getElementById(celdaId);
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

function mostrarBarcos(listaBarcos){
    let barcosBotones = document.getElementById("barcos")
    
    listaBarcos.forEach(barco =>{
        if(barco.colocado === false){
            barcosBotones.innerHTML += "<button>" + barco.tamanyo + " - " + barco.nombre + "</button>"
        }
    })
}

document.addEventListener("DOMContentLoaded", () => {
    inicializarTablero("usuario");
    inicializarTablero("ia");

    const barcosJSON = `[ 
        { "name": "Portaaviones", "size": 5, "orientacion": "vertical", "colocado": false },
        { "name": "Acorazado", "size": 4, "orientacion": "vertical", "colocado": false  },
        { "name": "Crucero", "size": 3, "orientacion": "horizontal", "colocado": false  },
        { "name": "Submarino", "size": 3, "orientacion": "vertical", "colocado": false  },
        { "name": "Destructor", "size": 2, "orientacion": "horizontal", "colocado": false  }
    ]`;
    
    let listaBarcos = JSON.parse(barcosJSON).map(b => new Barco(b.name, b.size, b.orientacion));
    let listaBarcosUsuario = JSON.parse(barcosJSON).map(b => new Barco(b.name, b.size, b.orientacion, b.colocado));
    console.log(listaBarcos)
    mostrarBarcos(listaBarcos)
    colocarBarcosIA(listaBarcos, "ia");
});

