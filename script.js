//CLASES:
class Tablero {
    constructor(tipo) {
        this.tamanyo = 10;
        this.tipo = tipo;
        this.matrizCasillas = [];
        this.listaBarcos = [];

        for (let i = 0; i < this.tamanyo; i++) {
            this.matrizCasillas[i] = [];
            for (let j = 0; j < this.tamanyo; j++) {
                this.matrizCasillas[i][j] = new Celda(i, j);
            }
        }
    }

    obtenerCelda(x, y) {
        return this.matrizCasillas[x][y];
    }

    //Funcion para colocar los barcos del usuario, donde y cuando haga click
    colocarBarco(x, y) {
        if (!barcoSeleccionado) return;
        let puedeColocar = true;
        let posicionesTemp = [];

        for (let i = 0; i < barcoSeleccionado.tamanyo; i++) {
            let coordenadaX;
            let coordenadaY;

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

            if (coordenadaX >= 10 || coordenadaY >= 10 || matrizUsuarioOcupada[coordenadaX][coordenadaY]) {
                puedeColocar = false;
                break;
            }

            posicionesTemp.push({ x: coordenadaX, y: coordenadaY });
        }

        if (puedeColocar) {
            posicionesTemp.forEach(pos => {
                matrizUsuarioOcupada[pos.x][pos.y] = true;
                let celda = tableroUsuario.obtenerCelda(pos.x, pos.y);
                celda.estado = "barco";
                celda.barco = barcoSeleccionado;

                let htmlCelda = document.getElementById(`usuario-celda-${pos.x}-${pos.y}`);
                htmlCelda.style.backgroundColor = "gray";
                htmlCelda.innerText = barcoSeleccionado.nombre[0].toUpperCase();
            });

            barcoSeleccionado.listaPosiciones = posicionesTemp;
            barcoSeleccionado.colocado = true;
            tableroUsuario.listaBarcos.push(barcoSeleccionado);
            barcoSeleccionado = null;
            tableroUsuario.mostrarBarcos(listaBarcosUsuario);

            if (listaBarcosUsuario.every(barco => barco.colocado)) {
                activarBotonJugar();
            }
        }
    };

    //Funcion para mostrar los barcos cuando se van colocando
    mostrarBarcos(listaBarcos) {
        let barcosBotones = document.getElementById("barcos");
        barcosBotones.innerHTML = "";

        listaBarcos.forEach(barco => {
            if (!barco.colocado) {
                let btn = document.createElement("button");
                btn.innerText = `${barco.tamanyo} - ${barco.nombre}`;
                btn.addEventListener("click", () => {
                    document.querySelectorAll("#barcos button").forEach(buton => buton.classList.remove("active"));
                    btn.classList.add("active");
                    barcoSeleccionado = barco;
                });
                barcosBotones.appendChild(btn);
            }
        });
    }

    //Funcion que coloca los barcos de la ia
    colocarBarcosIA(listaBarcos) {
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
                            if (matrizIAOcupada[posX][posY + i]) {
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
                            if (matrizIAOcupada[posX + i][posY]) {
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
                        matrizIAOcupada[pos.x][pos.y] = true;
                        let celda = tableroIA.obtenerCelda(pos.x, pos.y);
                        celda.estado = "barco";
                        celda.barco = barco;
                    });
    
                    barco.listaPosiciones = posicionesTemp;
                    barco.colocado = true;
                    tableroIA.listaBarcos.push(barco);
                    colocado = true;
                }
            }
        });
    }
}

class Barco {
    constructor(nombre, tamanyo, orientacion) {
        this.nombre = nombre;
        this.tamanyo = tamanyo;
        this.orientacion = orientacion;
        this.listaPosiciones = [];
        this.colocado = false;
        this.tocados = 0;
    }

    estaHundido() {
        return this.tocados >= this.tamanyo;
    }



}

class Celda {
    constructor(posicionX, posicionY) {
        this.posicionX = posicionX;
        this.posicionY = posicionY;
        this.estado = "agua";
        this.barco = null;
        this.atacada = false;
    }
}

