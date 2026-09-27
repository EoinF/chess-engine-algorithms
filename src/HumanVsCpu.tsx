import { useState } from 'react';
import './App.css';
import { Board } from './Board';
import { Sidebar } from './Sidebar';
import { type GameAction } from './chess/state';
import { useEval } from './useEval';
import { boardStateV1Manager, initialBoardState } from './chess/BoardStateV1/state';

export const HumanVsCpu = () => {
  const [boardState, setBoardState] = useState(initialBoardState);
  const stateManager = boardStateV1Manager;

  const evalScore = useEval(boardState);

  const performMove = (action: GameAction) => {
    console.log(action.piece);
    console.log(action.from, "->", action.to);
    const newBoardState = stateManager.applyMove(boardState, action.from, action.to);
    setBoardState(newBoardState);
    // console.log(getBoardEval(newBoardState));
  };

  return <>
      <Board boardState={boardState} stateManager={stateManager} performMove={performMove}/>
      <Sidebar evalScore={evalScore}/>
  </>;
}