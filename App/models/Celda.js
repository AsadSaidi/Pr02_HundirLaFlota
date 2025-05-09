export class Celda {
    constructor(posicionX, posicionY) {
        this.posicionX = posicionX;
        this.posicionY = posicionY;
        this.estado = "agua";
        this.barco = null;
        this.atacada = false;
    }
}