//VARIABLES GLOBALES:
let barcoSeleccionado = null;
let orientacionSeleccionada = "horizontal";
let matrizUsuarioOcupada = Array.from({ length: 10 }, () => Array(10).fill(false));
let matrizIAOcupada = Array.from({ length: 10 }, () => Array(10).fill(false));
let tableroIA = new Tablero("ia");
let tableroUsuario = new Tablero("usuario");
let turnoJugador = true;

//FUNCIONES:

//Funcion para inicializar el tablero del usuario
function inicializarTableroUsuario() {
    let tableroHTML = document.getElementById("tableroUsuario");

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
            let celdaId = `usuario-celda-${i}-${j}`;
            contenido += `<td id="${celdaId}" class="celda" data-x="${i}" data-y="${j}"></td>`;
        }
        contenido += "</tr>";
    }

    tableroHTML.innerHTML = contenido;

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let celda = document.getElementById(`usuario-celda-${i}-${j}`);
            celda.addEventListener("click", () => tableroUsuario.colocarBarco(i, j));
        }
    }
}

//Funcion para incializar tablero de la ia
function inicializarTableroIA() {
    let tableroHTML = document.getElementById("tableroIA");

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
            let celdaId = `ia-celda-${i}-${j}`;
            contenido += `<td id="${celdaId}" class="celda" data-x="${i}" data-y="${j}"></td>`;
        }
        contenido += "</tr>";
    }

    tableroHTML.innerHTML = contenido;

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let celda = document.getElementById(`ia-celda-${i}-${j}`);
            celda.addEventListener("click", () => {
                if (!turnoJugador) return;
                dispararIA(i, j);
            });
        }
    }
}


//Funcion para mostrar el boton de jugar cuando todos los barcos estan colocados
function activarBotonJugar() {
    const btn = document.createElement("button");
    btn.id = "botonJugar";
    btn.innerText = "JUGAR";
    btn.addEventListener("click", () => {
        document.getElementById("barcos").style.display = "none";
        btn.style.display = "none";
        document.getElementById("formularioDisparo").style.display = "block";
    });
    document.getElementById("juego").appendChild(btn);
}

//Funcion para que la ia dispare una de las celdas del tablero del usuario
function dispararIA(x, y) {
    let celda = tableroIA.obtenerCelda(x, y);
    if (celda.atacada === true) {
        return;
    }

    celda.atacada = true;
    let htmlCelda = document.getElementById(`ia-celda-${x}-${y}`);

    if (celda.estado === "barco") {
        celda.estado = "tocado";
        celda.barco.tocados++;
        htmlCelda.style.backgroundColor = "red";
        htmlCelda.innerText = "X";

        if (celda.barco.estaHundido()) {
            celda.barco.listaPosiciones.forEach(pos => {
                document.getElementById(`ia-celda-${pos.x}-${pos.y}`).style.backgroundColor = "black";
            });
            if (tableroIA.listaBarcos.every(b => b.estaHundido())) {
                finalizarPartida("¡Has ganado!");
                return; 
            }
        }


        return;
    } else {
        htmlCelda.style.backgroundColor = "blue"; 
    }


    turnoJugador = false;
    setTimeout(turnoIA, 1000);
}

//Funcion que gestiona el turno de la IA
function turnoIA() {
    let x, y, celda;
    do {
        x = Math.floor(Math.random() * 10);
        y = Math.floor(Math.random() * 10);
        celda = tableroUsuario.obtenerCelda(x, y);
    } while (celda.atacada); 

    celda.atacada = true;
    let htmlCelda = document.getElementById(`usuario-celda-${x}-${y}`);

    if (celda.estado === "barco") {
        celda.estado = "tocado";
        celda.barco.tocados++;
        htmlCelda.style.backgroundColor = "orange";
        htmlCelda.innerText = "X";

        if (celda.barco.estaHundido()) {
            celda.barco.listaPosiciones.forEach(pos => {
                document.getElementById(`usuario-celda-${pos.x}-${pos.y}`).style.backgroundColor = "black";
            });
            if (tableroUsuario.listaBarcos.every(b => b.estaHundido())) {
                finalizarPartida("¡La IA ha ganado!");
                return;
            }
        }


        setTimeout(turnoIA, 1000);
    } else {
        htmlCelda.style.backgroundColor = "lightblue"; 
        turnoJugador = true;
    }
}

