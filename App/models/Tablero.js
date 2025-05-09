import { Celda } from "./Celda.js";

export class Tablero {
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

    sePuedeColocar(x, y){
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

        return puedeColocar;
    }


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


}
