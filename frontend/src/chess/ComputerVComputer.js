import { MINIMAX_ALPHA_BETA} from "./Minimax";
import {Chess} from "chess.js";
import { Chessboard } from "react-chessboard";
import { useEffect, useState } from "react";

function ComputerVComputer(){
    const [chess, setChess] = useState(new Chess())
    const [FEN, setFEN] = useState(chess.fen())
    const [PlayPause, setPlayPause] = useState(false);
    const [inProgress, setInProgress] = useState(true);

    function makeMinimaxABMove(game, depth, white){
        if (!game.isGameOver()) {
            const minimaxABMove = MINIMAX_ALPHA_BETA(game, depth, white, -Infinity, Infinity)[1];
            game.move(minimaxABMove)
            setFEN(game.fen())
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
        }

    }, [FEN])

    function handlePlayPauseClick(){
        setPlayPause(!PlayPause);
    }

    let winner;
    function gameOverMessage(){
        if (winner == "b"){
            return "Game over! Black wins!"
        } else if (winner == "w"){
            return "Game over! White wins!"
        } else if (winner == "d"){
            return "It's a draw!"
        }
    }

  return(
    <div>
        <h1>AI vs. AI</h1>
        <p>Watch an intelligent chess AI face off against itself!</p>
        <div className="board">
            <Chessboard position={FEN}/>
        </div>
        <button onClick={handlePlayPauseClick}>{PlayPause ? "Pause" : "Play"}</button>
        {!inProgress ? <p>{gameOverMessage()}</p> : null}
    </div>
  )
}

export default ComputerVComputer;