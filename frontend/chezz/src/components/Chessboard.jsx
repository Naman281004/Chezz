import React, { useRef, useState } from "react";
import Tile from "./Tile";
import Referee from "../rules/rules";
// Import piece images
import pawnW from "../assets/pawn_w.png";
import pawnB from "../assets/pawn_b.png";
import rookW from "../assets/rook_w.png";
import rookB from "../assets/rook_b.png";
import knightW from "../assets/knight_w.png";
import knightB from "../assets/knight_b.png";
import bishopW from "../assets/bishop_w.png";
import bishopB from "../assets/bishop_b.png";
import queenW from "../assets/queen_w.png";
import queenB from "../assets/queen_b.png";
import kingW from "../assets/king_w.png";
import kingB from "../assets/king_b.png";

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

export const PieceType = {
  PAWN: 0,
  BISHOP: 1,
  KNIGHT: 2,
  ROOK: 3,
  QUEEN: 4,
  KING: 5
};

export const TeamType = {
  OUR: 0,
  OPPONENT: 1
};

const GRID_SIZE = 80;

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  samePosition(otherPosition) {
    return this.x === otherPosition.x && this.y === otherPosition.y;
  }
}

// Initialize board setup
let initialBoardSetup = [];

for (let p = 0; p < 2; p++) {
  const teamType = (p === 0) ? TeamType.OPPONENT : TeamType.OUR;
  const type = (teamType === TeamType.OPPONENT) ? "b" : "w";
  const y = (teamType === TeamType.OPPONENT) ? 7 : 0;
  const pawnY = (teamType === TeamType.OPPONENT) ? 6 : 1;

  // Initialize pawns
  for (let i = 0; i < 8; i++) {
    initialBoardSetup.push({
      image: type === "w" ? pawnW : pawnB,
      x: i,
      y: pawnY,
      type: PieceType.PAWN,
      team: teamType
    });
  }

  // Initialize other pieces
  initialBoardSetup.push({
    image: type === "w" ? rookW : rookB,
    x: 0,
    y: y,
    type: PieceType.ROOK,
    team: teamType
  });
  initialBoardSetup.push({
    image: type === "w" ? knightW : knightB,
    x: 1,
    y: y,
    type: PieceType.KNIGHT,
    team: teamType
  });
  initialBoardSetup.push({
    image: type === "w" ? bishopW : bishopB,
    x: 2,
    y: y,
    type: PieceType.BISHOP,
    team: teamType
  });
  initialBoardSetup.push({
    image: type === "w" ? queenW : queenB,
    x: 3,
    y: y,
    type: PieceType.QUEEN,
    team: teamType
  });
  initialBoardSetup.push({
    image: type === "w" ? kingW : kingB,
    x: 4,
    y: y,
    type: PieceType.KING,
    team: teamType
  });
  initialBoardSetup.push({
    image: type === "w" ? bishopW : bishopB,
    x: 5,
    y: y,
    type: PieceType.BISHOP,
    team: teamType
  });
  initialBoardSetup.push({
    image: type === "w" ? knightW : knightB,
    x: 6,
    y: y,
    type: PieceType.KNIGHT,
    team: teamType
  });
  initialBoardSetup.push({
    image: type === "w" ? rookW : rookB,
    x: 7,
    y: y,
    type: PieceType.ROOK,
    team: teamType
  });
}

export default function Chessboard() {
  const [pieces, setPieces] = useState(initialBoardSetup);
  const [activePiece, setActivePiece] = useState(null);
  const [grabPosition, setGrabPosition] = useState(new Position(-1, -1));
  const chessboardRef = useRef(null);
  const referee = new Referee();

  function grabPiece(e) {
    const element = e.target;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess-piece") && chessboard) {
      const grabX = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const grabY = Math.abs(
        Math.ceil((e.clientY - chessboard.offsetTop - 640) / GRID_SIZE)
      );
      setGrabPosition(new Position(grabX, grabY));

      const x = e.clientX - GRID_SIZE / 2;
      const y = e.clientY - GRID_SIZE / 2;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      element.style.zIndex = "1000";

      setActivePiece(element);
    }
  }

  function movePiece(e) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const minX = chessboard.offsetLeft - 15;
      const minY = chessboard.offsetTop - 10;
      const maxX = chessboard.offsetLeft + chessboard.clientWidth - 47;
      const maxY = chessboard.offsetTop + chessboard.clientHeight - 50;
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      activePiece.style.position = "absolute";

      if (x < minX) {
        activePiece.style.left = `${minX}px`;
      } else if (x > maxX) {
        activePiece.style.left = `${maxX}px`;
      } else {
        activePiece.style.left = `${x}px`;
      }

      if (y < minY) {
        activePiece.style.top = `${minY}px`;
      } else if (y > maxY) {
        activePiece.style.top = `${maxY}px`;
      } else {
        activePiece.style.top = `${y}px`;
      }
    }
  }

  function dropPiece(e) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard) {
      const x = Math.floor((e.clientX - chessboard.offsetLeft) / GRID_SIZE);
      const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - 640) / GRID_SIZE));
      
      // Reset piece styling
      activePiece.style.position = "static";
      activePiece.style.removeProperty("top");
      activePiece.style.removeProperty("left");
      activePiece.style.removeProperty("zIndex");
      
      if (x >= 0 && x < 8 && y >= 0 && y < 8) {
        setPieces((currentPieces) => {
          // Find the moving piece and the piece at destination
          const movingPiece = currentPieces.find(
            p => p.x === grabPosition.x && p.y === grabPosition.y
          );
          const pieceAtDestination = currentPieces.find(
            p => p.x === x && p.y === y
          );
  
          if (movingPiece) {
            const validMove = referee.isValidMove(
              grabPosition.x,
              grabPosition.y,
              x,
              y,
              movingPiece.type,
              movingPiece.team
            );
  
            if (validMove) {
              // Create new array without the captured piece (if any)
              let newPieces = currentPieces.filter(p => 
                !(p.x === x && p.y === y)
              );
              
              // Remove the moving piece from its old position
              newPieces = newPieces.filter(p => 
                !(p.x === grabPosition.x && p.y === grabPosition.y)
              );
              
              // Add the moving piece at its new position
              newPieces.push({
                ...movingPiece,
                x: x,
                y: y
              });
  
              return newPieces;
            }
          }
          return currentPieces;
        });
      }
      
      setGrabPosition(new Position(-1, -1));
      setActivePiece(null);
    }
  }

  let board = [];
  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < horizontalAxis.length; i++) {
      const number = i + j;
      const piece = pieces.find(p => p.x === i && p.y === j);
      const image = piece ? piece.image : null;
      board.push(<Tile key={`${i},${j}`} image={image} number={number} />);
    }
  }

  return (
    <div
      onMouseMove={(e) => movePiece(e)}
      onMouseDown={(e) => grabPiece(e)}
      onMouseUp={(e) => dropPiece(e)}
      className="grid grid-cols-8 border-0 border-gray-800 shadow-xl w-[640px] h-[640px]"
      ref={chessboardRef}
    >
      {board}
    </div>
  );
}