export class Barco {
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