// This file's logic has been moved to minimax.worker.js
// It is kept to prevent breaking imports, but can be removed later.

import { Chess } from "chess.js";

export const pieceValue = {
    "k": 20000,
    "p": 100,
    "n": 300,
    "b": 320,
    "r": 500,
    "q": 900
}

// rook sight is always 14, pawns always 2
export const KNIGHT_SIGHT = {
    a8:2, b8:3, c8:4, d8:4, e8:4, f8:4, g8:3, h8:2,
    a7:3, b7:4, c7:6, d7:6, e7:6, f7:6, g7:4, h7:3,
    a6:4, b6:6, c6:8, d6:8, e6:8, f6:8, g6:6, h6:4,
    a5:4, b5:6, c5:8, d5:8, e5:8, f5:8, g5:6, h5:4,
    a4:4, b4:6, c4:8, d4:8, e4:8, f4:8, g4:6, h4:4,
    a3:4, b3:6, c3:8, d3:8, e3:8, f3:8, g3:6, h3:4,
    a2:3, b2:4, c2:6, d2:6, e2:6, f2:6, g2:4, h2:3,
    a1:2, b1:3, c1:4, d1:4, e1:4, f1:4, g1:3, h1:2,
}

export const BISHOP_SIGHT = {
    a8:7, b8:7, c8:7, d8:7, e8:7, f8:7, g8:7, h8:7,
    a7:7, b7:9, c7:9, d7:9, e7:9, f7:9, g7:9, h7:7,
    a6:7, b6:9, c6:11, d6:11, e6:11, f6:11, g6:9, h6:7,
    a5:7, b5:9, c5:11, d5:13, e5:13, f5:11, g5:9, h5:7,
    a4:7, b4:9, c4:11, d4:13, e4:13, f4:11, g4:9, h4:7,
    a3:7, b3:9, c3:11, d3:11, e3:11, f3:11, g3:9, h3:7,
    a2:7, b2:9, c2:9, d2:9, e2:9, f2:9, g2:9, h2:7,
    a1:7, b1:7, c1:7, d1:7, e1:7, f1:7, g1:7, h1:7,
}

export const PAWN_VALUE = {
    a8:320, b8:320, c8:320, d8:320, e8:320, f8:320, g8:320, h8:320,
    a7:160, b7:160, c7:160, d7:160, e7:160, f7:160, g7:160, h7:160,
    a6:80, b6:80, c6:80, d6:80, e6:80, f6:80, g6:80, h6:80,
    a5:40, b5:40, c5:40, d5:40, e5:40, f5:40, g5:40, h5:40,
    a4:20, b4:20, c4:20, d4:20, e4:20, f4:20, g4:20, h4:20,
    a3:10, b3:10, c3:10, d3:10, e3:10, f3:10, g3:10, h3:10,
    a2:0, b2:0, c2:0, d2:0, e2:0, f2:0, g2:0, h2:0,
    a1:0, b1:0, c1:0, d1:-0, e1:0, f1:-0, g1:0, h1:0,
}

export function MINIMAX(game, depth, white_turn){
    let moves = GENERATE_MOVES(game);
    let moveValues = [];
    for (let m in moves){
        let newPos = UPDATE_POSITION(game, moves[m]);
        if (depth == 1){
            moveValues[m] = EVALUATE_POSITION(newPos) + Math.random() - 0.5;
        } else {
            moveValues[m] = MINIMAX(newPos, depth-1, !white_turn)[0];
        }
    }

    let bestVal;
    if (white_turn == true){
        bestVal = Math.max(...moveValues);
    } else {
        bestVal = Math.min(...moveValues)
    }

    let index_of = moveValues.indexOf(bestVal);
    let best_move = game.moves()[index_of]
    

    let output = [bestVal, best_move]

    return output;
}

let totalCalls = 0;
export function MINIMAX_ALPHA_BETA(game, depth, white_turn, alpha, beta, position_tree = null, initial_cpudepth = 3){
    if (depth == 0 || game.isGameOver()){   
        return [EVALUATE_POSITION(game), null]
    }

    let moves = GENERATE_MOVES(game);
    
    if (white_turn){
        let bestVal = -Infinity;
        let bestMove = null;

        for (let move of moves){
            const current_fen = game.fen();
            game.move(move);
            let value = MINIMAX_ALPHA_BETA(game, depth-1, false, alpha, beta, position_tree, initial_cpudepth)[0];
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
    }

    else { // black's turn
        let bestVal = Infinity;
        let bestMove = null;
        
        for (let move of moves){
            const current_fen = game.fen();
            game.move(move);
            let value = MINIMAX_ALPHA_BETA(game, depth-1, true, alpha, beta, position_tree, initial_cpudepth)[0];
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

export function GENERATE_MOVES(game){
    // get moves
    let moves = game.moves({verbose:true});
    // let sorted = moves.sort(MOVE_COMPARE); // sorting seemed to actually slow down program
    return moves;
}

export function EVALUATE_POSITION(Game){
    // if game is over, assign +/- infinity
    if (Game.isDraw() || Game.isStalemate() || Game.isThreefoldRepetition() || Game.isInsufficientMaterial()){
        return 0;
    } else if (Game.isCheckmate()){
        if (Game.turn() == "b"){
            return Infinity;
        } else {
            return -Infinity;
        }
    }

    const board = Game.board();

    let whiteScore = 0;
    let blackScore = 0;
    let totalPieces = 0;

    for (let rank in board){
        for (let square in board[rank]){
            let piece = board[rank][square]
            if (piece == null){
                continue;
            }
            piece.visited = true;
            totalPieces++;
            // get piece value
            const pVal = pieceValue[piece.type]
            let totalVal = 0;

            // add "vision" score
            // for knights
            switch(piece.type){
                case "n":
                    totalVal += 300;
                    totalVal += KNIGHT_SIGHT[piece.square];
                    break;
                case "b":
                    totalVal += 320;
                    totalVal += BISHOP_SIGHT[piece.square];
                    break;
                case "p":
                    totalVal += 100;
                    totalVal += 2;
                    let progression;
                    if (piece.color=="w"){
                        progression = piece.square[1] - 2;
                    } else {
                        progression = 7 - piece.square[1];
                    }
                    let progressVal = progression * 10;
                    totalVal += progressVal;
                    break;
                case "r":
                    totalVal += 500;
                    totalVal += 14;
                    break;
                case "q":
                    totalVal += 900;
                    totalVal += (14 + BISHOP_SIGHT[piece.square]);
                    break;
                case "k":
                    totalVal += 20000;
                    break;
            }
        
            // for bishops

            // assign to correct side
            if (piece.color =="w"){
                whiteScore += totalVal;;
            } else if (piece.color == "b"){
                blackScore += totalVal;
            }
        }
    }

    let output = whiteScore - blackScore + Math.random();
    return output;
}

export function UPDATE_POSITION(game, move){
    let gameCopy = new Chess(game.fen())
    gameCopy.move(move);
    return gameCopy;
}

// move sorting
const MOVE_PRIORITY = {
    p: 1,
    n: 2,
    b: 3,
    r: 4,
    q: 5,
    k: 6,
}
export function MOVE_COMPARE(a,b){
    if (!a.captured){
        return -1;
    }

    if (!b.captured){
        return 1;
    }

    return (pieceValue[b.captured] - pieceValue[b.piece]) - (pieceValue[a.captured] - pieceValue[a.piece]);
}
