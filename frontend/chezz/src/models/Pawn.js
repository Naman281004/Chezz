import { PieceType, TeamType } from "../Types";
import { Piece } from "./Piece";
import { Position } from "./Position";

export class Pawn extends Piece {
    constructor(position, 
        team, hasMoved,
        enPassant,
        possibleMoves = []) {
        super(position, PieceType.PAWN, team, hasMoved, possibleMoves);
        this.enPassant = enPassant;
    }

    clone() {
        return new Pawn(this.position.clone(),
         this.team, this.hasMoved, this.enPassant, 
         this.possibleMoves ? this.possibleMoves.map(m => m.clone()) : []);
    }
}