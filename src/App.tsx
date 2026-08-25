import { useState } from 'react';
import './App.css';
import { Board } from './Board';
import { bishop, emptyCell, pawn, type BoardCellState, type EmptyCell, type GameAction, type GamePiece } from './state';

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

const getBishopLegalMovesAt = (boardState: BoardCellState[], x: number, y: number, isWhite: boolean) => {
  let legalMoves: number[] = [];
  
  const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

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

const getLegalMovesAt = (boardState: BoardCellState[], x: number, y: number, isWhite: boolean) => {
  if (boardState[y * 8 + x].isWhite !== isWhite) {
    return [];
  }
  const cellState = boardState[y * 8 + x].piece;
  if (cellState === emptyCell) {
    return [];
  }
  if (cellState === pawn) {
    return getPawnLegalMovesAt(boardState, x, y, isWhite);
  }
  if (cellState == bishop) {
    return getBishopLegalMovesAt(boardState, x, y, isWhite);
  }
  return [];
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
