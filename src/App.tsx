import { useState } from 'react';
import './App.css';
import { Board } from './Board';
import { applyMove } from './gameLogic';
import { getLegalMovesAt } from './legalMoves';
import { king, type BoardCellState, type BoardState, type EmptyCell, type GameAction, type GamePiece } from './state';

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

const initialBoardState: BoardState = {
  cells: initialBoardCells,
  blackKingIndex: initialBoardCells.findIndex(cell => cell.piece === king && !cell.isWhite),
  whiteKingIndex: initialBoardCells.findIndex(cell => cell.piece === king && cell.isWhite),
  isWhiteTurn: true,
}


function App() {
  const [boardState, setBoardState] = useState(initialBoardState);

  const legalMoves: Array<number[]> = Array(64).fill(0).map(() => []);

  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      const cellIndex = y * 8 + x;
      legalMoves[cellIndex] = getLegalMovesAt(boardState, x, y);
    }
  }

  const performMove = (action: GameAction) => {
    console.log(action.piece);
    setBoardState(applyMove(boardState, action.from, action.to));
  };
  
  return <div className="app-container">
    <Board boardState={boardState} legalMoves={legalMoves} performMove={performMove}/>
  </div>;
}

export default App;
