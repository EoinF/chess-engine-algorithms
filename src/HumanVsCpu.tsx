import { useMemo, useState } from 'react';
import './App.css';
import { Board } from './Board';
import { applyMove } from './BoardStateV1/gameLogic';
import { getLegalMoves } from './BoardStateV1/legalMoves';
import { Sidebar } from './Sidebar';
import { type GameAction } from './state';
import { useEval } from './useEval';
import { initialBoardState } from './BoardStateV1/state';

export const HumanVsCpu = () => {
  const [boardState, setBoardState] = useState(initialBoardState);
  const legalMoves = useMemo(() => getLegalMoves(boardState), [boardState]);

  const evalScore = useEval(boardState, legalMoves);

  const performMove = (action: GameAction) => {
    console.log(action.piece);
    console.log(action.from, "->", action.to);
    const newBoardState = applyMove(boardState, action.from, action.to);
    setBoardState(newBoardState);
    // console.log(getBoardEval(newBoardState));
  };
  return <>
      <Board boardState={boardState} legalMoves={legalMoves} performMove={performMove}/>
      <Sidebar evalScore={evalScore}/>
  </>;
}