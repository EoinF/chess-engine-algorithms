import { useState } from 'react';
import './App.css';
import { Board } from './Board';
import { bishop, emptyCell, king, knight, pawn, queen, rook, type BoardCellState, type EmptyCell, type GameAction, type GamePiece } from './state';

const initialBoardState: BoardCellState[] = [
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

const containsPiece = (cellState: BoardCellState, isWhite: boolean) => {
  return cellState.piece != emptyCell && cellState.isWhite === isWhite;
}

const getPawnLegalMovesAt = (boardState: BoardCellState[], x: number, y: number, isWhite: boolean) => {
  const cellIndex = y * 8 + x;
  const direction = isWhite ? 1: -1;
  const startingRow = isWhite ? 6: 1; 
  let legalMoves: number[] = [];
  if (y === startingRow && boardState[cellIndex - (16 * direction)].piece === emptyCell) {
    legalMoves.push(cellIndex - 16 * direction);
  }

  const cellPlusOne = cellIndex - 8 * direction;
  if (cellPlusOne < 0 || cellPlusOne >= 64) {
    return legalMoves;
  }
  if (boardState[cellPlusOne].piece === emptyCell) {
    legalMoves.push(cellPlusOne);
  }
  if (x < 7 && containsPiece(boardState[cellPlusOne + 1], !isWhite)) {
    legalMoves.push(cellPlusOne + 1);
  }
  if (x > 0 && containsPiece(boardState[cellPlusOne - 1], !isWhite)) {
    legalMoves.push(cellPlusOne - 1);
  }
  // TODO: en-passant
  return legalMoves;
}

const getDirectionalLegalMovesAt = (boardState: BoardCellState[], x: number, y: number, isWhite: boolean, directions: Array<number[]>) => {
  let legalMoves: number[] = [];

  directions.forEach(([dirX, dirY]) => {
    let currentX = x + dirX, currentY = y + dirY;

    while(currentX >= 0 && currentX < 8 && currentY >= 0 && currentY < 8 
      && !containsPiece(boardState[currentY * 8 + currentX], isWhite)) {
        legalMoves.push(currentY * 8 + currentX);
        if (containsPiece(boardState[currentY * 8 + currentX], !isWhite)) {
          break;
        }
      currentX += dirX;
      currentY += dirY;
    }
  });
  return legalMoves;
}

const getSingleDirectionalLegalMovesAt = (boardState: BoardCellState[], x: number, y: number, isWhite: boolean, directions: Array<number[]>) => {
  let legalMoves: number[] = [];

  directions.forEach(([dirX, dirY]) => {
    let currentX = x + dirX, currentY = y + dirY;

    if (currentX >= 0 && currentX < 8 && currentY >= 0 && currentY < 8
      && !containsPiece(boardState[currentY * 8 + currentX], isWhite)) {
        legalMoves.push(currentY * 8 + currentX);
    }
  });
  return legalMoves;
}

const knightMovePatterns = [
  [-2, 1], [2, 1], [-2, -1], [2, -1],
  [-1, 2], [1, 2], [-1, -2], [1, -2],
];

const getKnightLegalMovesAt = (boardState: BoardCellState[], x: number, y: number, isWhite: boolean) => {
  return knightMovePatterns
    .filter(([dx, dy]) => x + dx >= 0 && x + dx < 8 && y + dy >= 0 && y + dy < 8)
    .map(([dx, dy]) => (x + dx) + (y + dy) * 8)
    .filter(newCellIndex => boardState[newCellIndex].piece === emptyCell || containsPiece(boardState[newCellIndex], !isWhite));
}

const bishopDirections = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
const rookDirections = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const queenDirections = [...bishopDirections, ...rookDirections];
const kingDirections = queenDirections;

const getBishopLegalMovesAt = (boardState: BoardCellState[], x: number, y: number, isWhite: boolean) => {
  return getDirectionalLegalMovesAt(boardState, x, y, isWhite, bishopDirections);
}

const getRookLegalMovesAt = (boardState: BoardCellState[], x: number, y: number, isWhite: boolean) => {
  return getDirectionalLegalMovesAt(boardState, x, y, isWhite, rookDirections);
}

const getQueenLegalMovesAt = (boardState: BoardCellState[], x: number, y: number, isWhite: boolean) => {
  return getDirectionalLegalMovesAt(boardState, x, y, isWhite, queenDirections);
}

const getKingLegalMovesAt = (boardState: BoardCellState[], x: number, y: number, isWhite: boolean) => {
  return getSingleDirectionalLegalMovesAt(boardState, x, y, isWhite, kingDirections);
}

const getLegalMovesAt = (boardState: BoardCellState[], x: number, y: number, isWhite: boolean): number[] => {
  if (boardState[y * 8 + x].isWhite !== isWhite) {
    return [];
  }
  const cellState = boardState[y * 8 + x].piece;
  switch (cellState) {
    case emptyCell: 
    return [];
  case pawn:
    return getPawnLegalMovesAt(boardState, x, y, isWhite);
  case bishop:
    return getBishopLegalMovesAt(boardState, x, y, isWhite);
  case knight:
    return getKnightLegalMovesAt(boardState, x, y, isWhite);
  case rook:
    return getRookLegalMovesAt(boardState, x, y, isWhite);
  case queen:
    return getQueenLegalMovesAt(boardState, x, y, isWhite);
  case king:
    return getKingLegalMovesAt(boardState, x, y, isWhite);
  }
}

function App() {
  const [isWhiteTurn, setIsWhiteTurn] = useState<boolean>(true);
  const [boardState, setBoardState] = useState(initialBoardState);

  const legalMoves: Array<number[]> = Array(64).fill(0).map(() => []);

  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      const cellIndex = y * 8 + x;
      legalMoves[cellIndex] = getLegalMovesAt(boardState, x, y, isWhiteTurn);
    }
  }

  const performMove = (action: GameAction) => {
    const newBoardState = JSON.parse(JSON.stringify(boardState)) as BoardCellState[];
    console.log(action.piece);
    newBoardState[action.to].piece = newBoardState[action.from].piece;
    newBoardState[action.to].isWhite = newBoardState[action.from].isWhite;
    newBoardState[action.from].piece = emptyCell;
    setBoardState(newBoardState);
    setIsWhiteTurn(!isWhiteTurn);
  };
  
  return <div className="app-container">
    <Board boardState={boardState} isWhite={isWhiteTurn} legalMoves={legalMoves} performMove={performMove}/>
  </div>;
}

export default App
