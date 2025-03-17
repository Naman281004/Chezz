import { PieceType, TeamType } from "../Types";
import { Piece } from "./Piece";
import { Position } from "./Position";

export class SimplifiedPiece {
    constructor(piece) {
        this.position = piece.position.clone();
        this.type = piece.type;
        this.team = piece.team;
        this.possibleMoves = 
        piece.possibleMoves ? piece.possibleMoves.map(pm => pm.clone()) : [];
    }
}