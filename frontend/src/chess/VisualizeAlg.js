import { EVALUATE_POSITION, GENERATE_MOVES, UPDATE_POSITION, MOVE_COMPARE } from "./Minimax";
import {Chess} from "chess.js";
import { Chessboard } from "react-chessboard";
import { useEffect, useState } from "react";
import TreeVisualizer from "./TreeVisualizer";

function VisualizeAlg(){
    const [chess, setChess] = useState(new Chess())
    const [FEN, setFEN] = useState(chess.fen())
    const [inProgress, setInProgress] = useState(true);
    const [winner, setWinner] = useState(null)
    
    const [initialPosition, setInitialPosition] = useState([]);
    const [position_tree, setPositionTree] = useState({});

    const mc = MOVE_COMPARE;

    // ALG

    function MINIMAX_ALPHA_BETA(game, depth, white_turn, alpha, beta){
        if (depth == 0 || game.isGameOver()){   
            return [EVALUATE_POSITION(game), null] 
        }
    
        else if (white_turn){
            let bestVal = -Infinity;
            let bestMove = null;
            let moves = GENERATE_MOVES(game);

            for (let m in moves){
                let newPos = UPDATE_POSITION(game, moves[m]);
                let value = MINIMAX_ALPHA_BETA(newPos, depth-1, false, alpha, beta)[0];

                if (value > bestVal){
                    bestVal = value;
                    bestMove = moves[m]
                }
                alpha = Math.max(alpha, bestVal)

                if (!position_tree[game.fen()]){
                    position_tree[game.fen()] = [];
                }
                position_tree[game.fen()].push([newPos.fen(), moves[m].san, value, alpha, beta])
                //viz
    
                if (beta <= alpha){
                    position_tree[game.fen()].push(["beta <= alpha","ALPHA >= BETA","NA",alpha,beta])
                    break;
                }
            }

            if (bestMove == null){
                bestMove = moves[Math.floor(Math.random() * moves.length)]
            }

            if (depth == cpudepth){
                setInitialPosition([game.fen(), bestMove.san, bestVal, alpha, beta]);
            }

            

            return [bestVal, bestMove];
        }
    
        else if (white_turn == false){
            let bestVal = Infinity;
            let bestMove = null;
            let moves = GENERATE_MOVES(game);

            for (let m in moves){
                let newPos = UPDATE_POSITION(game, moves[m]);
                let value = MINIMAX_ALPHA_BETA(newPos, depth-1, true, alpha, beta)[0];
                
                //viz

                if (value < bestVal){
                    bestVal = value;
                    bestMove = moves[m]
                }
                beta = Math.min(beta, bestVal)

                // viz
                if (!position_tree[game.fen()]){
                    position_tree[game.fen()] = [];
                }
                position_tree[game.fen()].push([newPos.fen(), moves[m].san, value, alpha, beta])
    
                if (beta <= alpha){
                    position_tree[game.fen()].push(["NA","ALPHA >= BETA","NA",alpha,beta])
                    break;
                }
            }
            

            if (bestMove == null){
                bestMove = moves[Math.floor(Math.random() * moves.length)]
            }

            if (depth == cpudepth){
                setInitialPosition([game.fen(), bestMove.san, bestVal, alpha, beta]);
            }

            return [bestVal, bestMove];
        }
    
    }

    // ALG

    const userColor = "w";

    // set computer depth based on difficulty
    let cpudepth = 3; // setting depth 3

    function makeMinimaxABMove(game, depth, white){
        if (!game.isGameOver()) {
            const minimaxABMove = MINIMAX_ALPHA_BETA(game, depth, white, -Infinity, Infinity)[1];
            game.move(minimaxABMove)
            setFEN(game.fen())
        }
    }

    const timedMove = setTimeout(() => {
        if (chess.turn()!=userColor){
            makeMinimaxABMove(chess, cpudepth, chess.turn()=="w")
        } 
      }, 100);

    useEffect(() => {
        if (!chess.isGameOver()){
            return () => timedMove;
        } else if (chess.isGameOver()){
            setInProgress(false)
        }
    }, [FEN])

    function onDrop(pieceFrom, pieceTo, piece){
        // if user turn
        if (chess.turn() == userColor){
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

            chess.move(move);
            setFEN(chess.fen())
            setPositionTree({})

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

        } else {
            console.log("not your turn!")
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

  return(
    <div>
        <h1>Visualize AI Algorithm</h1>
        <h2>Minimax Algorithm with Alpha-Beta Pruning</h2>
        <p>Make a move as white to see how the computer decides what move to play</p>
        <div className="viz-wrapper">
            <div className="viz-board">
                <Chessboard 
                    position={FEN} 
                    onPieceDrop={onDrop}
                    customDarkSquareStyle={{ backgroundColor: "#769656" }}
                    customLightSquareStyle={{ backgroundColor: "#eeeed2" }}
                />
            </div>
            <div className="tree">
                <h2><u>Algorithm Visualizer</u></h2>
                <TreeVisualizer positionTree={position_tree} initialPosition={initialPosition} head={true}/>
            </div>
        </div>
        {inProgress ? null 
        : 
            <div>
                <p>{gameOverMessage()}</p>
            </div>
        }
    </div>
  )
}

export default VisualizeAlg;