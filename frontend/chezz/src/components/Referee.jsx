import { useEffect, useState } from "react";
import Chessboard from "./Chessboard";
import { 
  VERTICAL_AXIS, 
  HORIZONTAL_AXIS,
  GRID_SIZE,
  initialBoardState
} from "../Constants";
import { PieceType, TeamType } from "../Types";
import { Position, Piece as ChessPiece } from "../models";
import { 
  pawnMove, 
  knightMove,
  bishopMove,
  rookMove,
  queenMove,
  kingMove
} from "../rules";

export default function Referee() {
  const [board, setBoard] = useState([]);
  const [promotionPawn, setPromotionPawn] = useState();
  const [totalTurns, setTotalTurns] = useState(0);

  // Initialize the board
  useEffect(() => {
    const initialBoard = initialBoardState.map(piece => piece.clone());
    setBoard(initialBoard);
  }, []);

  // Calculate possible moves for a single piece
  function getValidMoves(piece, boardState) {
    switch(piece.type) {
      case PieceType.PAWN:
        return pawnMove(piece.position, piece.team, boardState);
      case PieceType.KNIGHT:
        return knightMove(piece.position, piece.team, boardState);
      case PieceType.BISHOP:
        return bishopMove(piece.position, piece.team, boardState);
      case PieceType.ROOK:
        return rookMove(piece.position, piece.team, boardState);
      case PieceType.QUEEN:
        return queenMove(piece.position, piece.team, boardState);
      case PieceType.KING:
        return kingMove(piece.position, piece.team, boardState);
      default:
        return [];
    }
  }

  function playMove(playedPiece, destination) {
    // If the playing piece doesn't have any moves, calculate them now
    if(playedPiece.possibleMoves === undefined) {
      playedPiece.possibleMoves = getValidMoves(playedPiece, board);
    }

    // Prevent the inactive team from playing
    if(totalTurns % 2 === 0) {
      if(playedPiece.team === TeamType.BLACK) return false;
    } else {
      if(playedPiece.team === TeamType.WHITE) return false;
    }

    const validMove = playedPiece.possibleMoves?.some(m => m.samePosition(destination));

    if(!validMove) return false;

    const enPassantMove = isEnPassantMove(
      playedPiece.position,
      destination,
      playedPiece.type,
      playedPiece.team
    );

    // playMove modifies the board
    setBoard((previousBoard) => {
      const clonedBoard = [...previousBoard];
      
      // Reset en passant flags
      clonedBoard.forEach(p => {
        p.enPassant = false;
      });
      
      // Get the index of the piece that we're moving
      const index = clonedBoard.findIndex(p => p.samePosition(playedPiece.position));

      if(index === -1) return previousBoard;

      const pawnDirection = playedPiece.team === TeamType.WHITE ? 1 : -1;

      // If the move is an en passant move
      if(enPassantMove) {
        const newBoard = enPassantMove(clonedBoard, playedPiece, destination, pawnDirection);
        if(newBoard) return newBoard;
      }

      // If a pawn gets to the end of the board (top or bottom depending on team)
      if(playedPiece.type === PieceType.PAWN && 
        ((destination.y === 7 && playedPiece.team === TeamType.WHITE) || 
        (destination.y === 0 && playedPiece.team === TeamType.BLACK))) {
          setPromotionPawn({
            position: destination,
            team: playedPiece.team
          });
      }

      // Set en passant flag if pawn moves two squares
      if (
        playedPiece.type === PieceType.PAWN &&
        Math.abs(playedPiece.position.y - destination.y) === 2
      ) {
        const newPiece = new ChessPiece(
          destination,
          playedPiece.type,
          playedPiece.team
        );
        newPiece.enPassant = true;
        clonedBoard[index] = newPiece;
      } else {
        clonedBoard[index] = new ChessPiece(
          destination,
          playedPiece.type,
          playedPiece.team,
          true // piece has moved
        );
      }

      // Check if a piece is attacked
      const attackedPieceIndex = clonedBoard.findIndex(p => 
        p.samePosition(destination) && p.team !== playedPiece.team);

      if(attackedPieceIndex !== -1) {
        clonedBoard.splice(attackedPieceIndex, 1);
      }

      return clonedBoard;
    });

    // Increment turn counter
    setTotalTurns(prev => prev + 1);

    // This is for promoting a pawn
    if(promotionPawn) {
      return true;
    }

    return true;
  }

  function isEnPassantMove(
    initialPosition,
    desiredPosition,
    type,
    team
  ) {
    const pawnDirection = team === TeamType.WHITE ? 1 : -1;

    if(type === PieceType.PAWN) {
      if(
        (desiredPosition.x - initialPosition.x === -1 ||
          desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = board.find(
          (p) => 
            p.position.x === desiredPosition.x && 
            p.position.y === desiredPosition.y - pawnDirection && 
            p.enPassant
        );
        if(piece) {
          return (board) => {
            const updatedBoard = [...board];
            const index = updatedBoard.findIndex(
              (p) => 
                p.position.x === desiredPosition.x && 
                p.position.y === desiredPosition.y - pawnDirection
            );
            if(index !== -1) {
              updatedBoard.splice(index, 1);
            }
            return updatedBoard;
          };
        }
      }
    }

    return false;
  }

  function promotePawn(pieceType) {
    if(promotionPawn === undefined) {
      return;
    }

    setBoard((previousBoard) => {
      const clonedBoard = [...previousBoard];
      
      // Remove the pawn that is being promoted
      const pawnIndex = clonedBoard.findIndex(p => 
        p.position.samePosition(promotionPawn.position) && 
        p.type === PieceType.PAWN && 
        p.team === promotionPawn.team
      );
      
      if(pawnIndex !== -1) {
        clonedBoard.splice(pawnIndex, 1);
      }
      
      // Add the new promoted piece
      clonedBoard.push(new ChessPiece(
        new Position(promotionPawn.position.x, promotionPawn.position.y),
        pieceType,
        promotionPawn.team
      ));

      return clonedBoard;
    });

    setPromotionPawn(undefined);
  }

  function promotionTeamType() {
    return promotionPawn?.team === TeamType.WHITE ? "w" : "b";
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="relative">
        <Chessboard playMove={playMove} pieces={board} getValidMoves={getValidMoves} />
        {promotionPawn && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-around p-4 w-80 h-80 bg-black bg-opacity-70 rounded-lg z-50">
            <img
              onClick={() => promotePawn(PieceType.ROOK)}
              src={`/assets/images/rook_${promotionTeamType()}.png`}
              className="w-16 h-16 cursor-pointer hover:bg-blue-500 rounded-md"
            />
            <img
              onClick={() => promotePawn(PieceType.BISHOP)}
              src={`/assets/images/bishop_${promotionTeamType()}.png`}
              className="w-16 h-16 cursor-pointer hover:bg-blue-500 rounded-md"
            />
            <img
              onClick={() => promotePawn(PieceType.KNIGHT)}
              src={`/assets/images/knight_${promotionTeamType()}.png`}
              className="w-16 h-16 cursor-pointer hover:bg-blue-500 rounded-md"
            />
            <img
              onClick={() => promotePawn(PieceType.QUEEN)}
              src={`/assets/images/queen_${promotionTeamType()}.png`}
              className="w-16 h-16 cursor-pointer hover:bg-blue-500 rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
}