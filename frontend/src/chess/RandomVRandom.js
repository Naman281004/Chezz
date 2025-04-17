import {Chess} from "chess.js";
import { Chessboard } from "react-chessboard";
import { useEffect, useState } from "react";

function RandomVRandom() {
    const [chess, setChess] = useState(new Chess());
    const [FEN, setFEN] = useState(chess.fen());
    const [currentTurn, setCurrentTurn] = useState('w'); // 'w' for white's turn
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [history, setHistory] = useState([]);
    const [currentPosition, setCurrentPosition] = useState(0);

    function onDrop(pieceFrom, pieceTo, piece) {
        // Allow user to make a move only if it's their turn
        if (chess.turn() === currentTurn) {
            let move = {
                from: pieceFrom,
                to: pieceTo
            };

            // Check if promotion is possible
            if (piece === "wP" && pieceTo.includes("8")) {
                move = { ...move, promotion: "q" };
            } else if (piece === "bP" && pieceTo.includes("1")) {
                move = { ...move, promotion: "q" };
            }

            // Make the move
            const result = chess.move(move);
            if (result) {
                const newFEN = chess.fen();
                setFEN(newFEN);
                setCurrentTurn(currentTurn === 'w' ? 'b' : 'w'); // Switch turns
                
                // Update history
                const newHistory = [...history.slice(0, currentPosition + 1), newFEN];
                setHistory(newHistory);
                setCurrentPosition(newPosition => newPosition + 1);
                
                // Check for game over
                if (chess.isGameOver()) {
                    setGameOver(true);
                    if (chess.isCheckmate()) {
                        setWinner(chess.turn() === 'w' ? 'b' : 'w');
                    } else if (chess.isDraw()) {
                        setWinner('d');
                    }
                }
            }
        }
    }

    function gameOverMessage() {
        if (winner === 'w') {
            return "Game over! White wins!";
        } else if (winner === 'b') {
            return "Game over! Black wins!";
        } else if (winner === 'd') {
            return "It's a draw!";
        }
        return "";
    }

    function resetGame() {
        const newChess = new Chess();
        setChess(newChess);
        setFEN(newChess.fen());
        setCurrentTurn('w');
        setGameOver(false);
        setWinner(null);
        setHistory([newChess.fen()]);
        setCurrentPosition(0);
    }

    // Initialize history on first render
    useEffect(() => {
        setHistory([chess.fen()]);
        setCurrentPosition(0);
    }, []);

    function handleUndo() {
        if (currentPosition > 0) {
            const newPosition = currentPosition - 1;
            const prevFEN = history[newPosition];
            
            const newChess = new Chess(prevFEN);
            setChess(newChess);
            setFEN(prevFEN);
            setCurrentPosition(newPosition);
            setCurrentTurn(newChess.turn());
            
            // Reset game over status if undoing from end of game
            if (gameOver) {
                setGameOver(false);
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
            setCurrentTurn(newChess.turn());
            
            // Check if redoing to end of game
            if (newPosition === history.length - 1 && newChess.isGameOver()) {
                setGameOver(true);
                if (newChess.isCheckmate()) {
                    setWinner(newChess.turn() === 'w' ? 'b' : 'w');
                } else if (newChess.isDraw()) {
                    setWinner('d');
                }
            }
        }
    }

    return (
        <div>
            <h1>Human vs. Human</h1>
            <p>Play chess with a friend on the same device. Take turns making moves.</p>
            <h3>Current turn: {currentTurn === 'w' ? 'White' : 'Black'}</h3>
            <div className="board">
                <Chessboard 
                    position={FEN}
                    onPieceDrop={onDrop}
                    customDarkSquareStyle={{ backgroundColor: "#769656" }}
                    customLightSquareStyle={{ backgroundColor: "#eeeed2" }}
                />
            </div>
            <div className="game-controls">
                <button onClick={handleUndo} disabled={currentPosition <= 0}>Undo</button>
                <button onClick={handleRedo} disabled={currentPosition >= history.length - 1}>Redo</button>
                {gameOver && <button onClick={resetGame}>New Game</button>}
            </div>
            {gameOver && (
                <div>
                    <p>{gameOverMessage()}</p>
                </div>
            )}
        </div>
    );
}

export default RandomVRandom;

