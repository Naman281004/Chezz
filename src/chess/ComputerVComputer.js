import { MINIMAX_ALPHA_BETA} from "./Minimax";
import {Chess} from "chess.js";
import { Chessboard } from "react-chessboard";
import { useEffect, useState } from "react";

function ComputerVComputer(){
    const [chess, setChess] = useState(new Chess())
    const [FEN, setFEN] = useState(chess.fen())
    const [PlayPause, setPlayPause] = useState(false);
    const [inProgress, setInProgress] = useState(true);
    const [isCheck, setIsCheck] = useState(false);
    const [winner, setWinner] = useState(null);

    function makeMinimaxABMove(game, depth, white){
        if (!game.isGameOver()) {
            const minimaxABMove = MINIMAX_ALPHA_BETA(game, depth, white, -Infinity, Infinity)[1];
            game.move(minimaxABMove)
            setFEN(game.fen())
            setIsCheck(game.inCheck());
        }
    }

    const timedMinimaxABMove = setTimeout(() => {
        if (PlayPause){
            makeMinimaxABMove(chess, 3, chess.turn()=="w")
        }
      }, 1000);

    useEffect(() => {
        if (!chess.isGameOver()){
            return () => timedMinimaxABMove
        } else {
            setInProgress(false);
            // Set winner
            if (chess.isCheckmate()) {
                setWinner(chess.turn() === "w" ? "b" : "w");
            } else if (chess.isDraw()) {
                setWinner("d");
            }
        }

    }, [FEN])

    function handlePlayPauseClick(){
        setPlayPause(!PlayPause);
    }

    function resetGame() {
        const newChess = new Chess();
        setChess(newChess);
        setFEN(newChess.fen());
        setInProgress(true);
        setWinner(null);
        setIsCheck(false);
        if (PlayPause) {
            setPlayPause(false);
        }
    }

    function gameOverMessage(){
        if (winner === "b"){
            return "Checkmate! Black wins!"
        } else if (winner === "w"){
            return "Checkmate! White wins!"
        } else if (winner === "d"){
            return "It's a draw!"
        }
        return "";
    }

  return(
    <div>
        <h1>AI vs. AI</h1>
        <p>Watch an intelligent chess AI face off against itself!</p>
        {isCheck && inProgress && <div className="check-alert">CHECK!</div>}
        <div className="board">
            <Chessboard 
                position={FEN}
                customDarkSquareStyle={{ backgroundColor: "#8BAFC7" }}
                customLightSquareStyle={{ backgroundColor: "#FFFFFF" }}
            />
        </div>
        <div className="game-controls">
            <button onClick={handlePlayPauseClick}>{PlayPause ? "Pause" : "Play"}</button>
            <button onClick={resetGame}>New Game</button>
        </div>
        {!inProgress ? 
            <div className="game-over-message">
                <h2>{gameOverMessage()}</h2>
            </div> 
        : null}
    </div>
  )
}

export default ComputerVComputer;