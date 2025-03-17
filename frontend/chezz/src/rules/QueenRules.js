import { TeamType } from "../Types";
import { Piece, Position } from "../models";
import { tileIsEmptyOrOccupiedByOpponent, tileIsOccupied, tileIsOccupiedByOpponent } from "./GeneralRules";

export const queenMove = (position, team, boardState) => {
  const possibleMoves = [];
  
  // Diagonal moves (like bishop)
  
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
  
  // Straight moves (like rook)
  
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

export const getPossibleQueenMoves = (queen, boardstate) => {
    const possibleMoves = [];

    // Top movement
    for(let i = 1; i < 8; i++) {
      const destination = new Position(queen.position.x, queen.position.y + i);

      if(!tileIsOccupied(destination, boardstate)) {
        possibleMoves.push(destination);
      } else if(tileIsOccupiedByOpponent(destination, boardstate, queen.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }

    // Bottom movement
    for(let i = 1; i < 8; i++) {
      const destination = new Position(queen.position.x, queen.position.y - i);

      if(!tileIsOccupied(destination, boardstate)) {
        possibleMoves.push(destination);
      } else if(tileIsOccupiedByOpponent(destination, boardstate, queen.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }

    // Left movement
    for(let i = 1; i < 8; i++) {
      const destination = new Position(queen.position.x - i, queen.position.y);

      if(!tileIsOccupied(destination, boardstate)) {
        possibleMoves.push(destination);
      } else if(tileIsOccupiedByOpponent(destination, boardstate, queen.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }

    // Right movement
    for(let i = 1; i < 8; i++) {
      const destination = new Position(queen.position.x + i, queen.position.y);

      if(!tileIsOccupied(destination, boardstate)) {
        possibleMoves.push(destination);
      } else if(tileIsOccupiedByOpponent(destination, boardstate, queen.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }

    // Upper right movement
    for(let i = 1; i < 8; i++) {
      const destination = new Position(queen.position.x + i, queen.position.y + i);

      if(!tileIsOccupied(destination, boardstate)) {
        possibleMoves.push(destination);
      } else if(tileIsOccupiedByOpponent(destination, boardstate, queen.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }

    // Bottom right movement
    for(let i = 1; i < 8; i++) {
      const destination = new Position(queen.position.x + i, queen.position.y - i);

      if(!tileIsOccupied(destination, boardstate)) {
        possibleMoves.push(destination);
      } else if(tileIsOccupiedByOpponent(destination, boardstate, queen.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }

    // Bottom left movement
    for(let i = 1; i < 8; i++) {
      const destination = new Position(queen.position.x - i, queen.position.y - i);

      if(!tileIsOccupied(destination, boardstate)) {
        possibleMoves.push(destination);
      } else if(tileIsOccupiedByOpponent(destination, boardstate, queen.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }

    // Top left movement
    for(let i = 1; i < 8; i++) {
      const destination = new Position(queen.position.x - i, queen.position.y + i);

      if(!tileIsOccupied(destination, boardstate)) {
        possibleMoves.push(destination);
      } else if(tileIsOccupiedByOpponent(destination, boardstate, queen.team)) {
        possibleMoves.push(destination);
        break;
      } else {
        break;
      }
    }

    return possibleMoves;
  };