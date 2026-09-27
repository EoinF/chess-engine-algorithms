import { applyMove } from "./BoardStateV1/gameLogic";
import { getLegalMoves } from "./BoardStateV1/legalMoves";
import type { BoardState } from "./BoardStateV1/state";
import { bishop, emptyCell, king, knight, pawn, queen, rook, type EmptyCell, type GameAction, type GamePiece } from "./state";
import { getBoardCell } from "./utils";

const scoreMap: Record<GamePiece | EmptyCell, number> = {
    [emptyCell]: 0,
    [pawn]: 1,
    [knight]: 3,
    [bishop]: 3,
    [rook]: 5,
    [queen]: 9,
    [king]: 0
}

export const getBoardEval = (boardState: BoardState) => {
    return boardState.cells.reduce<number>((acc, c) =>
        acc + (c.isWhite ? 1 : -1) * scoreMap[c.piece]
    , 0);
}

function* simpleEval(boardState: BoardState, legalMoves: number[][]) {   
    yield getBoardEval(boardState);
};

type EvalMoveHistory = {
    score: number;
    moves: GameAction[];
}

export function MiniMaxInstance(maxDepth: number) {
    function MiniMax(boardState: BoardState, legalMoves: number[][], depth: number): EvalMoveHistory {
        if (depth === 0) {
            // console.log(depthToArrow[depth], getBoardEval(boardState), boardState)
            return {score: getBoardEval(boardState), moves: Array.from({length: maxDepth})};
        }
        let bestScore = boardState.isWhiteTurn ? Number.MIN_SAFE_INTEGER: Number.MAX_SAFE_INTEGER;
        let bestMoves: GameAction[] = [];
        const choiceFunction = boardState.isWhiteTurn ? Math.max: Math.min;

        for (let from = 0; from < legalMoves.length; from++) {
            for (const to of legalMoves[from]) {
                const boardCell = getBoardCell(boardState, from);
                const newBoardState = applyMove(boardState, from, to);
                const newLegalMoves = getLegalMoves(newBoardState);
                const {score, moves} = MiniMax(newBoardState, newLegalMoves, depth - 1);
                bestScore = choiceFunction(bestScore, score);
                
                if (bestScore === score) {
                    bestMoves = moves;
                    bestMoves[maxDepth - depth] = { piece: boardCell.piece as GamePiece, from, to};
                }
            }
        }
        return {score: bestScore, moves: bestMoves};
    }

    return (boardState: BoardState, legalMoves: number[][]) => MiniMax(boardState, legalMoves, maxDepth);
}
