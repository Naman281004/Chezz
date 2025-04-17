import { MINIMAX, MINIMAX_ALPHA_BETA } from "./Minimax";
import {Chess} from "chess.js";
import { Chessboard } from "react-chessboard";
import { useEffect, useState } from "react";

function UserVComputer({userColor, difficulty}){
    const [chess, setChess] = useState(new Chess())
    const [FEN, setFEN] = useState(chess.fen())
    const [inProgress, setInProgress] = useState(true);
    const [winner, setWinner] = useState(null)
    const [history, setHistory] = useState([]);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [aiThinking, setAiThinking] = useState(false);

    // user color as full string ("white/black")
    let userColorFull;

    if (userColor == "w"){
        userColorFull = "white";
    } else if (userColor == "b"){
        userColorFull = "black";
    }

    // set computer depth based on difficulty
    let cpudepth;
    switch(difficulty){
        case "Easy":
            cpudepth = 2;
            break;
        case "Medium":
            cpudepth = 3;
            break;
        case "Hard":
            cpudepth = 4;
            break;
    }

    // Initialize history on first render
    useEffect(() => {
        setHistory([chess.fen()]);
        setCurrentPosition(0);
    }, []);

    function makeMinimaxMove(game, depth, white){
        if (!game.isGameOver()) {
            setAiThinking(true);
            const minimaxMove = MINIMAX(game, depth, white)[1];
            game.move(minimaxMove)
            const newFEN = game.fen();
            setFEN(newFEN);
            
            // Update history
            const newHistory = [...history.slice(0, currentPosition + 1), newFEN];
            setHistory(newHistory);
            setCurrentPosition(currentPosition + 1);
            
            setAiThinking(false);
        }
    }

    function makeMinimaxABMove(game, depth, white){
        if (!game.isGameOver()) {
            setAiThinking(true);
            const minimaxABMove = MINIMAX_ALPHA_BETA(game, depth, white, -Infinity, Infinity)[1];
            game.move(minimaxABMove)
            const newFEN = game.fen();
            setFEN(newFEN);
            
            // Update history
            const newHistory = [...history.slice(0, currentPosition + 1), newFEN];
            setHistory(newHistory);
            setCurrentPosition(currentPosition + 1);
            
            setAiThinking(false);
        }
    }

    function randomMove(){
        if (!chess.isGameOver()) {
            const moves = chess.moves()
            const move = moves[Math.floor(Math.random() * moves.length)]
            chess.move(move)
            const newFEN = chess.fen();
            setFEN(newFEN);
            
            // Update history
            const newHistory = [...history.slice(0, currentPosition + 1), newFEN];
            setHistory(newHistory);
            setCurrentPosition(currentPosition + 1);
        }
    }

    const timedMove = setTimeout(() => {
        if (!aiThinking && chess.turn()!=userColor && inProgress && currentPosition === history.length - 1){
            makeMinimaxABMove(chess, cpudepth, chess.turn()=="w")
        } 
      }, 1000);

    useEffect(() => {
        if (!chess.isGameOver()){
            return () => timedMove;
        } else if (chess.isGameOver()){
            setInProgress(false)
        }
    }, [FEN])

    function onDrop(pieceFrom, pieceTo, piece){
        // if user turn
        if (chess.turn() == userColor && currentPosition === history.length - 1){
            let move = {
                from: pieceFrom,
                to: pieceTo
            }

            // check if promotion possible
            if (piece == "wP" && pieceTo.includes("8")){
                move = {...move, promotion: "q"}
            } else if (piece == "bP" && pieceTo.includes("1")){
                move = {...move, promotion: "q"}
            }

            const result = chess.move(move);
            if (result) {
                const newFEN = chess.fen();
                setFEN(newFEN);
                
                // Update history
                const newHistory = [...history.slice(0, currentPosition + 1), newFEN];
                setHistory(newHistory);
                setCurrentPosition(currentPosition + 1);

                if (chess.isCheckmate()){
                    setInProgress(false)
                    if (chess.turn()=="w"){
                        setWinner("b") // black
                    } else {
                        setWinner("w") // white
                    }
                } else if (chess.isGameOver()){
                    setInProgress(false)
                    setWinner("d")
                }
            }
        } else {
            console.log("not your turn!")
            return false;
        }
    }

    function gameOverMessage(){
        if (winner == "b"){
            return "Game over! Black wins!"
        } else if (winner == "w"){
            return "Game over! White wins!"
        } else if (winner == "d"){
            return "It's a draw!"
        }
    }

    function resetGame() {
        const newChess = new Chess();
        setChess(newChess);
        setFEN(newChess.fen());
        setInProgress(true);
        setWinner(null);
        setHistory([newChess.fen()]);
        setCurrentPosition(0);
    }

    function handleUndo() {
        if (currentPosition > 0) {
            // Allow undoing two moves at once (AI + user move) if the AI just moved
            const stepsBack = (chess.turn() !== userColor && currentPosition > 1) ? 2 : 1;
            const newPosition = currentPosition - stepsBack;
            const prevFEN = history[newPosition];
            
            const newChess = new Chess(prevFEN);
            setChess(newChess);
            setFEN(prevFEN);
            setCurrentPosition(newPosition);
            
            // Reset game over status if undoing from end of game
            if (!inProgress) {
                setInProgress(true);
                setWinner(null);
            }
        }
    }

    function handleRedo() {
        if (currentPosition < history.length - 1) {
            const newPosition = currentPosition + 1;
            const nextFEN = history[newPosition];
            
            const newChess = new Chess(nextFEN);
            setChess(newChess);
            setFEN(nextFEN);
            setCurrentPosition(newPosition);
            
            // Check if redoing to end of game
            if (newPosition === history.length - 1 && newChess.isGameOver()) {
                setInProgress(false);
                if (newChess.isCheckmate()) {
                    setWinner(newChess.turn() === 'w' ? 'b' : 'w');
                } else if (newChess.isDraw()) {
                    setWinner('d');
                }
            }
        }
    }

  return(
    <div>
        <h1>You vs. Computer</h1>
        <h3>You are playing as {userColorFull}</h3>
        <h3>Computer difficulty: {difficulty}</h3>
        <div className="board">
            <Chessboard 
                position={FEN}
                onPieceDrop={onDrop}
                boardOrientation={userColorFull}
                customDarkSquareStyle={{ backgroundColor: "#769656" }}
                customLightSquareStyle={{ backgroundColor: "#eeeed2" }}
            />
        </div>
        <div className="game-controls">
            <button onClick={handleUndo} disabled={currentPosition <= 0 || aiThinking}>Undo</button>
            <button onClick={handleRedo} disabled={currentPosition >= history.length - 1 || aiThinking}>Redo</button>
            <button onClick={resetGame} disabled={aiThinking}>New Game</button>
        </div>
        <h2>Playing as Guest</h2>
        {!inProgress ? 
            <div>
                <p>{gameOverMessage()}</p>
            </div>
        : null}
        <p>
            Can you beat the computer?
        </p>
    </div>
  )
}

export default UserVComputer;