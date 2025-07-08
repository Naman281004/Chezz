/* eslint-disable no-restricted-globals */
import { Chess } from "chess.js";

// --- PASTE OF MINIMAX.JS ---

const pieceValue = {
    "k": 20000,
    "p": 100,
    "n": 300,
    "b": 320,
    "r": 500,
    "q": 900
}

const KNIGHT_SIGHT = {
    a8:2, b8:3, c8:4, d8:4, e8:4, f8:4, g8:3, h8:2,
    a7:3, b7:4, c7:6, d7:6, e7:6, f7:6, g7:4, h7:3,
    a6:4, b6:6, c6:8, d6:8, e6:8, f6:8, g6:6, h6:4,
    a5:4, b5:6, c5:8, d5:8, e5:8, f5:8, g5:6, h5:4,
    a4:4, b4:6, c4:8, d4:8, e4:8, f4:8, g4:6, h4:4,
    a3:4, b3:6, c3:8, d3:8, e3:8, f3:8, g3:6, h3:4,
    a2:3, b2:4, c2:6, d2:6, e2:6, f2:6, g2:4, h2:3,
    a1:2, b1:3, c1:4, d1:4, e1:4, f1:4, g1:3, h1:2,
}

const BISHOP_SIGHT = {
    a8:7, b8:7, c8:7, d8:7, e8:7, f8:7, g8:7, h8:7,
    a7:7, b7:9, c7:9, d7:9, e7:9, f7:9, g7:9, h7:7,
    a6:7, b6:9, c6:11, d6:11, e6:11, f6:11, g6:9, h6:7,
    a5:7, b5:9, c5:11, d5:13, e5:13, f5:11, g5:9, h5:7,
    a4:7, b4:9, c4:11, d4:13, e4:13, f4:11, g4:9, h4:7,
    a3:7, b3:9, c3:11, d3:11, e3:11, f3:11, g3:9, h3:7,
    a2:7, b2:9, c2:9, d2:9, e2:9, f2:9, g2:9, h2:7,
    a1:7, b1:7, c1:7, d1:7, e1:7, f1:7, g1:7, h1:7,
}

function MINIMAX_ALPHA_BETA(game, depth, white_turn, alpha, beta, position_tree = null, initial_cpudepth = 3){
    if (depth === 0 || game.isGameOver()){   
        return [EVALUATE_POSITION(game), null]
    }

    let moves = GENERATE_MOVES(game);
    
    if (white_turn){
        let bestVal = -Infinity;
        let bestMove = null;

        for (let move of moves){
            const current_fen = position_tree ? game.fen() : null;
            game.move(move);
            let [value, _] = MINIMAX_ALPHA_BETA(game, depth-1, false, alpha, beta, position_tree, initial_cpudepth);
            game.undo();
            
            if (value > bestVal){
                bestVal = value;
                bestMove = move
            }
            alpha = Math.max(alpha, bestVal)

            if (position_tree !== null) {
                if (!position_tree[current_fen]){
                    position_tree[current_fen] = [];
                }
                position_tree[current_fen].push([game.fen(), move.san, value, alpha, beta])
            }

            if (beta <= alpha){
                if (position_tree !== null) {
                    position_tree[current_fen].push(["beta <= alpha","ALPHA >= BETA","NA",alpha,beta])
                }
                break;
            }
        }
        if (bestMove == null){
            bestMove = moves[Math.floor(Math.random() * moves.length)]
        }
        return [bestVal, bestMove];
    } else { // black's turn
        let bestVal = Infinity;
        let bestMove = null;
        
        for (let move of moves){
            const current_fen = position_tree ? game.fen() : null;
            game.move(move);
            let [value, _] = MINIMAX_ALPHA_BETA(game, depth-1, true, alpha, beta, position_tree, initial_cpudepth);
            game.undo();

            if (value < bestVal){
                bestVal = value;
                bestMove = move
            }
            beta = Math.min(beta, bestVal)

            if (position_tree !== null) {
                if (!position_tree[current_fen]){
                    position_tree[current_fen] = [];
                }
                position_tree[current_fen].push([game.fen(), move.san, value, alpha, beta])
            }

            if (beta <= alpha){
                if (position_tree !== null) {
                    position_tree[current_fen].push(["NA","ALPHA >= BETA","NA",alpha,beta])
                }
                break;
            }
        }
        if (bestMove == null){
            bestMove = moves[Math.floor(Math.random() * moves.length)]
        }
        return [bestVal, bestMove];
    }
}

function GENERATE_MOVES(game){
    return game.moves({verbose:true});
}

function EVALUATE_POSITION(Game){
    if (Game.isDraw() || Game.isStalemate() || Game.isThreefoldRepetition() || Game.isInsufficientMaterial()){
        return 0;
    } else if (Game.isCheckmate()){
        if (Game.turn() === "b"){
            return Infinity;
        } else {
            return -Infinity;
        }
    }

    const board = Game.board();
    let whiteScore = 0;
    let blackScore = 0;

    for (let rank of board){
        for (let square of rank){
            let piece = square;
            if (piece == null){
                continue;
            }
            const pVal = pieceValue[piece.type]
            let totalVal = pVal;

            switch(piece.type){
                case "n":
                    totalVal += KNIGHT_SIGHT[piece.square];
                    break;
                case "b":
                    totalVal += BISHOP_SIGHT[piece.square];
                    break;
                case "p":
                    totalVal += 2;
                    let progression = (piece.color === "w") ? (piece.square[1] - 2) : (7 - piece.square[1]);
                    totalVal += (progression * 10);
                    break;
                case "r":
                    totalVal += 14;
                    break;
                case "q":
                    totalVal += (14 + BISHOP_SIGHT[piece.square]);
                    break;
                default:
                    break;
            }
        
            if (piece.color ==="w"){
                whiteScore += totalVal;
            } else {
                blackScore += totalVal;
            }
        }
    }
    return whiteScore - blackScore;
}


// --- END OF PASTE ---

self.onmessage = (e) => {
    const { fen, depth, white, visualize } = e.data;
    const game = new Chess(fen);
    
    let position_tree = null;
    if (visualize) {
        position_tree = {};
    }

    const [bestVal, bestMove] = MINIMAX_ALPHA_BETA(game, depth, white, -Infinity, Infinity, position_tree, depth);
    
    self.postMessage({
        bestMove,
        bestVal,
        position_tree
    });
}; 