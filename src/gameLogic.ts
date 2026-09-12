import { emptyCell, king, pawn, type BoardCellState, type BoardState } from "./state";

const blackKingInitialCell = (8 * 7) + 4;
const whiteKingInitialCell = 4;
export const rookA8InitialCell = 0;
export const rookH8InitialCell = 7;
export const rookA1InitialCell = 8 * 7 - 1;
export const rookH1InitialCell = 8 * 8 - 1;

// Mappings from the kings destination to the rooks origin+desination
const castleMappings = {
    [rookA8InitialCell + 2]: [rookA8InitialCell, rookA8InitialCell + 3],
    [rookH8InitialCell - 1]: [rookH8InitialCell, rookH8InitialCell - 2],
    [rookA1InitialCell + 2]: [rookA1InitialCell, rookA1InitialCell + 3],
    [rookH1InitialCell - 1]: [rookH1InitialCell, rookH1InitialCell - 2]
}

export const applyMove = (boardState: BoardState, from: number, to: number): BoardState => {
    const newCells = JSON.parse(JSON.stringify(boardState.cells)) as BoardCellState[];
    
    const cellDifference = to - from;

    newCells[to] = {...newCells[from]};
    newCells[from] = {piece: emptyCell, isWhite: false};

    // Castling
    if (cellDifference === 2 && newCells[to].piece === king) {
        console.log(from, to, castleMappings, newCells[from], newCells[to])
        const [rookFrom, rookTo] = castleMappings[to];
        newCells[rookTo] = {...newCells[rookTo]};
        newCells[rookFrom] = {piece: emptyCell, isWhite: false};
    }

    if (to === boardState.enPassantPawnIndex) {
        const capturedPawnIndex = boardState.enPassantPawnIndex - Math.sign(cellDifference) * 8;
        newCells[capturedPawnIndex] = {piece: emptyCell, isWhite: false};
    }

    const isEnPassant = newCells[to].piece === pawn && Math.abs(cellDifference) === 16;
    return {
        cells: newCells,
        isWhiteTurn: !boardState.isWhiteTurn,
        whiteKingIndex: newCells[to].isWhite && newCells[to].piece === king ? to: boardState.whiteKingIndex,
        blackKingIndex: !newCells[to].isWhite && newCells[to].piece === king ? to: boardState.blackKingIndex,
        enPassantPawnIndex: isEnPassant ? to - (cellDifference / 2) : null,
        rookA1Moved: boardState.rookA1Moved || (from === rookA1InitialCell),
        rookH1Moved: boardState.rookH1Moved || (from === rookH1InitialCell),
        rookA8Moved: boardState.rookA8Moved || (from === rookA8InitialCell),
        rookH8Moved: boardState.rookH8Moved || (from === rookH8InitialCell),
        blackKingMoved: boardState.blackKingMoved || from === blackKingInitialCell,
        whiteKingMoved: boardState.whiteKingMoved || from === whiteKingInitialCell,
    }
}