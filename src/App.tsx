import { useMemo, useState } from 'react';
import './App.css';
import { Board } from './Board';
import { applyMove } from './gameLogic';
import { king, type BoardCellState, type BoardState, type EmptyCell, type GameAction, type GamePiece } from './state';
import { getLegalMoves, getLegalMovesAt } from './legalMoves';
import { getBoardEval, useEval } from './eval';
import { Sidebar } from './Sidebar';

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
  enPassantPawnIndex: null,
  blackKingMoved: false,
  whiteKingMoved: false,
  rookA1Moved: false,
  rookA8Moved: false,
  rookH1Moved: false,
  rookH8Moved: false,
}


function App() {
  const [boardState, setBoardState] = useState(initialBoardState);

  const legalMoves = useMemo(() => getLegalMoves(boardState), [boardState]);

  const evalScore = useEval(boardState, legalMoves);

  const performMove = (action: GameAction) => {
    console.log(action.piece);
    console.log(action.from, "->", action.to);
    const newBoardState = applyMove(boardState, action.from, action.to);
    setBoardState(newBoardState);
    console.log(getBoardEval(newBoardState));
  };
  
  return <div className="app-container">
    <Board boardState={boardState} legalMoves={legalMoves} performMove={performMove}/>
    <Sidebar evalScore={evalScore}/>
  </div>;
}

export default App;
