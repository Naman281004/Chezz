import { PieceType, TeamType } from "../Types";
import { Position } from "./Position";

export class Move {
    constructor(team,
        piece,
        fromPosition,
        toPosition) {
            this.team = team;
            this.piece = piece;
            this.fromPosition = fromPosition;
            this.toPosition = toPosition;
    }

    toMessage() {
        return `${this.team === TeamType.OPPONENT ? "Black" : "White"} 
        moved ${this.piece} from position 
        ${this.fromPosition.x}, ${this.fromPosition.y} to position 
        ${this.toPosition.x}, ${this.toPosition.y}.`;
    }

    clone() {
        return new Move(this.team, this.piece,
             this.fromPosition.clone(), this.toPosition.clone());
    }
}