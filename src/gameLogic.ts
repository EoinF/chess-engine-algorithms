import { emptyCell, king, type BoardCellState, type BoardState } from "./state";

export const applyMove = (boardState: BoardState, from: number, to: number): BoardState => {
    const newCells = JSON.parse(JSON.stringify(boardState.cells)) as BoardCellState[];
    newCells[to] = {...newCells[from]};
    newCells[from] = {piece: emptyCell, isWhite: false};
    return {
        cells: newCells,
        isWhiteTurn: !boardState.isWhiteTurn,
        whiteKingIndex: newCells[to].isWhite && newCells[to].piece === king ? to: boardState.whiteKingIndex,
        blackKingIndex: !newCells[to].isWhite && newCells[to].piece === king ? to: boardState.blackKingIndex
    }
}