//CLASES:
import { Tablero } from "./models/Tablero.js";
import { Barco } from "./models/Barco.js";

// API URL
const API_URL = 'http://localhost:3000';

//VARIABLES GLOBALES:
let barcoSeleccionado = null;
let orientacionSeleccionada = "horizontal";
let matrizUsuarioOcupada = Array.from({ length: 10 }, () => Array(10).fill(false));
let matrizIAOcupada = Array.from({ length: 10 }, () => Array(10).fill(false));
let tableroIA = new Tablero("ia");
let tableroUsuario = new Tablero("usuario");
let turnoJugador = true;
let listaBarcosUsuario = [
    new Barco("Portaaviones", 5, "horizontal"),
    new Barco("Acorazado", 4, "horizontal"),
    new Barco("Crucero", 3, "horizontal"),
    new Barco("Submarino", 3, "horizontal"),
    new Barco("Destructor", 2, "horizontal")
];

let partidaEmpezada = false;
let juegoIniciado = false;

//FUNCIONES:

// Funcion que guarda la partida.
async function guardarPartida() {
    
    if (!partidaEmpezada && !juegoIniciado && !listaBarcosUsuario.every(barco => barco.colocado)) {
        alert("Debes colocar todos tus barcos antes de guardar la partida.");
        return;
    }

    const nombreJugador = prompt("Introduce tu nombre para guardar la partida:");
    if(!nombreJugador){
        return;
    }

    const partida = {
        jugador: nombreJugador,
        tableroJugador: JSON.stringify(tableroUsuario),
        tableroIA: JSON.stringify(tableroIA)
    };

    try {
        const response = await fetch(`${API_URL}/partidas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(partida)
        });

        if (response.ok) {
            const data = await response.json();
            alert(`Partida guardada con ID: ${data.id}`);
        } else {
            alert('Error al guardar la partida');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar la partida');
    }
}

// Funcion que carga la lista de partidas.
async function cargarListaPartidas() {
    try {
        const response = await fetch(`${API_URL}/partidas`);
        if (response.ok) {
            const partidas = await response.json();
            mostrarListaPartidas(partidas);
        } else {
            alert('Error al cargar la lista de partidas');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar la lista de partidas');
    }
}

// Funcion que muestra la lista de partidas.
function mostrarListaPartidas(partidas) {
    const listaPartidas = document.getElementById('listaPartidas');
    listaPartidas.innerHTML = '';

    if (partidas.length === 0) {
        listaPartidas.innerHTML = '<p class="no-partidas">No hay partidas guardadas</p>';
        return;
    }

    partidas.forEach(partida => {
        const partidaElement = document.createElement('div');
        partidaElement.className = 'partida-item';
        
        const info = document.createElement('div');
        info.className = 'partida-info';
        info.innerHTML = `
            <h3>Partida de ${partida.jugador || 'Anónimo'}</h3>
            <p>ID: ${partida.id}</p>
        `;

        const botonCargar = document.createElement('button');
        botonCargar.className = 'cargar-partida-btn';
        botonCargar.textContent = 'Cargar';
        botonCargar.onclick = () => cargarPartida(partida.id);

        partidaElement.appendChild(info);
        partidaElement.appendChild(botonCargar);
        listaPartidas.appendChild(partidaElement);
    });
}

// Funcion que carga la partida.    
async function cargarPartida(idPartida) {
    try {
        const response = await fetch(`${API_URL}/partidas/${idPartida}`);
        if (response.ok) {
            const partida = await response.json();
            
            // Restaura el estado del juego usando fromJSON
            tableroUsuario = Tablero.fromJSON(JSON.parse(partida.tableroJugador));
            tableroIA = Tablero.fromJSON(JSON.parse(partida.tableroIA));

            // Actualiza la interfaz
            actualizarInterfaz();
            
            // Oculta el panel de selección de barcos
            document.getElementById('barcos').style.display = 'none';
            document.getElementById('barcos').innerHTML = "";
            
            // Indica que la partida a empezado y el juego ha cargado
            partidaEmpezada = true;
            console.log("La partida esta emepzada?:", partidaEmpezada);

            // Reiniciaa el turno del jugador y muestra el formulario de disparo
            turnoJugador = true;
            document.getElementById("formularioDisparo").style.display = "block";
            
            // Cierra la ventana y muetsra el juego
            document.getElementById('modalPartidas').style.display = 'none';
            document.getElementById('menuPrincipal').style.display = 'none';
            document.getElementById('juego').style.display = 'block';
        } else {
            alert('Partida no encontrada');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar la partida');
    }
}

// Funcion que actualiza la interfaz.
function actualizarInterfaz() {
    // Actualizar tablero usuario
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const celda = tableroUsuario.obtenerCelda(i, j);
            const htmlCelda = document.getElementById(`usuario-celda-${i}-${j}`);
            if (celda.estado === "barco") {
                htmlCelda.style.backgroundColor = "gray";
                if (celda.barco) {
                    htmlCelda.innerText = celda.barco.nombre[0].toUpperCase();
                }
            }
            else if (celda.estado === "tocado") {
                htmlCelda.style.backgroundColor = "orange";
                htmlCelda.innerText = "X";
            } else if (celda.atacada) {
                htmlCelda.style.backgroundColor = "lightblue";
                htmlCelda.innerText = "";
            }
        }
    }
    
    tableroUsuario.listaBarcos.forEach(barco => {
        if (barco.colocado && barco.estaHundido()) { 
            pintarBarcoHundido(barco, false);
        }
    });

    // Actualizar tablero IA
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const celda = tableroIA.obtenerCelda(i, j);
            const htmlCelda = document.getElementById(`ia-celda-${i}-${j}`);
            if (celda.atacada) {
                if (celda.estado === "tocado") {
                    htmlCelda.style.backgroundColor = "red";
                    htmlCelda.innerText = "X";
                } else {
                    htmlCelda.style.backgroundColor = "blue";
                }
            }
        }
    }

    tableroIA.listaBarcos.forEach(barco => {
        if (barco.colocado && barco.estaHundido()) { 
            pintarBarcoHundido(barco, true);
        }
    });
}

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
            celda.addEventListener("click", () => colocarBarco(i, j));
        }
    }

    // Mostrar botones de barcos
    mostrarBarcosDisponibles();
}

//Funcion para inicializar tablero de la ia
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
                // Only allow shooting if it's the player's turn AND all ships are placed or game is loaded
                if ((listaBarcosUsuario.every(barco => barco.colocado) || partidaEmpezada) && turnoJugador) {
                    dispararIA(i, j);
                } else if (!turnoJugador) {
                    alert("Espera tu turno para disparar.");
                } else {
                    alert("Por favor, coloca todos tus barcos antes de disparar.");
                }
            });
        }
    }
}

// Función para mostrar los barcos disponibles
function mostrarBarcosDisponibles() {
    let barcosBotones = document.getElementById("barcos");
    barcosBotones.innerHTML = "";

    listaBarcosUsuario.forEach(barco => {
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

//Funcion para colocar los barcos del usuario
function colocarBarco(x, y) {
    if (!barcoSeleccionado) return;

    if (tableroUsuario.sePuedeColocar(x, y, barcoSeleccionado, orientacionSeleccionada, matrizUsuarioOcupada)) {
        if (tableroUsuario.colocarBarco(x, y, barcoSeleccionado, orientacionSeleccionada, matrizUsuarioOcupada)) {
            // Actualizar la interfaz
            barcoSeleccionado.listaPosiciones.forEach(pos => {
                let htmlCelda = document.getElementById(`usuario-celda-${pos.x}-${pos.y}`);
                htmlCelda.style.backgroundColor = "gray";
                htmlCelda.innerText = barcoSeleccionado.nombre[0].toUpperCase();
            });

            barcoSeleccionado = null;
            mostrarBarcosDisponibles();

            if (listaBarcosUsuario.every(barco => barco.colocado)) {
                activarBotonJugar();
            }
        }
    }
}

//Funcion que coloca los barcos de la ia
function colocarBarcosIA(listaBarcos) {
    listaBarcos.forEach(barco => {
        let colocado = false;
        let intentos = 0;
        const maxIntentos = 100;

        while (!colocado && intentos < maxIntentos) {
            let posX = Math.floor(Math.random() * 10);
            let posY = Math.floor(Math.random() * 10);
            let orientacion = Math.random() < 0.5 ? "horizontal" : "vertical";

            if (tableroIA.sePuedeColocar(posX, posY, barco, orientacion, matrizIAOcupada)) {
                if (tableroIA.colocarBarco(posX, posY, barco, orientacion, matrizIAOcupada)) {
                    colocado = true;
                }
            }
            intentos++;
        }
    });
}

//Funcion para muetsra el boton de jugar cuando todos los barcos estan colocados
function activarBotonJugar() {
    // Eliminar el botón anterior si existe
    let botonAnterior = document.getElementById("botonJugar");
    if (botonAnterior) {
        botonAnterior.remove();
    }

    const btn = document.createElement("button");
    btn.id = "botonJugar";
    btn.innerText = "JUGAR";
    btn.addEventListener("click", () => {
        document.getElementById("barcos").style.display = "none";
        btn.style.display = "none";
        let formDisparo = document.getElementById("formularioDisparo");
        if (formDisparo) {
            formDisparo.style.display = "block";
        }
    });
    document.getElementById("juego").appendChild(btn);
}

//Funcion para que la ia dispare una de las celdas del tablero del usuario
function dispararIA(x, y) {
    const resultado = tableroIA.realizarDisparo(x, y);
    if (!resultado.valido) return;

    let htmlCelda = document.getElementById(`ia-celda-${x}-${y}`);

    if (resultado.acertado) {
        htmlCelda.style.backgroundColor = "red";
        htmlCelda.innerText = "X";

        if (resultado.hundido) {
            pintarBarcoHundido(resultado.barco, true);
        }
        if (tableroIA.verificarVictoria()) {
            finalizarPartida("¡Has ganado!");
            return;
        }
        return;
    } else {
        htmlCelda.style.backgroundColor = "blue";
    }
    if (tableroIA.verificarVictoria()) {
        finalizarPartida("¡Has ganado!");
        return;
    }
    turnoJugador = false;
    setTimeout(turnoIA, 1000);
}

//Funcion que gestiona el turno de la IA
function turnoIA() {
    let x, y, celda;
    let ultimoAcierto = null;
    let barcosHundidos = new Set();
    let direccionActual = null;

    // Identificar barcos hundidos
    for (let barco of tableroUsuario.listaBarcos) {
        if (barco.estaHundido()) {
            barcosHundidos.add(barco);
        }
    }

    // Buscar el último acierto en el tablero que no pertenezca a un barco hundido
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            let celdaActual = tableroUsuario.obtenerCelda(i, j);
            if (celdaActual.atacada &&
                celdaActual.estado === "tocado" && 
                celdaActual.barco &&  // Ensure barco is not null
                !barcosHundidos.has(celdaActual.barco)) {
                ultimoAcierto = { x: i, y: j, barco: celdaActual.barco };
                break;
            }
        }
        if (ultimoAcierto) break;
    }

    let intentos = 0;
    let maxIntentos = 100;
    let encontrado = false;

    if (ultimoAcierto) {
        // Buscar otro acierto del mismo barco para determinar la dirección
        let otroAcierto = null;
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                let celdaActual = tableroUsuario.obtenerCelda(i, j);
                if (celdaActual.atacada &&
                    celdaActual.estado === "tocado" && 
                    celdaActual.barco && celdaActual.barco === ultimoAcierto.barco && // Ensure barco is not null
                    (i !== ultimoAcierto.x || j !== ultimoAcierto.y)) {
                    otroAcierto = { x: i, y: j };
                    break;
                }
            }
            if (otroAcierto) break;
        }

        // Determinar la dirección basada en los dos aciertos
        if (otroAcierto) {
            if (otroAcierto.x === ultimoAcierto.x) {
                direccionActual = otroAcierto.y > ultimoAcierto.y ? 
                    { dx: 0, dy: 1 } : { dx: 0, dy: -1 };
            } else {
                direccionActual = otroAcierto.x > ultimoAcierto.x ? 
                    { dx: 1, dy: 0 } : { dx: -1, dy: 0 };
            }
        }

        if (direccionActual) {
            // Intentar en ambas direcciones
            let direcciones = [direccionActual, { dx: -direccionActual.dx, dy: -direccionActual.dy }];
            for (let dir of direcciones) {
                let nuevaX = ultimoAcierto.x + dir.dx;
                let nuevaY = ultimoAcierto.y + dir.dy;
                if (nuevaX >= 0 && nuevaX < 10 && nuevaY >= 0 && nuevaY < 10) {
                    let celdaCercana = tableroUsuario.obtenerCelda(nuevaX, nuevaY);
                    if (!celdaCercana.atacada) {
                        x = nuevaX;
                        y = nuevaY;
                        encontrado = true;
                        break;
                    }
                }
            }
        }
        if (!encontrado) {
            // Buscar en cualquier dirección
            let todasDirecciones = [
                { dx: 1, dy: 0 },
                { dx: -1, dy: 0 },
                { dx: 0, dy: 1 },
                { dx: 0, dy: -1 }
            ];
            todasDirecciones.sort(() => Math.random() - 0.5);
            for (let dir of todasDirecciones) {
                let nuevaX = ultimoAcierto.x + dir.dx;
                let nuevaY = ultimoAcierto.y + dir.dy;
                if (nuevaX >= 0 && nuevaX < 10 && nuevaY >= 0 && nuevaY < 10) {
                    let celdaCercana = tableroUsuario.obtenerCelda(nuevaX, nuevaY);
                    if (!celdaCercana.atacada) {
                        x = nuevaX;
                        y = nuevaY;
                        encontrado = true;
                        break;
                    }
                }
            }
        }
    }
    if (!encontrado) {
        // Si no hay aciertos previos o no se encontró cercana, disparar aleatoriamente
        do {
            x = Math.floor(Math.random() * 10);
            y = Math.floor(Math.random() * 10);
            celda = tableroUsuario.obtenerCelda(x, y);
            intentos++;
        } while (celda.atacada && intentos < maxIntentos);
        if (intentos >= maxIntentos) {
            // Si no encuentra celda válida, pasa el turno
            turnoJugador = true;
            return;
        }
    }

    celda = tableroUsuario.obtenerCelda(x, y);
    celda.atacada = true;
    let htmlCelda = document.getElementById(`usuario-celda-${x}-${y}`);
    if (celda.estado === "barco") {
        celda.estado = "tocado";
        if (celda.barco) {
            celda.barco.tocados++;
        }
        htmlCelda.style.backgroundColor = "orange";
        htmlCelda.innerText = "X";
        if (celda.barco && celda.barco.estaHundido()) {
            pintarBarcoHundido(celda.barco, false);
            if (tableroUsuario.listaBarcos.every(b => b.estaHundido())) {
                finalizarPartida("¡La IA ha ganado!");
                return;
            }
            // Disparo extra random
            let intentosExtra = 0;
            let randomX, randomY, randomCelda, htmlRandomCelda;
            do {
                randomX = Math.floor(Math.random() * 10);
                randomY = Math.floor(Math.random() * 10);
                randomCelda = tableroUsuario.obtenerCelda(randomX, randomY);
                intentosExtra++;
            } while (randomCelda.atacada && intentosExtra < 100);
            if (!randomCelda.atacada) {
                randomCelda.atacada = true;
                htmlRandomCelda = document.getElementById(`usuario-celda-${randomX}-${randomY}`);
                if (randomCelda.estado === "barco") {
                    randomCelda.estado = "tocado";
                    if (randomCelda.barco) {
                        randomCelda.barco.tocados++;
                    }
                    htmlRandomCelda.style.backgroundColor = "orange";
                    htmlRandomCelda.innerText = "X";
                    if (randomCelda.barco && randomCelda.barco.estaHundido()) {
                        pintarBarcoHundido(randomCelda.barco, false);
                        if (tableroUsuario.listaBarcos.every(b => b.estaHundido())) {
                            finalizarPartida("¡La IA ha ganado!");
                            return;
                        }
                        // Si hunde otro barco, vuelve a llamar a turnoIA
                        setTimeout(turnoIA, 500);
                        return;
                    }
                    // Si solo acierta, vuelve a llamar a turnoIA
                    setTimeout(turnoIA, 500);
                    return;
                } else {
                    htmlRandomCelda.style.backgroundColor = "lightblue";
                }
            }
            // Si no acierta, pasa el turno al jugador
            turnoJugador = true;
            return;
        }
        if (tableroUsuario.listaBarcos.every(b => b.estaHundido())) {
            finalizarPartida("¡La IA ha ganado!");
            return;
        }
        // Solo continuar el turno de la IA si acertó
        setTimeout(turnoIA, 1000);
    } else {
        htmlCelda.style.backgroundColor = "lightblue";
        turnoJugador = true;
    }
}

//Funcion para mostrar el resultado y para volver a juagr y reiniciar todo
function finalizarPartida(mensaje) {
    // Ocultar los tableros
    document.getElementById("tableroUsuario").style.display = "none";
    document.getElementById("tableroIA").style.display = "none";
    
    // Ocultar el formulario de disparo
    let formDisparo = document.getElementById("formularioDisparo");
    if (formDisparo) {
        formDisparo.style.display = "none";
    }

    // Crear y mostrar el resultado
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
    console.log("reiniciarJuego called");
    // Limpiar el DOM
    if (document.getElementById("resultado")) {
        document.getElementById("resultado").remove();
    }
    
    // Limpiar los tableros
    document.getElementById("tableroUsuario").innerHTML = "";
    document.getElementById("tableroIA").innerHTML = "";
    
    // Mostrar los tableros
    document.getElementById("tableroUsuario").style.display = "table";
    document.getElementById("tableroIA").style.display = "table";
    
    // Limpiar y mostrar la sección de barcos
    let barcosDiv = document.getElementById("barcos");
    barcosDiv.innerHTML = "";
    barcosDiv.style.display = "";
    
    // Ocultar el formulario de disparo
    let formDisparo = document.getElementById("formularioDisparo");
    if (formDisparo) {
        formDisparo.style.display = "none";
    }

    // Reiniciar variables
    matrizUsuarioOcupada = Array.from({ length: 10 }, () => Array(10).fill(false));
    matrizIAOcupada = Array.from({ length: 10 }, () => Array(10).fill(false));
    tableroIA = new Tablero("ia");
    tableroUsuario = new Tablero("usuario");
    turnoJugador = true;
    barcoSeleccionado = null;
    orientacionSeleccionada = "horizontal";
    partidaEmpezada = false; 
    console.log("reiniciarJuego finished, partidaEmpezada set to:", partidaEmpezada);

    // Reiniciar los barcos del usuario
    listaBarcosUsuario.length = 0; 
    listaBarcosUsuario.push(
        new Barco("Portaaviones", 5, "horizontal"),
        new Barco("Acorazado", 4, "horizontal"),
        new Barco("Crucero", 3, "horizontal"),
        new Barco("Submarino", 3, "horizontal"),
        new Barco("Destructor", 2, "horizontal")
    );
    
    // Crear y colocar los barcos de la IA
    let listaBarcosIA = [
        new Barco("Portaaviones", 5, "horizontal"),
        new Barco("Acorazado", 4, "horizontal"),
        new Barco("Crucero", 3, "horizontal"),
        new Barco("Submarino", 3, "horizontal"),
        new Barco("Destructor", 2, "horizontal")
    ];

    // Re-inicializar tableros y barcos
    inicializarTableroUsuario();
    inicializarTableroIA();
    mostrarBarcosDisponibles();
    colocarBarcosIA(listaBarcosIA);

    // Actualizar instrucciones
    let instruccion = document.getElementById("instrucciones");
    if (instruccion) {
        instruccion.innerHTML = "<h3>Horizontal</h3>";
    }
}

// Inicialización del menú principal
document.addEventListener('DOMContentLoaded', () => {
    inicializarTableroUsuario();
    inicializarTableroIA();

    let listaBarcosIA = [
        new Barco("Portaaviones", 5, "horizontal"),
        new Barco("Acorazado", 4, "horizontal"),
        new Barco("Crucero", 3, "horizontal"),
        new Barco("Submarino", 3, "horizontal"),
        new Barco("Destructor", 2, "horizontal")
    ];
    colocarBarcosIA(listaBarcosIA);

    const form = document.createElement("div");
    form.id = "formularioDisparo";
    form.style.display = "none";
    form.innerHTML = `
        <h3>Dispara (haz clic en el tablero enemigo)</h3>
    `;
    document.getElementById("juego").appendChild(form);

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

    const menuPrincipal = document.getElementById('menuPrincipal');
    const juego = document.getElementById('juego');
    const nuevaPartidaBtn = document.getElementById('nuevaPartida');
    const cargarPartidaBtn = document.getElementById('cargarPartida');
    const guardarPartidaBtn = document.getElementById('guardarPartida');
    const volverMenuBtn = document.getElementById('volverMenu');
    const modalPartidas = document.getElementById('modalPartidas');
    const cerrarModalBtn = document.getElementById('cerrarModal');

    nuevaPartidaBtn.addEventListener('click', () => {
        menuPrincipal.style.display = 'none';
        juego.style.display = 'block';
        reiniciarJuego();
    });

    cargarPartidaBtn.addEventListener('click', () => {
        cargarListaPartidas();
        modalPartidas.style.display = 'block';
    });

    document.getElementById('cargarPartida').onclick = () => {
        cargarListaPartidas();
        document.getElementById('modalPartidas').style.display = 'block';
    };

    cerrarModalBtn.addEventListener('click', () => {
        modalPartidas.style.display = 'none';
    });


    window.addEventListener('click', (event) => {
        if (event.target === modalPartidas) {
            modalPartidas.style.display = 'none';
        }
    });

    guardarPartidaBtn.addEventListener('click', guardarPartida);

    volverMenuBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres volver al menú? Se perderá el progreso no guardado.')) {
            juego.style.display = 'none';
            menuPrincipal.style.display = 'flex';
        }
    });
});

// Funcion auxiliar opara pintar ek baroc hundido
function pintarBarcoHundido(barco, esIA = false) {
    barco.listaPosiciones.forEach(pos => {
        const posX = pos.posicionX !== undefined ? pos.posicionX : pos.x;
        const posY = pos.posicionY !== undefined ? pos.posicionY : pos.y;


        if (typeof posX !== 'number' || typeof posY !== 'number' || posX < 0 || posX >= 10 || posY < 0 || posY >= 10) {
            return;
        }

        let celdaId;
        if (esIA) {
            celdaId = `ia-celda-${posX}-${posY}`;
        } else {
            celdaId = `usuario-celda-${posX}-${posY}`;
        }

        const htmlCelda = document.getElementById(celdaId);
        if (htmlCelda) {
            htmlCelda.style.backgroundColor = "black";
            htmlCelda.innerText = "X";
        }
    });
}
