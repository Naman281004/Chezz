import React from 'react';
import Tile from "./Tile";
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

let initialBoardSetup = [];

for (let i = 0; i < 8; i++) {
  initialBoardSetup.push({ image: pawnB, x: i, y: 6 });
}

for (let i = 0; i < 8; i++) {
  initialBoardSetup.push({ image: pawnW, x: i, y: 1 });
}

initialBoardSetup.push({ image: rookB, x: 0, y: 7 });
initialBoardSetup.push({ image: knightB, x: 1, y: 7 });
initialBoardSetup.push({ image: bishopB, x: 2, y: 7 });
initialBoardSetup.push({ image: queenB, x: 3, y: 7 });
initialBoardSetup.push({ image: kingB, x: 4, y: 7 });
initialBoardSetup.push({ image: bishopB, x: 5, y: 7 });
initialBoardSetup.push({ image: knightB, x: 6, y: 7 });
initialBoardSetup.push({ image: rookB, x: 7, y: 7 });

initialBoardSetup.push({ image: rookW, x: 0, y: 0 });
initialBoardSetup.push({ image: knightW, x: 1, y: 0 });
initialBoardSetup.push({ image: bishopW, x: 2, y: 0 });
initialBoardSetup.push({ image: queenW, x: 3, y: 0 });
initialBoardSetup.push({ image: kingW, x: 4, y: 0 });
initialBoardSetup.push({ image: bishopW, x: 5, y: 0 });
initialBoardSetup.push({ image: knightW, x: 6, y: 0 });
initialBoardSetup.push({ image: rookW, x: 7, y: 0 });

let activePiece = null;

function grabPiece(e) {
  const element = e.target;
  
  if (element.classList.contains("chess-piece")) {
    const x = e.clientX -35;
    const y = e.clientY -35;
    element.style.position = "absolute";
    element.style.left = `${x}px`;
    element.style.top = `${y}px`;
    
    activePiece = element;
  }
}

function movePiece(e) {
  if (activePiece) {
    const x = e.clientX -35;
    const y = e.clientY -35;
    activePiece.style.position = "absolute";
    activePiece.style.left = `${x}px`;
    activePiece.style.top = `${y}px`;
  }
}

function dropPiece(e) {
  if (activePiece) {
    activePiece = null;
  }
}

export default function Chessboard() {
  let board = [];

  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < horizontalAxis.length; i++) {
      const number = i + j;

      const piece = initialBoardSetup.find(p => p.x === i && p.y === j);

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
    >
      {board}
    </div>
  );
}