//Funcion para mostrar el resultado y para volver a juagr y reiniciar todo
function finalizarPartida(mensaje) {

    document.getElementById("tableroUsuario").style.display = "none";
    document.getElementById("tableroIA").style.display = "none";

    let resultado = document.createElement("div");
    resultado.id = "resultado";
    resultado.innerHTML = `<h2>${mensaje}</h2>`;

    let botonReiniciar = document.createElement("button");
    botonReiniciar.innerText = "Jugar de nuevo";
    botonReiniciar.addEventListener("click", reiniciarJuego);

    resultado.appendChild(botonReiniciar);
    document.getElementById("juego").appendChild(resultado);
}

//Funcion que limpia y reinicia todo
function reiniciarJuego() {
    // Limpiar el DOM
    document.getElementById("resultado").remove();
    document.getElementById("tableroUsuario").style.display = "table";
    document.getElementById("tableroIA").style.display = "table";
    document.getElementById("barcos").style.display = "block";

    // Reiniciar variables
    matrizUsuarioOcupada = Array.from({ length: 10 }, () => Array(10).fill(false));
    matrizIAOcupada = Array.from({ length: 10 }, () => Array(10).fill(false));
    tableroIA = new Tablero("ia");
    tableroUsuario = new Tablero("usuario");
    turnoJugador = true;

    // Reiniciar los barcos
    listaBarcosUsuario = JSON.parse(barcosJSON).map(b => new Barco(b.name, b.size, b.orientacion));
    let listaBarcosIA = JSON.parse(barcosJSON).map(b => new Barco(b.name, b.size, b.orientacion));

    // Re-inicializar tableros y barcos
    inicializarTableroUsuario();
    inicializarTableroIA();
    tableroUsuario.mostrarBarcos(listaBarcosUsuario);
    tableroIA.colocarBarcosIA(listaBarcosIA);

    // Ocultar formulario de disparo IA
    document.getElementById("formularioDisparo").style.display = "none";
}

//Listad de los barcos
let listaBarcosUsuario = [];

//JSOn de los barcos
const barcosJSON = `[
    { "name": "Portaaviones", "size": 5, "orientacion": "vertical" },
    { "name": "Acorazado", "size": 4, "orientacion": "vertical" },
    { "name": "Crucero", "size": 3, "orientacion": "horizontal" },
    { "name": "Submarino", "size": 3, "orientacion": "vertical" },
    { "name": "Destructor", "size": 2, "orientacion": "horizontal" }
]`;

//Para que se llamen a las funciones que quiero cuando se cargue completamente el html
document.addEventListener("DOMContentLoaded", () => {
    // Inicializa los tableros para el usuario y la IA
    inicializarTableroUsuario();
    inicializarTableroIA();

    let listaBarcosIA = JSON.parse(barcosJSON).map(b => new Barco(b.name, b.size, b.orientacion));
    listaBarcosUsuario = JSON.parse(barcosJSON).map(b => new Barco(b.name, b.size, b.orientacion));

    tableroUsuario.mostrarBarcos(listaBarcosUsuario);
    tableroIA.colocarBarcosIA(listaBarcosIA);

    const form = document.createElement("div");
    form.id = "formularioDisparo";
    form.style.display = "none";
    form.innerHTML = `
        <h3>Dispara (haz clic en el tablero enemigo)</h3>
    `;
    document.getElementById("juego").appendChild(form);
});

//Listener para cambiar la direccion del barco que quiero colocar
document.addEventListener("keydown", (event) => {
    let instruccion = document.getElementById("instrucciones");
    if (event.key.toLowerCase() === "h") {
        instruccion.innerHTML = "<h3>Horizontal</h3>";
        orientacionSeleccionada = "horizontal";
    } else if (event.key.toLowerCase() === "v") {
        instruccion.innerHTML = "<h3>Vertical</h3>";
        orientacionSeleccionada = "vertical";
    }
});
