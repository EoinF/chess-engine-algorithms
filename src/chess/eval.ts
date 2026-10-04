import type { BoardStateManager } from "./boardStateManager";
import type { BoardState } from "./BoardStateV1/state";
import { type GameAction, type GamePiece } from "./state";

function* simpleEval(boardState: BoardState, legalMoves: number[][]) {
    // yield getBoardEval(boardState);
};

type EvalMoveHistory = {
    score: number;
    moves: GameAction[];
}

export function MiniMaxInstance<T>(maxDepth: number, stateManager: BoardStateManager<T>) {
    function MiniMax(boardState: T, depth: number): EvalMoveHistory {
        if (depth === 0) {
            // console.log(depthToArrow[depth], getBoardEval(boardState), boardState)
            return {score: stateManager.getBoardEval(boardState), moves: Array.from({length: maxDepth})};
        }
        const isWhiteTurn = stateManager.isWhiteTurn(boardState);
        let bestScore = isWhiteTurn ? Number.MIN_SAFE_INTEGER: Number.MAX_SAFE_INTEGER;
        let bestMoves: GameAction[] = [];
        const choiceFunction = isWhiteTurn ? Math.max: Math.min;

        const legalMoves = stateManager.getLegalMoves(boardState);
        for (let from = 0; from < legalMoves.length; from++) {
            for (const to of legalMoves[from]) {
                const boardCell = stateManager.getBoardCell(boardState, from);
                const newBoardState = stateManager.applyMove(boardState, from, to);
                const {score, moves} = MiniMax(newBoardState, depth - 1);
                bestScore = choiceFunction(bestScore, score);
                
                if (bestScore === score) {
                    bestMoves = moves;
                    bestMoves[maxDepth - depth] = { piece: boardCell.piece as GamePiece, from, to};
                }
            }
        }
        return {score: bestScore, moves: bestMoves};
    }

    return (boardState: T) => MiniMax(boardState, maxDepth);
}
