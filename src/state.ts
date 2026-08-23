export const blackPawn = "P";
export const blackKnight = "N";
export const blackBishop = "B";
export const blackRook = "R";
export const blackQueen = "Q";
export const blackKing = "K";

export const whitePawn = "p";
export const whiteKnight = "n";
export const whiteBishop = "b";
export const whiteRook = "r";
export const whiteQueen = "q";
export const whiteKing = "k";


export type GamePiece = typeof blackPawn |
typeof blackKnight |
typeof blackBishop |
typeof blackRook |
typeof blackQueen |
typeof blackKing |
typeof whitePawn |
typeof whiteKnight |
typeof whiteBishop |
typeof whiteRook |
typeof whiteQueen |
typeof whiteKing;

export const emptyCell = "O";
type EmptyCell = typeof emptyCell

export type BoardCellState = GamePiece | EmptyCell;


export const playerTurnWhite = 0;
export const playerTurnBlack = 1;
export type PlayerTurn = typeof playerTurnBlack | typeof playerTurnWhite;

export type GameAction = {
  from: number;
  to: number;
}