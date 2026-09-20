export const pawn = "P";
export const knight = "N";
export const bishop = "B";
export const rook = "R";
export const queen = "Q";
export const king = "K";


export type GamePiece = typeof pawn |
typeof knight |
typeof bishop |
typeof rook |
typeof queen |
typeof king;

export const emptyCell = "O";
export type EmptyCell = typeof emptyCell

export type BoardCellState = {
    piece: Readonly<GamePiece | EmptyCell>;
    isWhite: Readonly<boolean>;
}

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

export const playerTurnWhite = 0;
export const playerTurnBlack = 1;
export type PlayerTurn = typeof playerTurnBlack | typeof playerTurnWhite;

export type GameAction = {
  piece: GamePiece;
  from: number;
  to: number;
}

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