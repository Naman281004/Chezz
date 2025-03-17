import { TeamType } from "../Types";
import { Piece, Position } from "../models";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const rookMove = (position, team, boardState) => {
  const possibleMoves = [];
  
  // Upward movement
  for(let i = 1; i < 8; i++) {
    const passedPosition = new Position(position.x, position.y + i);
    
    if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
      possibleMoves.push(passedPosition);
    }
    
    if(tileIsOccupied(passedPosition, boardState)) {
      break;
    }
  }
  
  // Downward movement
  for(let i = 1; i < 8; i++) {
    const passedPosition = new Position(position.x, position.y - i);
    
    if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
      possibleMoves.push(passedPosition);
    }
    
    if(tileIsOccupied(passedPosition, boardState)) {
      break;
    }
  }
  
  // Right movement
  for(let i = 1; i < 8; i++) {
    const passedPosition = new Position(position.x + i, position.y);
    
    if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
      possibleMoves.push(passedPosition);
    }
    
    if(tileIsOccupied(passedPosition, boardState)) {
      break;
    }
  }
  
  // Left movement
  for(let i = 1; i < 8; i++) {
    const passedPosition = new Position(position.x - i, position.y);
    
    if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
      possibleMoves.push(passedPosition);
    }
    
    if(tileIsOccupied(passedPosition, boardState)) {
      break;
    }
  }
  
  return possibleMoves;
};

export const getPossibleRookMoves = (rook, boardstate) => {
    const possibleMoves = [];

    // Top movement
    for(let i = 1; i < 8; i++) {
      // Stop checking if move is outside of the board
      if(rook.position.y + i > 7) break;
      const destination = new Position(rook.position.x, rook.position.y + i);

      if(!tileIsOccupied(destination, boardstate)) {
        possibleMoves.push(destination);
      } else if(tileIsOccupiedByOpponent(destination, boardstate, rook.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }

    // Bottom movement
    for(let i = 1; i < 8; i++) {
      // Stop checking if move is outside of the board
      if(rook.position.y - i < 0) break;

      const destination = new Position(rook.position.x, rook.position.y - i);

      if(!tileIsOccupied(destination, boardstate)) {
        possibleMoves.push(destination);
      } else if(tileIsOccupiedByOpponent(destination, boardstate, rook.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }

    // Left movement
    for(let i = 1; i < 8; i++) {
      // Stop checking if move is outside of the board
      if(rook.position.x - i < 0) break;

      const destination = new Position(rook.position.x - i, rook.position.y);

      if(!tileIsOccupied(destination, boardstate)) {
        possibleMoves.push(destination);
      } else if(tileIsOccupiedByOpponent(destination, boardstate, rook.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }

    // Right movement
    for(let i = 1; i < 8; i++) {
      // Stop checking if move is outside of the board
      if(rook.position.x + i > 7) break;

      const destination = new Position(rook.position.x + i, rook.position.y);

      if(!tileIsOccupied(destination, boardstate)) {
        possibleMoves.push(destination);
      } else if(tileIsOccupiedByOpponent(destination, boardstate, rook.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }

    return possibleMoves;
  };