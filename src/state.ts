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
    piece: GamePiece | EmptyCell;
    isWhite: boolean;
}


export const playerTurnWhite = 0;
export const playerTurnBlack = 1;
export type PlayerTurn = typeof playerTurnBlack | typeof playerTurnWhite;

export type GameAction = {
  piece: GamePiece;
  from: number;
  to: number;
}