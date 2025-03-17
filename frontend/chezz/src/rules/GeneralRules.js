import { Piece, Position } from "../models";
import { TeamType } from "../Types";

export const tileIsOccupied = (position, boardState) => {
    const piece = boardState.find((p) => p.samePosition(position));

    if (piece) {
      return true;
    } else {
      return false;
    }
  };

export const tileIsOccupiedByOpponent = (
    position,
    boardState,
    team
  ) => {
    const piece = boardState.find(
      (p) => p.samePosition(position) && p.team !== team
    );

    if (piece) {
      return true;
    } else {
      return false;
    }
  };

export const tileIsEmptyOrOccupiedByOpponent = (
    position,
    boardState,
    team
  ) => {
    return (
      !tileIsOccupied(position, boardState) ||
      tileIsOccupiedByOpponent(position, boardState, team)
    );
  };