
import { applyMove, rookA1InitialCell, rookA8InitialCell, rookH1InitialCell, rookH8InitialCell } from './gameLogic';
import { bishop, emptyCell, king, knight, pawn, queen, rook, type BoardCellState, type BoardState } from './state';

const containsPiece = (cellState: BoardCellState, isWhite: boolean) => {
  return cellState.piece != emptyCell && cellState.isWhite === isWhite;
}

const getPawnLegalMovesAt = (boardState: BoardState, x: number, y: number) => {
  const cellIndex = y * 8 + x;
  const direction = boardState.isWhiteTurn ? 1 : -1;
  const startingRow = boardState.isWhiteTurn ? 6 : 1;
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
  if (x < 7) {
    if (containsPiece(boardState.cells[cellPlusOne + 1], !boardState.isWhiteTurn)
      || boardState.enPassantPawnIndex === cellPlusOne + 1) {
      legalMoves.push(cellPlusOne + 1);
    }
  }
  if (x > 0) {
    if (containsPiece(boardState.cells[cellPlusOne - 1], !boardState.isWhiteTurn)
      || boardState.enPassantPawnIndex === cellPlusOne - 1) {
      legalMoves.push(cellPlusOne - 1);
    }
  }
  return legalMoves;
}

const getDirectionalLegalMovesAt = (boardState: BoardState, x: number, y: number, directions: Array<number[]>) => {
  let legalMoves: number[] = [];

  directions.forEach(([dirX, dirY]) => {
    let currentX = x + dirX, currentY = y + dirY;

    while (currentX >= 0 && currentX < 8 && currentY >= 0 && currentY < 8
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
  const castlingMoves: number[] = [];
  if (boardState.isWhiteTurn && !boardState.whiteKingMoved) {
    if (!boardState.rookA1Moved
      && boardState.cells[rookA1InitialCell + 1].piece === emptyCell
      && boardState.cells[rookA1InitialCell + 2].piece === emptyCell
      && boardState.cells[rookA1InitialCell + 3].piece === emptyCell) {
      castlingMoves.push(rookA1InitialCell + 2);
    }
    if (!boardState.rookH1Moved
      && boardState.cells[rookH1InitialCell - 1].piece === emptyCell
      && boardState.cells[rookH1InitialCell - 2].piece === emptyCell) {
      castlingMoves.push(rookH1InitialCell - 1);
    }
  }
  if (!boardState.isWhiteTurn && !boardState.blackKingMoved) {
    if (!boardState.rookA8Moved
      && boardState.cells[rookA8InitialCell + 1].piece === emptyCell
      && boardState.cells[rookA8InitialCell + 2].piece === emptyCell
      && boardState.cells[rookA8InitialCell + 3].piece === emptyCell) {
      castlingMoves.push(rookA8InitialCell + 2);
    }
    if (!boardState.rookH8Moved
      && boardState.cells[rookH8InitialCell - 1].piece === emptyCell
      && boardState.cells[rookH8InitialCell - 2].piece === emptyCell) {
      castlingMoves.push(rookH8InitialCell - 1);
    }
  }

  return [...castlingMoves, ...getSingleDirectionalLegalMovesAt(boardState, x, y, kingDirections)];
}

const isInCheck = (boardState: BoardState) => {
  const kingCellIndex = boardState.isWhiteTurn ? boardState.blackKingIndex : boardState.whiteKingIndex;
  const kingX = kingCellIndex % 8;
  const kingY = Math.floor(kingCellIndex / 8);
  if (knightMovePatterns.some(([xDir, yDir]) => {
    const x = kingX + xDir;
    const y = kingY + yDir;
    return x >= 0 && x < 8 && y >= 0 && y < 8 &&
      boardState.cells[x + y * 8].piece === knight &&
      boardState.cells[x + y * 8].isWhite === boardState.isWhiteTurn;
  })) {
    return true;
  }
  if (bishopDirections.some(([xDir, yDir]) => {
    let x = kingX + xDir;
    let y = kingY + yDir;

    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      if (boardState.cells[x + y * 8].piece === bishop || boardState.cells[x + y * 8].piece === queen) {
        return boardState.cells[x + y * 8].isWhite === boardState.isWhiteTurn;
      }
      if (boardState.cells[x + y * 8].piece !== emptyCell) {
        return false;
      }
      x += xDir;
      y += yDir;
    }
    return false;
  })) {
    return true;
  }

  if (rookDirections.some(([xDir, yDir]) => {
    let x = kingX + xDir;
    let y = kingY + yDir;

    while (x >= 0 && x < 8 && y >= 0 && y < 8) {
      if (boardState.cells[x + y * 8].piece === rook || boardState.cells[x + y * 8].piece === queen) {
        return boardState.cells[x + y * 8].isWhite === boardState.isWhiteTurn;
      }
      if (boardState.cells[x + y * 8].piece !== emptyCell) {
        return false;
      }
      x += xDir;
      y += yDir;
    }
    return false;
  })) {
    return true;
  }

  if (!boardState.isWhiteTurn) {
    if (kingY === 0) {
      return false;
    }
    const cellIndex = (kingX - 1) + (kingY - 1) * 8;
    if (kingX > 0 && boardState.cells[cellIndex].piece === pawn && boardState.cells[cellIndex].isWhite === boardState.isWhiteTurn) {
      return true;
    }
    const cellIndex2 = (kingX + 1) + (kingY - 1) * 8;
    if (kingX < 7 && boardState.cells[cellIndex2].piece === pawn && boardState.cells[cellIndex2].isWhite === boardState.isWhiteTurn) {
      return true;
    }
  } else {
    if (kingY === 7) {
      return false;
    }
    const cellIndex = (kingX - 1) + (kingY + 1) * 8;
    if (kingX > 0 && boardState.cells[cellIndex].piece === pawn && boardState.cells[cellIndex].isWhite === boardState.isWhiteTurn) {
      return true;
    }
    const cellIndex2 = (kingX + 1) + (kingY + 1) * 8;
    if (kingX < 7 && boardState.cells[cellIndex2].piece === pawn && boardState.cells[cellIndex2].isWhite === boardState.isWhiteTurn) {
      return true;
    }
  }
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

export const getLegalMoves = (boardState: BoardState) => {
  const legalMovesBuilder: Array<number[]> = Array(64).fill(0).map(() => []);
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      const cellIndex = y * 8 + x;
      legalMovesBuilder[cellIndex] = getLegalMovesAt(boardState, x, y);
    }
  }
  return legalMovesBuilder;
}