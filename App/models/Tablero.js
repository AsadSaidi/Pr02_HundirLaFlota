import { Celda } from "./Celda.js";
import { Barco } from "./Barco.js";

export class Tablero {
    constructor(tipo) {
        this.tamanyo = 10;
        this.tipo = tipo;
        this.matrizCasillas = [];
        this.listaBarcos = [];
        this.inicializarTablero();
    }

    inicializarTablero() {
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

    sePuedeColocar(x, y, barco, orientacion, matrizOcupada) {
        if (!barco) return false;
        
        let puedeColocar = true;
        let posicionesTemp = [];

        for (let i = 0; i < barco.tamanyo; i++) {
            let coordenadaX = orientacion === "vertical" ? x + i : x;
            let coordenadaY = orientacion === "horizontal" ? y + i : y;

            if (coordenadaX >= 10 || coordenadaY >= 10 || matrizOcupada[coordenadaX][coordenadaY]) {
                puedeColocar = false;
                break;
            }

            posicionesTemp.push({ x: coordenadaX, y: coordenadaY });
        }

        return puedeColocar;
    }

    colocarBarco(x, y, barco, orientacion, matrizOcupada) {
        if (!this.sePuedeColocar(x, y, barco, orientacion, matrizOcupada)) {
            return false;
        }

        let posicionesTemp = [];
        for (let i = 0; i < barco.tamanyo; i++) {
            let coordenadaX = orientacion === "vertical" ? x + i : x;
            let coordenadaY = orientacion === "horizontal" ? y + i : y;

            matrizOcupada[coordenadaX][coordenadaY] = true;
            let celda = this.obtenerCelda(coordenadaX, coordenadaY);
            celda.estado = "barco";
            celda.barco = barco;
            posicionesTemp.push({ x: coordenadaX, y: coordenadaY });
        }

        barco.listaPosiciones = posicionesTemp;
        barco.colocado = true;
        this.listaBarcos.push(barco);
        return true;
    }

    realizarDisparo(x, y) {
        const celda = this.obtenerCelda(x, y);
        if (celda.atacada) {
            return { valido: false, mensaje: "Celda ya atacada" };
        }

        celda.atacada = true;
        if (celda.estado === "barco") {
            celda.estado = "tocado";
            if (celda.barco) {
                celda.barco.tocados++;
            }
            
            const resultado = {
                valido: true,
                acertado: true,
                hundido: celda.barco ? celda.barco.estaHundido() : false,
                barco: celda.barco
            };

            if (resultado.hundido) {
                resultado.mensaje = `¡Has hundido el ${celda.barco.nombre}!`;
            } else {
                resultado.mensaje = "¡Tocado!";
            }

            return resultado;
        }

        return {
            valido: true,
            acertado: false,
            mensaje: "Agua"
        };
    }

    obtenerEstadoTablero() {
        return {
            matriz: this.matrizCasillas,
            barcos: this.listaBarcos
        };
    }

    verificarVictoria() {
        return this.listaBarcos.every(barco => barco.estaHundido());
    }

    // Método para serializar el tablero
    toJSON() {
        return {
            tamanyo: this.tamanyo,
            tipo: this.tipo,
            matrizCasillas: this.matrizCasillas.map(fila => 
                fila.map(celda => ({
                    x: celda.x,
                    y: celda.y,
                    estado: celda.estado,
                    atacada: celda.atacada,
                    barco: celda.barco ? {
                        nombre: celda.barco.nombre,
                        tamanyo: celda.barco.tamanyo,
                        tocados: celda.barco.tocados,
                        listaPosiciones: celda.barco.listaPosiciones.map(pos => ({
                            x: pos.posicionX !== undefined ? pos.posicionX : pos.x,
                            y: pos.posicionY !== undefined ? pos.posicionY : pos.y
                        }))
                    } : null
                }))
            ),
            listaBarcos: this.listaBarcos.map(barco => ({
                nombre: barco.nombre,
                tamanyo: barco.tamanyo,
                tocados: barco.tocados,
                listaPosiciones: barco.listaPosiciones.map(pos => ({
                    x: pos.posicionX !== undefined ? pos.posicionX : pos.x,
                    y: pos.posicionY !== undefined ? pos.posicionY : pos.y
                }))
            }))
        };
    }

    // Método para deserializar el tablero (la hecho static para que no necessitemos crear un obejto de tipo de tablero para utilziarla)
    static fromJSON(json) {
 
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }

        const tablero = new Tablero(json.tipo || 'usuario');
   
        if (json.tamanyo !== undefined && json.tamanyo !== null) {
            tablero.tamanyo = json.tamanyo;
        } else if (json.tamaño !== undefined && json.tamaño !== null) {
            tablero.tamanyo = json.tamaño;
        } else {
            tablero.tamanyo = 10;
        }
        

        let matrizCasillasData;
        if (json.matrizCasillas !== undefined && json.matrizCasillas !== null) {
            matrizCasillasData = json.matrizCasillas;
        } else {
            matrizCasillasData = json.casillas;
        }

        let listaBarcosData;
        if (json.listaBarcos !== undefined && json.listaBarcos !== null) {
            listaBarcosData = json.listaBarcos;
        } else {
            listaBarcosData = json.barcos;
        }

        // Resconstruye la matriz de celdas (matrizCasillas) con los datos que hemos deserializado
        tablero.matrizCasillas = matrizCasillasData.map(fila =>
            fila.map(celdaData => {
                let celda;
                celda = new Celda(celdaData.x, celdaData.y);
                
                //Asigna si hay agua o un barco
                if (celdaData.estado !== undefined && celdaData.estado !== null) {
                    celda.estado = celdaData.estado;
                } else {
                    if (celdaData.ocupada) {
                        celda.estado = 'barco';
                    } else {
                        celda.estado = 'agua';
                    }
                }

                //Asigna true si ha sido atacada
                if (celdaData.atacada) {
                    celda.atacada = true;
                } else if (celdaData.impactada) {
                    celda.atacada = true;
                } else {
                    celda.atacada = false;
                }

                return celda;
            })
        );

        // Resconstruye los barcos en sus posuciones
        tablero.listaBarcos = listaBarcosData.map(barcoData => {
            let tamanyoFinal;
            if (barcoData.tamanyo) {
                tamanyoFinal = barcoData.tamanyo;
            } else {
                tamanyoFinal = barcoData.tamaño;
            }

            const barco = new Barco(barcoData.nombre, tamanyoFinal);

            if (barcoData.tocados) {
                barco.tocados = barcoData.tocados;
            } else {
                barco.tocados = 0;
            }

            let infoPosicion;
            if (barcoData.listaPosiciones) {
                infoPosicion = barcoData.listaPosiciones;
            } else if (barcoData.posiciones) {
                infoPosicion = barcoData.posiciones;
            } else {
                infoPosicion = [];
            }

            barco.listaPosiciones = [];

            infoPosicion.forEach(posData => {
                let posX;
                let posY;

                // Obtenngo la coordenada X: primero intento con posicionX, si no, con x.
                if (posData.posicionX !== undefined && typeof posData.posicionX === 'number') {
                    posX = posData.posicionX;
                } else if (posData.x !== undefined && typeof posData.x === 'number') {
                    posX = posData.x;
                } else {
                    posX = undefined;
                }

                // Obtenngo la coordenada Y: primero intento con posicionY, si no, con y.
                if (posData.posicionY !== undefined && typeof posData.posicionY === 'number') {
                    posY = posData.posicionY;
                } else if (posData.y !== undefined && typeof posData.y === 'number') {
                    posY = posData.y;
                } else {
                    posY = undefined;
                }

                // Compruebo que ambas coordenadas son validas y estan dentro de los limites del tablero
                if (posX !== undefined && posY !== undefined && posX >= 0 && posX < tablero.tamanyo && posY >= 0 && posY < tablero.tamanyo) {
                    const celda = tablero.matrizCasillas[posX][posY];

                    // Vinculo la celda al barco, y el barco a la celda
                    celda.barco = barco;
                    barco.listaPosiciones.push(celda);

                    // Si el estado no es "tocado" ni "barco", ponerlo como "barco"
                    if (celda.estado !== "tocado" && celda.estado !== "barco") {
                        celda.estado = "barco";
                    }

                }
            });

            return barco;
        });

       //Vincula las celdas con los barcos y llenamos listaPosiciones de cada barco
        let tempMatrizOcupada = Array.from({ length: tablero.tamanyo }, () => Array(tablero.tamanyo).fill(false));

        for (let i = 0; i < tablero.tamanyo; i++) {
            for (let j = 0; j < tablero.tamanyo; j++) {
                const celda = tablero.matrizCasillas[i][j];

                // Determina si la celda debe tener un barco basado en su estado o un nombre temporal de barco
                let tieneBarco = false;
                if (celda.estado === "barco") {
                    tieneBarco = true;
                } else if (celda.estado === "tocado") {
                    tieneBarco = true;
                } else if (celda._tempBarcoNombre) {
                    tieneBarco = true;
                }

                if (tieneBarco) {
                    let barcoVinculado = null;
    
                    // Intento 1: Vincular usando nombre y datos del barco dentro de la celda
                    const datosBarcoEnCelda = matrizCasillasData[i][j].barco; // Obtener posible info del barco desde los datos originales guardados

                    if (celda._tempBarcoNombre) {
                        // Si hay un nombre temporal del barco (formato antiguo), buscar barco con ese nombre
                        for (let k = 0; k < tablero.listaBarcos.length; k++) {
                            if (tablero.listaBarcos[k].nombre === celda._tempBarcoNombre) {
                                barcoVinculado = tablero.listaBarcos[k];
                                break;
                            }
                        }
                    } else {
                        if (datosBarcoEnCelda && datosBarcoEnCelda.nombre) {
                            // Busca un barco por nombre en el formato nuevo dentro de la celda
                            for (let i = 0; i < tablero.listaBarcos.length; i++) {
                                if (tablero.listaBarcos[i].nombre === datosBarcoEnCelda.nombre) {
                                    // COmprueba si el tamaño coincide 
                                    if (datosBarcoEnCelda.tamanyo !== undefined) {
                                        if (tablero.listaBarcos[i].tamanyo === datosBarcoEnCelda.tamanyo) {
                                            barcoVinculado = tablero.listaBarcos[i];
                                            break;
                                        } else {
                                            // Si no conciden no se vincula
                                            barcoVinculado = null;
                                        }
                                    } else {
                                        // Si el tamaaño es null, lo vincula igual
                                        barcoVinculado = tablero.listaBarcos[i];
                                        break;
                                    }
                                }
                            }
                        }
                    }

                    // Intento 2: Si no se vinculó, esto busca un barco según posiciones
                    if (barcoVinculado === null) {
                        // Recorre todos los barcos
                        for (let k = 0; k < tablero.listaBarcos.length; k++) {
                            let barco = tablero.listaBarcos[k];
                            // Busca las posiciones originales de ese barco
                            let infoPosicion = [];
                            for (let m = 0; m < listaBarcosData.length; m++) {
                                if (listaBarcosData[m].nombre === barco.nombre) {
                                    if (listaBarcosData[m].listaPosiciones) {
                                        infoPosicion = listaBarcosData[m].listaPosiciones;
                                    } else if (listaBarcosData[m].posiciones) {
                                        infoPosicion = listaBarcosData[m].posiciones;
                                    } else {
                                        infoPosicion = [];
                                    }
                                    break;
                                }
                            }

                            // Busca si alguna posición coincide con la celda actual (i,j)
                            for (let n = 0; n < infoPosicion.length; n++) {
                                let posData = infoPosicion[n];
                                let posX, posY;

                                if (posData.posicionX !== undefined) {
                                    posX = posData.posicionX;
                                } else if (posData.x !== undefined) {
                                    posX = posData.x;
                                } else {
                                    posX = undefined;
                                }

                                if (posData.posicionY !== undefined) {
                                    posY = posData.posicionY;
                                } else if (posData.y !== undefined) {
                                    posY = posData.y;
                                } else {
                                    posY = undefined;
                                }

                                if (typeof posX === 'number' && typeof posY === 'number' && posX === i && posY === j) {
                                    barcoVinculado = barco;
                                    break;
                                }
                            }

                            if (barcoVinculado !== null) {
                                break;
                            }
                        }
                    }

                    if (barcoVinculado !== null) {
                        celda.barco = barcoVinculado;
                        // Añado la celda a la lista de posiciones del barco si no está ya incluida
                        let estaEnLista = false;
                        for (let p = 0; p < barcoVinculado.listaPosiciones.length; p++) {
                            if (barcoVinculado.listaPosiciones[p] === celda) {
                                estaEnLista = true;
                                break;
                            }
                        }
                        if (!estaEnLista) {
                            barcoVinculado.listaPosiciones.push(celda);
                        }
                        // Marco la celda como ocupada en la matriz temp
                        tempMatrizOcupada[i][j] = true;


                    }
                }
            }
        }

        // Después de vincular, marco cada barco como colocado si tiene posiciones
        for (let i = 0; i < tablero.listaBarcos.length; i++) {
            let barco = tablero.listaBarcos[i];
            if (barco.listaPosiciones.length > 0) {
                barco.colocado = true;
            } else {
                barco.colocado = false;
            }

            if (barco.tamanyo !== undefined) {
                if (barco.tocados === barco.tamanyo && barco.colocado) {
                    for (let j = 0; j < barco.listaPosiciones.length; j++) {
                        let celda = barco.listaPosiciones[j];
                        celda.estado = "tocado";
                        celda.atacada = true;
                    }
                }
            } else {
                if (barco.tocados === barco.tamaño && barco.colocado) {
                    for (let j = 0; j < barco.listaPosiciones.length; j++) {
                        let celda = barco.listaPosiciones[j];
                        celda.estado = "tocado";
                        celda.atacada = true;
                    }
                }
            }
        }

        // Reconstruyo las matrices que idncian ocupación para usuario y IA
        tablero.matrizUsuarioOcupada = Array.from({ length: tablero.tamanyo }, () => Array(tablero.tamanyo).fill(false));
        tablero.matrizIAOcupada = Array.from({ length: tablero.tamanyo }, () => Array(tablero.tamanyo).fill(false));

        for (let i = 0; i < tablero.listaBarcos.length; i++) {
            let barco = tablero.listaBarcos[i];
            if (barco.colocado) {
                for (let j = 0; j < barco.listaPosiciones.length; j++) {
                    let celda = barco.listaPosiciones[j];
                    if (celda && typeof celda.posicionX === 'number' && typeof celda.posicionY === 'number' &&
                        celda.posicionX >= 0 && celda.posicionX < tablero.tamanyo &&
                        celda.posicionY >= 0 && celda.posicionY < tablero.tamanyo) {
                        if (tablero.tipo === 'usuario') {
                            tablero.matrizUsuarioOcupada[celda.posicionX][celda.posicionY] = true;
                        } else if (tablero.tipo === 'ia') {
                            tablero.matrizIAOcupada[celda.posicionX][celda.posicionY] = true;
                        }
                    } else {
                        console.warn("No se actualizó la matriz de ocupación por coordenadas inválidas en celda:", celda);
                    }
                }
            }
        }

        return tablero;

    }
}
