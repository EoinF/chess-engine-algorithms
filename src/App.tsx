import { useState } from 'react';
import './App.css';
import { Board } from './Board';
import { blackBishop, blackKing, blackKnight, blackPawn, blackQueen, blackRook, emptyCell, playerTurnWhite, whiteBishop, whiteKing, whiteKnight, whitePawn, whiteQueen, whiteRook, type BoardCellState, type GameAction, type GamePiece, type PlayerTurn } from './state';

const initialBoardState = [
  "RNBQKBNR",
  "PPPPPPPP",
  "OOOpOOOO",
  "OOOOOOOO",
  "OOObOOOO",
  "OOOOOOOO",
  "pppOpppp",
  "rnbqkbnr"
].join("");

const containsWhitePiece = (cellState: BoardCellState) => {
  // TODO: More optimal to bitwise AND with 0x30
  return [whiteKing, whiteBishop, whiteKnight, whitePawn, whiteQueen, whiteRook].includes(cellState);
}
const containsBlackPiece = (cellState: BoardCellState) => {
  // TODO: More optimal to bitwise AND with 0x30
  return [blackKing, blackBishop, blackKnight, blackPawn, blackQueen, blackRook].includes(cellState);
}

const getWhitePawnLegalMovesAt = (boardState: string, x: number, y: number) => {
  const cellIndex = y * 8 + x;
  let legalMoves: GameAction[] = [];
  if (y === 6 && boardState[cellIndex - 16] === emptyCell) {
    legalMoves.push({from: cellIndex, to: cellIndex - 16})
  }
  if (boardState[cellIndex - 8] === emptyCell) {
    legalMoves.push({from: cellIndex, to: cellIndex - 8});
  }
  if (x > 0 && containsBlackPiece(boardState[cellIndex - 8 + 1] as BoardCellState)) {
    legalMoves.push({from: cellIndex, to: cellIndex - 8 + 1});
  }
  if (x > 0 && containsBlackPiece(boardState[cellIndex - 8 - 1] as BoardCellState)) {
    legalMoves.push({from: cellIndex, to: cellIndex - 8 - 1});
  }
  // TODO: en-passant
  return legalMoves;
}

const getWhiteBishopLegalMovesAt = (boardState: string, x: number, y: number) => {
  const cellIndex = y * 8 + x;
  let legalMoves: GameAction[] = [];
  
  const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

  directions.forEach(([dirX, dirY]) => {
    let currentX = x + dirX, currentY = y + dirY;

    while(currentX >= 0 && currentX < 8 && currentY >= 0 && currentY < 8 
      && !containsWhitePiece(boardState[currentY * 8 + currentX] as BoardCellState)) {
        legalMoves.push({from: cellIndex, to: currentY * 8 + currentX});
        if (containsBlackPiece(boardState[currentY * 8 + currentX] as BoardCellState)) {
          break;
        }
      currentX += dirX;
      currentY += dirY;
    }
  });
  return legalMoves;
}

const getWhiteLegalMovesAt = (boardState: string, cellState: GamePiece, x: number, y: number) => {
  if (cellState == whitePawn) {
    return getWhitePawnLegalMovesAt(boardState, x, y);
  }
  if (cellState == whiteBishop) {
    return getWhiteBishopLegalMovesAt(boardState, x, y);
  }
  return [];
}

const getBlackLegalMovesAt = (boardState: string, cellState: GamePiece, x: number, y: number) => {
  const cellIndex = y * 8 + x;
  let legalMoves: GameAction[] = [];
  return legalMoves;
}

const getLegalMovesAt = (boardState: string, playerTurn: PlayerTurn ,x: number, y: number) => {
  const cellState = boardState[y * 8 + x] as BoardCellState;
  if (cellState === emptyCell) {
    return [];
  }
  if (playerTurn === playerTurnWhite) {
    return getWhiteLegalMovesAt(boardState, cellState, x, y);
  } else {
    return getBlackLegalMovesAt(boardState, cellState, x, y);
  }
}

function App() {
  const [playerTurn, setPlayerTurn] = useState<PlayerTurn>(0);
  const [boardState, setBoardState] = useState(initialBoardState);

  const legalMoves: Array<GameAction[]> = Array(64).fill(0).map(() => []);

  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      const cellIndex = y * 8 + x;
      legalMoves[cellIndex] = getLegalMovesAt(boardState, playerTurn, x, y);
    }
  }

  console.log(legalMoves);

  return <div className="app-container">
    <Board boardState={boardState} playerTurn={playerTurn} legalMoves={legalMoves}/>
  </div>;
}

export default App
