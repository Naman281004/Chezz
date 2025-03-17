import { TeamType } from "../Types";
import { Piece, Position } from "../models";
import { tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";
import { Pawn } from "../models/Pawn";

export const pawnMove = (initialPosition, team, boardState) => {
  const specialRow = team === TeamType.WHITE ? 1 : 6;
  const pawnDirection = team === TeamType.WHITE ? 1 : -1;
  
  const possibleMoves = [];

  // Forward movement
  const normalMove = new Position(initialPosition.x, initialPosition.y + pawnDirection);
  if (!tileIsOccupied(normalMove, boardState)) {
    possibleMoves.push(normalMove);

    // Special first move (2 squares)
    if (initialPosition.y === specialRow) {
      const specialMove = new Position(initialPosition.x, initialPosition.y + 2 * pawnDirection);
      if (!tileIsOccupied(specialMove, boardState)) {
        possibleMoves.push(specialMove);
      }
    }
  }

  // Attacking moves
  const upperLeftAttack = new Position(initialPosition.x - 1, initialPosition.y + pawnDirection);
  const upperRightAttack = new Position(initialPosition.x + 1, initialPosition.y + pawnDirection);
  
  if (tileIsOccupiedByOpponent(upperLeftAttack, boardState, team)) {
    possibleMoves.push(upperLeftAttack);
  }
  
  if (tileIsOccupiedByOpponent(upperRightAttack, boardState, team)) {
    possibleMoves.push(upperRightAttack);
  }

  // En passant moves
  // Check for en passant on the left
  if (initialPosition.x > 0) {
    const leftPiece = boardState.find(p => 
      p.position.x === initialPosition.x - 1 && 
      p.position.y === initialPosition.y && 
      p.isPawn && 
      p.team !== team && 
      p.enPassant
    );
    
    if (leftPiece) {
      possibleMoves.push(new Position(initialPosition.x - 1, initialPosition.y + pawnDirection));
    }
  }
  
  // Check for en passant on the right
  if (initialPosition.x < 7) {
    const rightPiece = boardState.find(p => 
      p.position.x === initialPosition.x + 1 && 
      p.position.y === initialPosition.y && 
      p.isPawn && 
      p.team !== team && 
      p.enPassant
    );
    
    if (rightPiece) {
      possibleMoves.push(new Position(initialPosition.x + 1, initialPosition.y + pawnDirection));
    }
  }

  return possibleMoves;
};

export const getPossiblePawnMoves = (pawn, boardState) => {
  const possibleMoves = [];

  const specialRow = pawn.team === TeamType.WHITE ? 1 : 6;
  const pawnDirection = pawn.team === TeamType.WHITE ? 1 : -1;

  const normalMove = new Position(pawn.position.x, pawn.position.y + pawnDirection);
  const specialMove = new Position(normalMove.x, normalMove.y + pawnDirection);
  const upperLeftAttack = new Position(pawn.position.x - 1, pawn.position.y + pawnDirection);
  const upperRightAttack = new Position(pawn.position.x + 1, pawn.position.y + pawnDirection);
  const leftPosition = new Position(pawn.position.x - 1, pawn.position.y);
  const rightPosition = new Position(pawn.position.x + 1, pawn.position.y);

  if (!tileIsOccupied(normalMove, boardState)) {
    possibleMoves.push(normalMove);

    if (pawn.position.y === specialRow &&
      !tileIsOccupied(specialMove, boardState)) {
      possibleMoves.push(specialMove);
    }
  }

  if (tileIsOccupiedByOpponent(upperLeftAttack, boardState, pawn.team)) {
    possibleMoves.push(upperLeftAttack);
  } else if (!tileIsOccupied(upperLeftAttack, boardState)) {
    const leftPiece = boardState.find(p => p.samePosition(leftPosition));
    if (leftPiece != null && leftPiece.enPassant) {
      possibleMoves.push(upperLeftAttack);
    }
  }

  if (tileIsOccupiedByOpponent(upperRightAttack, boardState, pawn.team)) {
    possibleMoves.push(upperRightAttack);
  } else if (!tileIsOccupied(upperRightAttack, boardState)) {
    const rightPiece = boardState.find(p => p.samePosition(rightPosition));
    if (rightPiece != null && rightPiece.enPassant) {
      possibleMoves.push(upperRightAttack);
    }
  }

  return possibleMoves;
};