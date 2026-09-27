import type { BoardCellState } from "./state";

export type BoardStateManager<T = any> = {
    getLegalMoves: (state: T) => number[][];
    applyMove: (state: T, from: number, to: number) => T;
    getBoardCell: (state: T, cellIndex: number) => BoardCellState;
    getBoardEval: (state: T) => number;
    isWhiteTurn: (state: T) => boolean;
}