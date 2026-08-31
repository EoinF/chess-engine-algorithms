
import { applyMove } from './gameLogic';
import { bishop, emptyCell, king, knight, pawn, queen, rook, type BoardCellState, type BoardState } from './state';

const containsPiece = (cellState: BoardCellState, isWhite: boolean) => {
  return cellState.piece != emptyCell && cellState.isWhite === isWhite;
}

const getPawnLegalMovesAt = (boardState: BoardState, x: number, y: number) => {
  const cellIndex = y * 8 + x;
  const direction = boardState.isWhiteTurn ? 1: -1;
  const startingRow = boardState.isWhiteTurn ? 6: 1; 
  let legalMoves: number[] = [];
  if (y === startingRow && boardState.cells[cellIndex - (16 * direction)].piece === emptyCell) {
    legalMoves.push(cellIndex - 16 * direction);
  }

  const cellPlusOne = cellIndex - 8 * direction;
  if (cellPlusOne < 0 || cellPlusOne >= 64) {
    return legalMoves;
  }
  if (boardState.cells[cellPlusOne].piece === emptyCell) {
    legalMoves.push(cellPlusOne);
  }
  if (x < 7 && containsPiece(boardState.cells[cellPlusOne + 1], !boardState.isWhiteTurn)) {
    legalMoves.push(cellPlusOne + 1);
  }
  if (x > 0 && containsPiece(boardState.cells[cellPlusOne - 1], !boardState.isWhiteTurn)) {
    legalMoves.push(cellPlusOne - 1);
  }
  // TODO: en-passant
  return legalMoves;
}

const getDirectionalLegalMovesAt = (boardState: BoardState, x: number, y: number, directions: Array<number[]>) => {
  let legalMoves: number[] = [];

  directions.forEach(([dirX, dirY]) => {
    let currentX = x + dirX, currentY = y + dirY;

    while(currentX >= 0 && currentX < 8 && currentY >= 0 && currentY < 8 
      && !containsPiece(boardState.cells[currentY * 8 + currentX], boardState.isWhiteTurn)) {
        legalMoves.push(currentY * 8 + currentX);
        if (containsPiece(boardState.cells[currentY * 8 + currentX], !boardState.isWhiteTurn)) {
          break;
        }
      currentX += dirX;
      currentY += dirY;
    }
  });
  return legalMoves;
}

const getSingleDirectionalLegalMovesAt = (boardState: BoardState, x: number, y: number, directions: Array<number[]>) => {
  let legalMoves: number[] = [];

  directions.forEach(([dirX, dirY]) => {
    let currentX = x + dirX, currentY = y + dirY;

    if (currentX >= 0 && currentX < 8 && currentY >= 0 && currentY < 8
      && !containsPiece(boardState.cells[currentY * 8 + currentX], boardState.isWhiteTurn)) {
        legalMoves.push(currentY * 8 + currentX);
    }
  });
  return legalMoves;
}

const knightMovePatterns = [
  [-2, 1], [2, 1], [-2, -1], [2, -1],
  [-1, 2], [1, 2], [-1, -2], [1, -2],
];
const bishopDirections = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
const rookDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const queenDirections = [...bishopDirections, ...rookDirections];
const kingDirections = queenDirections;


const getKnightLegalMovesAt = (boardState: BoardState, x: number, y: number) => {
    return getSingleDirectionalLegalMovesAt(boardState, x, y, knightMovePatterns);
}
const getBishopLegalMovesAt = (boardState: BoardState, x: number, y: number) => {
  return getDirectionalLegalMovesAt(boardState, x, y, bishopDirections);
}
const getRookLegalMovesAt = (boardState: BoardState, x: number, y: number) => {
  return getDirectionalLegalMovesAt(boardState, x, y, rookDirections);
}
const getQueenLegalMovesAt = (boardState: BoardState, x: number, y: number) => {
  return getDirectionalLegalMovesAt(boardState, x, y, queenDirections);
}
const getKingLegalMovesAt = (boardState: BoardState, x: number, y: number) => {
  return getSingleDirectionalLegalMovesAt(boardState, x, y, kingDirections);
}

const isInCheck = (boardState: BoardState) => {
    return false;
}

const getProvisionalLegalMovesAt = (boardState: BoardState, x: number, y: number): number[] => {
  const cellState = boardState.cells[y * 8 + x].piece;
  switch (cellState) {
    case emptyCell: 
    return [];
  case pawn:
    return getPawnLegalMovesAt(boardState, x, y);
  case bishop:
    return getBishopLegalMovesAt(boardState, x, y);
  case knight:
    return getKnightLegalMovesAt(boardState, x, y);
  case rook:
    return getRookLegalMovesAt(boardState, x, y);
  case queen:
    return getQueenLegalMovesAt(boardState, x, y);
  case king:
    return getKingLegalMovesAt(boardState, x, y);
  }
}
export const getLegalMovesAt = (boardState: BoardState, x: number, y: number): number[] => {
  if (boardState.cells[y * 8 + x].isWhite !== boardState.isWhiteTurn) {
    return [];
  }
  const cellIndex = y * 8 + x;
  return getProvisionalLegalMovesAt(boardState, x, y)
    .filter(destination => !isInCheck(applyMove(boardState, cellIndex, destination)));
}