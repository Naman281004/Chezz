import { Position } from "../models";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied } from "./GeneralRules";

export const bishopMove = (position, team, boardState) => {
  const possibleMoves = [];
  
  // Up-right movement
  for(let i = 1; i < 8; i++) {
    const passedPosition = new Position(position.x + i, position.y + i);
    
    if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
      possibleMoves.push(passedPosition);
    }
    
    if(tileIsOccupied(passedPosition, boardState)) {
      break;
    }
  }
  
  // Up-left movement
  for(let i = 1; i < 8; i++) {
    const passedPosition = new Position(position.x - i, position.y + i);
    
    if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
      possibleMoves.push(passedPosition);
    }
    
    if(tileIsOccupied(passedPosition, boardState)) {
      break;
    }
  }
  
  // Down-right movement
  for(let i = 1; i < 8; i++) {
    const passedPosition = new Position(position.x + i, position.y - i);
    
    if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
      possibleMoves.push(passedPosition);
    }
    
    if(tileIsOccupied(passedPosition, boardState)) {
      break;
    }
  }
  
  // Down-left movement
  for(let i = 1; i < 8; i++) {
    const passedPosition = new Position(position.x - i, position.y - i);
    
    if(tileIsEmptyOrOccupiedByOpponent(passedPosition, boardState, team)) {
      possibleMoves.push(passedPosition);
    }
    
    if(tileIsOccupied(passedPosition, boardState)) {
      break;
    }
  }
  
  return possibleMoves;
};