import {Chess} from "chess.js";
import { Chessboard } from "react-chessboard";
import { useEffect, useState } from "react";

function HumanVHuman() {
    const [chess, setChess] = useState(new Chess());
    const [FEN, setFEN] = useState(chess.fen());
    const [currentTurn, setCurrentTurn] = useState('w'); // 'w' for white's turn
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [history, setHistory] = useState([]);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [isCheck, setIsCheck] = useState(false);
    const [showPromotionModal, setShowPromotionModal] = useState(false);
    const [pendingMove, setPendingMove] = useState(null);
    const [moveOptions, setMoveOptions] = useState({});
    const [moveFrom, setMoveFrom] = useState("");

    // Initialize history on first render
    useEffect(() => {
        setHistory([chess.fen()]);
        setCurrentPosition(0);
    }, []);

    // Update check status whenever the position changes
    useEffect(() => {
        if (chess && !chess.isGameOver()) {
            setIsCheck(chess.inCheck());
        }
    }, [FEN]);

    function onSquareClick(square) {
        // from square is not set
        if (!moveFrom) {
            const moves = chess.moves({
                square: square,
                verbose: true,
            });
    
            if (moves.length === 0) {
                return;
            }
    
            const newMoveOptions = {};
            moves.forEach((move) => {
                newMoveOptions[move.to] = {
                    background: "rgba(0, 255, 0, 0.4)",
                };
            });
            newMoveOptions[square] = {
                background: "rgba(255, 255, 0, 0.4)",
            };
    
            setMoveOptions(newMoveOptions);
            setMoveFrom(square);
            return;
        }

        // from square is set, try to move
        const piece = chess.get(moveFrom).type;
        const move = {
            from: moveFrom,
            to: square
        }

        // check if promotion possible
        if ((piece === "wP" && square.includes("8")) || (piece === "bP" && square.includes("1"))) {
            setPendingMove(move);
            setShowPromotionModal(true);
            setMoveFrom("");
            setMoveOptions({});
            return;
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
            
            // Check for check
            setIsCheck(chess.inCheck());
            
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
        setMoveFrom("");
        setMoveOptions({});
    }

    function onPieceDragBegin(piece, sourceSquare) {
        const moves = chess.moves({
            square: sourceSquare,
            verbose: true,
        });
    
        if (moves.length === 0) {
            setMoveOptions({});
            return;
        }
    
        const newMoveOptions = {};
        moves.forEach((move) => {
            newMoveOptions[move.to] = {
                background: "rgba(0, 255, 0, 0.4)",
            };
        });
        newMoveOptions[sourceSquare] = {
            background: "rgba(255, 255, 0, 0.4)",
        };
    
        setMoveOptions(newMoveOptions);
    }

    function onDrop(pieceFrom, pieceTo, piece) {
        // Allow user to make a move only if it's their turn
        if (chess.turn() === currentTurn) {
            let move = {
                from: pieceFrom,
                to: pieceTo
            };

            // Check if promotion is possible
            if ((piece === "wP" && pieceTo.includes("8")) || (piece === "bP" && pieceTo.includes("1"))) {
                setPendingMove({from: pieceFrom, to: pieceTo});
                setShowPromotionModal(true);
                return true; // Return true to allow the piece to move visually
            }

            // Make the move
            const result = chess.move(move);
            if (result) {
                const newFEN = chess.fen();
                setFEN(newFEN);
                setCurrentTurn(currentTurn === 'w' ? 'b' : 'w'); // Switch turns
                setMoveOptions({});
                
                // Update history
                const newHistory = [...history.slice(0, currentPosition + 1), newFEN];
                setHistory(newHistory);
                setCurrentPosition(newPosition => newPosition + 1);
                
                // Check for check
                setIsCheck(chess.inCheck());
                
                // Check for game over
                if (chess.isGameOver()) {
                    setGameOver(true);
                    if (chess.isCheckmate()) {
                        setWinner(chess.turn() === 'w' ? 'b' : 'w');
                    } else if (chess.isDraw()) {
                        setWinner('d');
                    }
                }
                return true;
            }
        }
        setMoveFrom("");
        setMoveOptions({});
        return false;
    }

    function handlePromotion(pieceType) {
        if (pendingMove) {
            const move = {...pendingMove, promotion: pieceType};
            const result = chess.move(move);
            setMoveOptions({});
            
            if (result) {
                const newFEN = chess.fen();
                setFEN(newFEN);
                setCurrentTurn(currentTurn === 'w' ? 'b' : 'w'); // Switch turns
                
                // Update history
                const newHistory = [...history.slice(0, currentPosition + 1), newFEN];
                setHistory(newHistory);
                setCurrentPosition(currentPosition + 1);
                
                // Check for check
                setIsCheck(chess.inCheck());
                
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
            
            // Reset promotion state
            setShowPromotionModal(false);
            setPendingMove(null);
        }
    }

    function gameOverMessage() {
        if (winner === 'w') {
            return "Checkmate! White wins!";
        } else if (winner === 'b') {
            return "Checkmate! Black wins!";
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
        setIsCheck(false);
    }

    function handleUndo() {
        if (currentPosition > 0) {
            const newPosition = currentPosition - 1;
            const prevFEN = history[newPosition];
            
            const newChess = new Chess(prevFEN);
            setChess(newChess);
            setFEN(prevFEN);
            setCurrentPosition(newPosition);
            setCurrentTurn(newChess.turn());
            setIsCheck(newChess.inCheck());
            
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
            setIsCheck(newChess.inCheck());
            
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
            {isCheck && !gameOver && <div className="check-alert">CHECK!</div>}
            <div className="board">
                <Chessboard 
                    position={FEN}
                    onPieceDrop={onDrop}
                    onSquareClick={onSquareClick}
                    onPieceDragBegin={onPieceDragBegin}
                    customSquareStyles={moveOptions}
                    customDarkSquareStyle={{ backgroundColor: "#8BAFC7" }}
                    customLightSquareStyle={{ backgroundColor: "#FFFFFF" }}
                />
            </div>
            {showPromotionModal && (
                <div className="promotion-modal">
                    <h3>Choose promotion piece:</h3>
                    <div className="promotion-options">
                        <button onClick={() => handlePromotion('q')}>Queen</button>
                        <button onClick={() => handlePromotion('r')}>Rook</button>
                        <button onClick={() => handlePromotion('b')}>Bishop</button>
                        <button onClick={() => handlePromotion('n')}>Knight</button>
                    </div>
                </div>
            )}
            <div className="game-controls">
                <button onClick={handleUndo} disabled={currentPosition <= 0}>Undo</button>
                <button onClick={handleRedo} disabled={currentPosition >= history.length - 1}>Redo</button>
                <button onClick={resetGame}>New Game</button>
            </div>
            {gameOver && (
                <div className="game-over-message">
                    <h2>{gameOverMessage()}</h2>
                </div>
            )}
        </div>
    );
}

export default HumanVHuman;

