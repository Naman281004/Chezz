import { useRef, useState, useEffect } from "react";
import Tile from "./Tile";
import {
  VERTICAL_AXIS,
  HORIZONTAL_AXIS,
  GRID_SIZE,
} from "../Constants";
import { Position } from "../models";

export default function Chessboard({playMove, pieces, getValidMoves}) {
  const [activePiece, setActivePiece] = useState(null);
  const [grabPosition, setGrabPosition] = useState(new Position(-1, -1));
  const chessboardRef = useRef(null);
  const [draggedPieceInfo, setDraggedPieceInfo] = useState(null);
  const [selectedPiece, setSelectedPiece] = useState(null);
  
  // Reset selected piece when board changes (after a move)
  useEffect(() => {
    if (selectedPiece) {
      const pieceStillExists = pieces.some(p => 
        p.samePosition(selectedPiece.position) && 
        p.type === selectedPiece.type && 
        p.team === selectedPiece.team
      );
      
      if (!pieceStillExists) {
        setSelectedPiece(null);
      }
    }
  }, [pieces, selectedPiece]);

  // Handle click on the board (for selecting pieces without dragging)
  function handleTileClick(e) {
    const chessboard = chessboardRef.current;
    if (!chessboard) return;
    
    const chessboardRect = chessboard.getBoundingClientRect();
    const x = Math.floor((e.clientX - chessboardRect.left) / 80);
    const y = 7 - Math.floor((e.clientY - chessboardRect.top) / 80);
    const clickPosition = new Position(x, y);
    
    // If we already have a selected piece, try to move it
    if (selectedPiece) {
      // If there are no possible moves calculated yet, calculate them
      if (!selectedPiece.possibleMoves) {
        selectedPiece.possibleMoves = getValidMoves(selectedPiece, pieces);
      }
      
      const isValidMove = selectedPiece.possibleMoves.some(move => 
        move.samePosition(clickPosition)
      );
      
      if (isValidMove) {
        playMove(selectedPiece, clickPosition);
        setSelectedPiece(null);
        return;
      }
    }
    
    // Otherwise, select a new piece or deselect if clicking the same piece
    const pieceAtPosition = pieces.find(p => p.samePosition(clickPosition));
    
    if (selectedPiece && pieceAtPosition && 
        pieceAtPosition.samePosition(selectedPiece.position)) {
      // Deselect if clicking the same piece
      setSelectedPiece(null);
    } else if (pieceAtPosition) {
      // Select the new piece and calculate its possible moves
      const newSelectedPiece = {...pieceAtPosition};
      newSelectedPiece.possibleMoves = getValidMoves(newSelectedPiece, pieces);
      setSelectedPiece(newSelectedPiece);
    } else {
      // Clicked on empty square, deselect
      setSelectedPiece(null);
    }
  }

  function grabPiece(e) {
    // Don't handle grab if we're just clicking
    if (e.button !== undefined && e.button !== 0) return;
    
    const element = e.target;
    const chessboard = chessboardRef.current;
    if (element.classList.contains("chess-piece") && chessboard) {
      e.preventDefault();
      
      // Calculate board coordinates
      const chessboardRect = chessboard.getBoundingClientRect();
      const grabX = Math.floor((e.clientX - chessboardRect.left) / 80);
      const grabY = 7 - Math.floor((e.clientY - chessboardRect.top) / 80);
      
      // Check if there's a piece at this position
      const currentPiece = pieces.find(p => p.samePosition(new Position(grabX, grabY)));
      if (!currentPiece) return;
      
      // Store the position of the piece we're grabbing
      setGrabPosition(new Position(grabX, grabY));
      
      // Find the piece and calculate its possible moves
      const newSelectedPiece = {...currentPiece};
      newSelectedPiece.possibleMoves = getValidMoves(newSelectedPiece, pieces);
      setSelectedPiece(newSelectedPiece);
      
      // Store the dragged piece info - position it exactly at cursor
      setDraggedPieceInfo({
        position: new Position(grabX, grabY),
        image: currentPiece.image,
        x: e.clientX,
        y: e.clientY
      });

      setActivePiece(element);
    }
  }

  function movePiece(e) {
    if (activePiece && draggedPieceInfo) {
      e.preventDefault();
      
      // Update the dragged piece position - keep it exactly at cursor
      setDraggedPieceInfo({
        ...draggedPieceInfo,
        x: e.clientX,
        y: e.clientY
      });
    }
  }

  function dropPiece(e) {
    const chessboard = chessboardRef.current;
    if (activePiece && chessboard && draggedPieceInfo) {
      e.preventDefault();
      
      const chessboardRect = chessboard.getBoundingClientRect();
      const x = Math.floor((e.clientX - chessboardRect.left) / 80);
      const y = 7 - Math.floor((e.clientY - chessboardRect.top) / 80);

      // Ensure coordinates are within the board
      const validX = Math.max(0, Math.min(7, x));
      const validY = Math.max(0, Math.min(7, y));

      const currentPiece = pieces.find((p) => p.samePosition(grabPosition));

      if (currentPiece) {
        const moveSuccess = playMove(selectedPiece, new Position(validX, validY));
        
        // If the move was successful, clear the selected piece
        if (moveSuccess) {
          setSelectedPiece(null);
        }
      }
      
      setActivePiece(null);
      setDraggedPieceInfo(null);
      setGrabPosition(new Position(-1, -1));
    }
  }

  let board = [];

  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
      const number = j + i + 2;
      const currentPosition = new Position(i, j);
      
      // Don't show the piece at its original position while it's being dragged
      const isDragging = draggedPieceInfo && 
                         draggedPieceInfo.position.x === i && 
                         draggedPieceInfo.position.y === j;
      
      // Only show the piece if it's not being dragged
      const piece = isDragging ? undefined : pieces.find((p) => p.samePosition(currentPosition));
      let image = piece ? piece.image : undefined;

      // Determine if this tile should be highlighted
      let highlight = false;
      
      // Check if this position is a valid move for the selected piece
      if (selectedPiece && selectedPiece.possibleMoves) {
        highlight = selectedPiece.possibleMoves.some(move => 
          move.samePosition(currentPosition)
        );
      }

      board.push(<Tile key={`${j},${i}`} image={image} number={number} highlight={highlight} />);
    }
  }

  return (
    <>
      <div
        onMouseMove={(e) => movePiece(e)}
        onMouseDown={(e) => grabPiece(e)}
        onMouseUp={(e) => dropPiece(e)}
        onClick={(e) => handleTileClick(e)}
        onTouchStart={(e) => grabPiece(e.touches[0])}
        onTouchMove={(e) => movePiece(e.touches[0])}
        onTouchEnd={(e) => dropPiece(e.changedTouches[0])}
        id="chessboard"
        ref={chessboardRef}
        className="grid grid-cols-8 grid-rows-8 w-[640px] h-[640px] bg-[#779556] select-none relative touch-none"
      >
        {board}
        {draggedPieceInfo && (
          <div 
            className="absolute w-[60px] h-[60px] bg-no-repeat bg-contain bg-center z-50 pointer-events-none"
            style={{
              backgroundImage: `url(${draggedPieceInfo.image})`,
              left: `${draggedPieceInfo.x - 30}px`,
              top: `${draggedPieceInfo.y - 30}px`,
              position: 'fixed'
            }}
          />
        )}
      </div>
    </>
  );
}