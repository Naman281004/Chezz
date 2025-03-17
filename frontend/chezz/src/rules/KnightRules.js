import { Position } from "../models";
import { tileIsEmptyOrOccupiedByOpponent } from "./GeneralRules";

export const knightMove = (position, team, boardState) => {
  const possibleMoves = [];

  for (let i = -1; i < 2; i += 2) {
    for (let j = -1; j < 2; j += 2) {
      // Vertical moves (2 squares up/down, 1 square left/right)
      const verticalMove = new Position(position.x + j, position.y + i * 2);
      
      // Horizontal moves (2 squares left/right, 1 square up/down)
      const horizontalMove = new Position(position.x + i * 2, position.y + j);

      if(tileIsEmptyOrOccupiedByOpponent(verticalMove, boardState, team)) {
        possibleMoves.push(verticalMove);
      }

      if(tileIsEmptyOrOccupiedByOpponent(horizontalMove, boardState, team)) {
        possibleMoves.push(horizontalMove);
      }
    }
  }

  return possibleMoves;
};

export const getPossibleKnightMoves = (knight, boardstate) => {
  const possibleMoves = [];

  for (let i = -1; i < 2; i += 2) {
    for (let j = -1; j < 2; j += 2) {
      const verticalMove = new Position(knight.position.x + j, knight.position.y + i * 2);
      const horizontalMove = new Position(knight.position.x + i * 2, knight.position.y + j);

      if(tileIsEmptyOrOccupiedByOpponent(verticalMove, boardstate, knight.team)) {
        possibleMoves.push(verticalMove);
      }

      if(tileIsEmptyOrOccupiedByOpponent(horizontalMove, boardstate, knight.team)) {
        possibleMoves.push(horizontalMove);
      }
    }
  }

  return possibleMoves;
};