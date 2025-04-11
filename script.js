
let barcoSeleccionado = null;
let orientacionSeleccionada = "horizontal";
//Array para saber que zonas estan llenas y cuales no
let matrizUsuarioOcupada = Array.from({ length: 10 }, () => Array(10).fill(false));

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
        this.colocado = false;
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

function inicializarTablero(tipo) {

    let tableroHTML;
    if (tipo === "usuario") {
        tableroHTML = document.getElementById("tableroUsuario");
    } else {
        tableroHTML = document.getElementById("tableroIA");
    }

    let contenido = "";
    let letras = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
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

    if (tipo === "usuario") {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                let celda = document.getElementById(`${tipo}-celda-${i}-${j}`);
                celda.addEventListener("click", () => colocarBarco(i, j));
            }
        }
    }
}

function mostrarBarcos(listaBarcos) {
    let barcosBotones = document.getElementById("barcos");
    barcosBotones.innerHTML = "";

    listaBarcos.forEach(barco => {
        if (!barco.colocado) {
            let btn = document.createElement("button");
            btn.innerText = `${barco.tamanyo} - ${barco.nombre}`;
            btn.addEventListener("click", () => barcoSeleccionado = barco);
            barcosBotones.appendChild(btn);
        }
    });
}


function colocarBarco(x, y) {

    let puedeColocar = true; 
    let posicionesTemp = []; // Array temporal para guardar las posiciones donde se colocará el barco

    for (let i = 0; i < barcoSeleccionado.tamanyo; i++) {

        if (orientacionSeleccionada === "vertical") {
            coordenadaX = x + i;
        } else {
            coordenadaX = x;
        }
        
        if (orientacionSeleccionada === "horizontal") {
            coordenadaY = y + i;
        } else {
            coordenadaY = y;
        }

        if (coordenadaX >= 10) {
            puedeColocar = false;
        }

        if (coordenadaY >= 10) {
            puedeColocar = false;
        }

        if (matrizUsuarioOcupada[coordenadaX][coordenadaY]) {
            puedeColocar = false;
        }

        posicionesTemp.push({ x: coordenadaX, y: coordenadaY });
    }

    if (puedeColocar) {

        posicionesTemp.forEach(pos => {
            matrizUsuarioOcupada[pos.x][pos.y] = true;
            let celda = document.getElementById(`usuario-celda-${pos.x}-${pos.y}`);
            celda.style.backgroundColor = "gray"; 
            celda.innerText = barcoSeleccionado.nombre[0].toUpperCase(); 
        });

        barcoSeleccionado.colocado = true;
        mostrarBarcos(listaBarcosUsuario);
        barcoSeleccionado = null; 
    }
}


function colocarBarcosIA(listaBarcos, tipo = "ia") {
    let matrizOcupada = Array.from({ length: 10 }, () => Array(10).fill(false));

    listaBarcos.forEach(barco => {
        let colocado = false; 

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
                        } else {
                            posicionesTemp.push({ x: posX, y: posY + i }); 
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
                        } else {
                            posicionesTemp.push({ x: posX + i, y: posY }); 
                        }
                    }
                } else {
                    puedeColocar = false; 
                }
            }


            if (puedeColocar) {
                posicionesTemp.forEach(pos => {
                    matrizOcupada[pos.x][pos.y] = true; 
                    let celda = document.getElementById(`${tipo}-celda-${pos.x}-${pos.y}`);
                    if (celda) {
                        celda.style.backgroundColor = "gray"; 
                        celda.innerText = barco.nombre[0].toUpperCase(); 
                    }
                });
                colocado = true; 
            }
        }
    });
}

let listaBarcosUsuario = [];

document.addEventListener("DOMContentLoaded", () => {
    inicializarTablero("usuario");
    inicializarTablero("ia");

    const barcosJSON = `[ 
        { "name": "Portaaviones", "size": 5, "orientacion": "vertical" },
        { "name": "Acorazado", "size": 4, "orientacion": "vertical" },
        { "name": "Crucero", "size": 3, "orientacion": "horizontal" },
        { "name": "Submarino", "size": 3, "orientacion": "vertical" },
        { "name": "Destructor", "size": 2, "orientacion": "horizontal" }
    ]`;

    let listaBarcosIA = JSON.parse(barcosJSON).map(b => new Barco(b.name, b.size, b.orientacion));
    listaBarcosUsuario = JSON.parse(barcosJSON).map(b => new Barco(b.name, b.size, b.orientacion));

    mostrarBarcos(listaBarcosUsuario);
    colocarBarcosIA(listaBarcosIA, "ia");
});

// Mostrar los botones de los barcos
function mostrarBarcos(listaBarcos) {
    let barcosBotones = document.getElementById("barcos");
    barcosBotones.innerHTML = "";

    listaBarcos.forEach(barco => {
        if (!barco.colocado) {
            let btn = document.createElement("button");
            btn.innerText = `${barco.tamanyo} - ${barco.nombre}`;
            
            // Cuando se hace clic en un botón, se selecciona el barco
            btn.addEventListener("click", () => {
                // Quitar la clase active de cualquier otro botón
                document.querySelectorAll("#barcos button").forEach(button => {
                    button.classList.remove("active");  // Quita la clase 'active' de todos los botones
                });
                
                // Añadir la clase active al botón seleccionado
                btn.classList.add("active");  // Añade la clase 'active' al botón clickeado
                barcoSeleccionado = barco; // Guarda el barco seleccionado
            });

            barcosBotones.appendChild(btn);
        }
    });
}


//Para cambiar la orientación del barco con teclas
document.addEventListener("keydown", (event) => {
    let instruccion = document.getElementById("instrucciones")
    if (event.key.toLowerCase() === "h") {
        instruccion.innerHTML = "<h3>Horizontal</h3>"
        orientacionSeleccionada = "horizontal";
    } else if (event.key.toLowerCase() === "v") {
        instruccion.innerHTML = "<h3>Vertical</h3>"
        orientacionSeleccionada = "vertical";
    }
});
