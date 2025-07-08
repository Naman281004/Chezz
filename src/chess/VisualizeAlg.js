import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useEffect, useState, useRef } from "react";
import TreeVisualizer from "./TreeVisualizer";

function VisualizeAlg() {
    const [FEN, setFEN] = useState(new Chess().fen());
    const [inProgress, setInProgress] = useState(false); // Default to false, AI starts on first move
    const [winner, setWinner] = useState(null);
    const [showPromotionModal, setShowPromotionModal] = useState(false);
    const [pendingMove, setPendingMove] = useState(null);
    const [initialPosition, setInitialPosition] = useState([]);
    const [position_tree, setPositionTree] = useState({});
    const [moveOptions, setMoveOptions] = useState({});
    const [moveFrom, setMoveFrom] = useState("");
    const workerRef = useRef(null);

    const userColor = "w";
    const cpudepth = 3;

    useEffect(() => {
        workerRef.current = new Worker(new URL('./minimax.worker.js', import.meta.url));

        workerRef.current.onmessage = (e) => {
            const { bestMove, bestVal, position_tree } = e.data;
            if (bestMove) {
                const game = new Chess(FEN);
                setInitialPosition([game.fen(), bestMove.san, bestVal, -Infinity, Infinity]);
                game.move(bestMove);
                setFEN(game.fen());
                setPositionTree(position_tree);
            }
            setInProgress(false);
        };

        return () => {
            workerRef.current.terminate();
        };
    }, [FEN]);

    function makeAIMove() {
        const game = new Chess(FEN);
        if (game.isGameOver()) return;

        setInProgress(true);
        workerRef.current.postMessage({
            fen: FEN,
            depth: cpudepth,
            white: game.turn() === "w",
            visualize: true
        });
    }

    useEffect(() => {
        const game = new Chess(FEN);
        if (!inProgress && game.turn() !== userColor && !game.isGameOver()) {
             setTimeout(makeAIMove, 500);
        }
    }, [FEN, inProgress, userColor]);

    function onSquareClick(square) {
        const chess = new Chess(FEN);
        if (!moveFrom) {
            const pieceDetails = chess.get(square);
            if (!pieceDetails || pieceDetails.color !== userColor) return;
            const moves = chess.moves({ square: square, verbose: true });
            if (moves.length === 0) return;
            
            const newMoveOptions = {};
            moves.forEach((move) => { newMoveOptions[move.to] = { background: "rgba(0, 255, 0, 0.4)" }; });
            newMoveOptions[square] = { background: "rgba(255, 255, 0, 0.4)" };
            setMoveOptions(newMoveOptions);
            setMoveFrom(square);
            return;
        }

        if (chess.turn() !== userColor) {
            setMoveFrom("");
            setMoveOptions({});
            return;
        }

        const move = { from: moveFrom, to: square };
        const piece = chess.get(moveFrom).type;

        if (piece === "p" && (square.includes("8") || square.includes("1"))) {
            setPendingMove(move);
            setShowPromotionModal(true);
            return;
        }

        const result = chess.move(move);
        if (result) {
            setFEN(chess.fen());
            setPositionTree({});
            setInitialPosition([]);
            if (chess.isGameOver()) handleGameOver(chess);
        }
        
        setMoveFrom("");
        setMoveOptions({});
    }

    function onPieceDragBegin(piece, sourceSquare) {
        const chess = new Chess(FEN);
        const pieceDetails = chess.get(sourceSquare);
        if (!pieceDetails || pieceDetails.color !== userColor) return;
        
        const moves = chess.moves({ square: sourceSquare, verbose: true });
        if (moves.length === 0) return;
        
        const newMoveOptions = {};
        moves.forEach((move) => { newMoveOptions[move.to] = { background: "rgba(0, 255, 0, 0.4)" }; });
        newMoveOptions[sourceSquare] = { background: "rgba(255, 255, 0, 0.4)" };
        setMoveOptions(newMoveOptions);
    }

    function onDrop(sourceSquare, targetSquare, piece) {
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
            setFEN(chess.fen());
            setPositionTree({});
            setInitialPosition([]);
            if (chess.isGameOver()) handleGameOver(chess);
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
            const move = { ...pendingMove, promotion: pieceType };
            const result = chess.move(move);
            if (result) {
                setFEN(chess.fen());
                setPositionTree({});
                setInitialPosition([]);
                if (chess.isGameOver()) handleGameOver(chess);
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

    function gameOverMessage() {
        if (winner === "b") return "Game over! Black wins!";
        if (winner === "w") return "Game over! White wins!";
        if (winner === "d") return "It's a draw!";
        return "";
    }

    return (
        <div className="visualize-container">
            <h1>Visualize AI Algorithm</h1>
            <h2>Minimax Algorithm with Alpha-Beta Pruning</h2>
            <h3 className={inProgress ? "thinking-indicator" : "thinking-indicator hidden"}>AI is thinking...</h3>
            <p>Make a move as white to see how the computer decides what move to play</p>
            <div className="viz-wrapper">
                <div className="viz-board">
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
                <div className="tree">
                    <h2><u>Algorithm Visualizer</u></h2>
                    {initialPosition.length > 0 ? (
                        <TreeVisualizer positionTree={position_tree} initialPosition={initialPosition} head={true} />
                    ) : <p>The AI's thought process will appear here.</p>}
                </div>
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
            {winner &&
                <div>
                    <p>{gameOverMessage()}</p>
                </div>
            }
        </div>
    )
}

export default VisualizeAlg;