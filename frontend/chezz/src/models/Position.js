export class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    samePosition(otherPosition) {
        return this.x === otherPosition.x &&
            this.y === otherPosition.y;
    }

    clone() {
        return new Position(this.x, this.y);
    }
}