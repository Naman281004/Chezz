import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useEffect, useState, useRef } from "react";

function UserVComputer({userColor, difficulty}){
    const [FEN, setFEN] = useState(new Chess().fen());
    const [inProgress, setInProgress] = useState(true);
    const [winner, setWinner] = useState(null)
    const [history, setHistory] = useState([new Chess().fen()]);
    const [currentPosition, setCurrentPosition] = useState(0);
    const [aiThinking, setAiThinking] = useState(false);
    const [showPromotionModal, setShowPromotionModal] = useState(false);
    const [pendingMove, setPendingMove] = useState(null);
    const [isCheck, setIsCheck] = useState(false);
    const [moveOptions, setMoveOptions] = useState({});
    const [moveFrom, setMoveFrom] = useState("");
    const workerRef = useRef(null);

    let userColorFull;

    if (userColor === "w"){
        userColorFull = "white";
    } else if (userColor === "b"){
        userColorFull = "black";
    }

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

    // Initialize the worker
    useEffect(() => {
        workerRef.current = new Worker(new URL('./minimax.worker.js', import.meta.url));

        workerRef.current.onmessage = (e) => {
            const { bestMove } = e.data;
            if (bestMove) {
                const game = new Chess(FEN);
                game.move(bestMove);
                const newFEN = game.fen();
                
                const newHistory = [...history.slice(0, currentPosition + 1), newFEN];
                setHistory(newHistory);
                setCurrentPosition(currentPosition + 1);
                setFEN(newFEN);
            }
            setAiThinking(false);
        };

        return () => {
            workerRef.current.terminate();
        };
    }, [FEN, history, currentPosition]);

    function makeAIMove() {
        if (new Chess(FEN).isGameOver()) return;
        
        setAiThinking(true);
        workerRef.current.postMessage({
            fen: FEN,
            depth: cpudepth,
            white: new Chess(FEN).turn() === "w",
            visualize: false
        });
    }

    // AI moves on a timer
    useEffect(() => {
        const game = new Chess(FEN);
        if (!aiThinking && game.turn() !== userColor && inProgress && currentPosition === history.length - 1){
            setTimeout(makeAIMove, 1000);
        }
    }, [FEN, aiThinking, userColor, inProgress, currentPosition, history.length]);


    // Update check status when FEN changes
    useEffect(() => {
        const game = new Chess(FEN);
        setIsCheck(game.inCheck());
    }, [FEN]);


    function onSquareClick(square) {
        const chess = new Chess(FEN);

        // from square is not set
        if (!moveFrom) {
            const pieceDetails = chess.get(square);
            if (!pieceDetails || pieceDetails.color !== userColor) {
                return;
            }

            const moves = chess.moves({ square: square, verbose: true });
            if (moves.length === 0) return;
    
            const newMoveOptions = {};
            moves.forEach((move) => {
                newMoveOptions[move.to] = { background: "rgba(0, 255, 0, 0.4)" };
            });
            newMoveOptions[square] = { background: "rgba(255, 255, 0, 0.4)" };
            setMoveOptions(newMoveOptions);
            setMoveFrom(square);
            return;
        }

        // from square is set, try to move
        if (chess.turn() !== userColor) {
            setMoveFrom("");
            setMoveOptions({});
            return;
        }

        const move = { from: moveFrom, to: square };
        const piece = chess.get(moveFrom).type;

        if ((piece === "p" && (square.includes("8") || square.includes("1")))) {
            setPendingMove(move);
            setShowPromotionModal(true);
            return;
        }

        const result = chess.move(move);
        if (result) {
            const newFEN = chess.fen();
            const newHistory = [...history.slice(0, currentPosition + 1), newFEN];
            setHistory(newHistory);
            setCurrentPosition(currentPosition + 1);
            setFEN(newFEN);
            if (chess.isGameOver()) {
                handleGameOver(chess);
            }
        }

        setMoveFrom("");
        setMoveOptions({});
    }

    function onPieceDragBegin(piece, sourceSquare) {
        const chess = new Chess(FEN);
        const pieceDetails = chess.get(sourceSquare);
        if (!pieceDetails || pieceDetails.color !== userColor) {
            return;
        }
    
        const moves = chess.moves({ square: sourceSquare, verbose: true });
        if (moves.length === 0) return;
    
        const newMoveOptions = {};
        moves.forEach((move) => {
            newMoveOptions[move.to] = { background: "rgba(0, 255, 0, 0.4)" };
        });
        newMoveOptions[sourceSquare] = { background: "rgba(255, 255, 0, 0.4)" };
        setMoveOptions(newMoveOptions);
    }

    function onDrop(sourceSquare, targetSquare, piece){
        const chess = new Chess(FEN);
        if (chess.turn() !== userColor || sourceSquare === targetSquare) {
            setMoveOptions({});
            return false;
        }

        const move = { from: sourceSquare, to: targetSquare };
        const pieceType = piece.toLowerCase().charAt(1);

        if (pieceType === "p" && (targetSquare.includes("8") || targetSquare.includes("1"))) {
            setPendingMove(move);
            setShowPromotionModal(true);
            return true;
        }

        const result = chess.move(move);
        if (result) {
            const newFEN = chess.fen();
            const newHistory = [...history.slice(0, currentPosition + 1), newFEN];
            setHistory(newHistory);
            setCurrentPosition(currentPosition + 1);
            setFEN(newFEN);
            if (chess.isGameOver()) {
                handleGameOver(chess);
            }
        } else {
            setMoveOptions({});
            return false;
        }

        setMoveOptions({});
        return true;
    }

    function handlePromotion(pieceType) {
        const chess = new Chess(FEN);
        if (pendingMove) {
            const move = {...pendingMove, promotion: pieceType};
            const result = chess.move(move);
            
            if (result) {
                const newFEN = chess.fen();
                const newHistory = [...history.slice(0, currentPosition + 1), newFEN];
                setHistory(newHistory);
                setCurrentPosition(currentPosition + 1);
                setFEN(newFEN);
                if (chess.isGameOver()) {
                    handleGameOver(chess);
                }
            }
        }
        setShowPromotionModal(false);
        setPendingMove(null);
        setMoveOptions({});
    }

    function handleGameOver(game) {
        setInProgress(false);
        if (game.isCheckmate()) {
            setWinner(game.turn() === "w" ? "b" : "w");
        } else {
            setWinner("d");
        }
    }

    function gameOverMessage(){
        if (winner === "b"){
            return "Game over! Black wins!"
        } else if (winner === "w"){
            return "Game over! White wins!"
        } else if (winner === "d"){
            return "It's a draw!"
        }
    }

    function resetGame() {
        const newChess = new Chess();
        setFEN(newChess.fen());
        setInProgress(true);
        setWinner(null);
        setHistory([newChess.fen()]);
        setCurrentPosition(0);
        setMoveOptions({});
        setMoveFrom("");
    }

    function handleUndo() {
        if (currentPosition > 0) {
            const stepsBack = (new Chess(FEN).turn() !== userColor && currentPosition > 1) ? 2 : 1;
            const newPosition = currentPosition - stepsBack;
            const prevFEN = history[newPosition];
            
            setFEN(prevFEN);
            setCurrentPosition(newPosition);
            
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
            
            setFEN(nextFEN);
            setCurrentPosition(newPosition);
            
            const game = new Chess(nextFEN);
            if (game.isGameOver()) {
                handleGameOver(game);
            }
        }
    }

    return(
        <div>
            <h1>Play vs. AI</h1>
            <h3>Playing as {userColorFull}</h3>
            <h3 className={aiThinking ? "thinking-indicator" : "thinking-indicator hidden"}>AI is thinking...</h3>
            {isCheck && !inProgress && <div className="check-alert">CHECK!</div>}
            <div className="board">
                <Chessboard 
                    position={FEN}
                    onPieceDrop={onDrop}
                    customDarkSquareStyle={{ backgroundColor: "#8BAFC7" }}
                    customLightSquareStyle={{ backgroundColor: "#FFFFFF" }}
                    customSquareStyles={moveOptions}
                    onSquareClick={onSquareClick}
                    onPieceDragBegin={onPieceDragBegin}
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
            {!inProgress && 
                <div>
                    <p>{gameOverMessage()}</p>
                    <button onClick={resetGame}>Play Again</button>
                </div>
            }
            <div>
                <button onClick={handleUndo} disabled={currentPosition === 0}>Undo</button>
                <button onClick={handleRedo} disabled={currentPosition >= history.length - 1}>Redo</button>
            </div>
            <p>Difficulty: {difficulty}</p>
        </div>
    )
}

export default UserVComputer;