import type { BoardState } from "./BoardStateV1/state";

export const toFileLetter = (fileNumber: number) => 
    String.fromCharCode('A'.charCodeAt(0) + fileNumber);

export const cellIndexToBoardLabel = (cellIndex: number) =>
    `${toFileLetter(cellIndex % 8)}${1 + Math.floor(cellIndex / 8)}`

export const getBoardCell = (boardState: BoardState, cellIndex: number) => boardState.cells[cellIndex];