import { PieceType, TeamType } from "../components/Chessboard";

export default class Referee {
    isValidMove(px, py, x, y, type, team) {
      console.log("Referee is checking the move...");
      console.log(`Previous location: (${px},${py})`);
      console.log(`Current location: (${x},${y})`);
      console.log(`Piece type: ${type}`);
      console.log(`Team: ${team}`);
  
      if (type === PieceType.PAWN) {
        const specialRow = team === TeamType.OUR ? 1 : 6;
        const direction = team === TeamType.OUR ? 1 : -1;
        
        // Moving forward
        if (px === x) {
          if (py === specialRow) {
            // First move can be 1 or 2 squares
            if (y - py === direction || y - py === 2 * direction) {
              return true;
            }
          } else {
            // Regular move - 1 square forward
            if (y - py === direction) {
              return true;
            }
          }
        }
      }
  
      return false;
    }
  }