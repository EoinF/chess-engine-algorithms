import { king, type BoardCellState, type EmptyCell, type GamePiece } from "../state";

export type BoardState = Readonly<
{
  cells: Readonly<BoardCellState>[];
  whiteKingIndex: number;
  blackKingIndex: number;
  isWhiteTurn: boolean;
  enPassantPawnIndex: number | null;
  rookA1Moved: boolean;
  rookA8Moved: boolean;
  rookH1Moved: boolean;
  rookH8Moved: boolean;
  blackKingMoved: boolean;
  whiteKingMoved: boolean;
}>

const initialBoardCells: BoardCellState[] = [
  "RNBQKBNR",
  "PPPPPPPP",
  "OOOOOOOO",
  "OOOOOOOO",
  "OOOOOOOO",
  "OOOOOOOO",
  "pppppppp",
  "rnbqkbnr"
].join("").split("").map((cell) => ({
  piece: cell.toUpperCase() as GamePiece | EmptyCell,
  isWhite: cell.charCodeAt(0) >= 0x61, // cell > 'a'
}));

export const initialBoardState: Readonly<BoardState> = {
  cells: initialBoardCells,
  blackKingIndex: initialBoardCells.findIndex(cell => cell.piece === king && !cell.isWhite),
  whiteKingIndex: initialBoardCells.findIndex(cell => cell.piece === king && cell.isWhite),
  isWhiteTurn: true,
  enPassantPawnIndex: null,
  blackKingMoved: false,
  whiteKingMoved: false,
  rookA1Moved: false,
  rookA8Moved: false,
  rookH1Moved: false,
  rookH8Moved: false,
}