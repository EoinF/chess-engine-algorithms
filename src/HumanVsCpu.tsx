import { useState } from 'react';
import './App.css';
import { Board } from './Board';
import { Sidebar } from './Sidebar';
import { type GameAction } from './chess/state';
import { useEval } from './useEval';
import { boardStateV1Manager } from './chess/BoardStateV1/state';
import { loadPGN } from './chess/pgn/loadPgn';
import { applyPgnMove } from './chess/pgn/applyPgn';

const gamePgn = `
[Event ""]
[Site ""]
[Date "????.??.??"]
[Round ""]
[White "White"]
[Black "Black"]
[TimeControl "-"]
[Result "1-0"]

1.e4 {xyz} 1...e5 ({abc} 1...d4) 2.Nf3 f6 3.Nxe5 fxe5 4.Qh5+
`;

const game2Pgn = `
[Event "F/S Return Match"]
[Site "Belgrade, Serbia JUG"]
[Date "1992.11.04"]
[Round "29"]
[White "Fischer, Robert J."]
[Black "Spassky, Boris V."]
[Result "1/2-1/2"]

1.e4 e5 2.Nf3 Nc6 3.Bb5 {This opening is called the Ruy Lopez.} 3...a6
4.Ba4 Nf6 5.O-O Be7 6.Re1 b5 7.Bb3 d6 8.c3 O-O 9.h3 Nb8 10.d4 Nbd7
11.c4 c6 12.cxb5 axb5 13.Nc3 Bb7 14.Bg5 b4 15.Nb1 h6 16.Bh4 c5 17.dxe5
Nxe4 18.Bxe7 Qxe7 19.exd6 Qf6 20.Nbd2 Nxd6 21.Nc4 Nxc4 22.Bxc4 Nb6
23.Ne5 Rae8 24.Bxf7+ Rxf7 25.Nxf7 Rxe1+ 26.Qxe1 Kxf7 27.Qe3 Qg5 28.Qxg5
hxg5 29.b3 Ke6 30.a3 Kd6 31.axb4 cxb4 32.Ra5 Nd5 33.f3 Bc8 34.Kf2 Bf5
35.Ra7 g6 36.Ra6+ Kc5 37.Ke1 Nf4 38.g3 Nxh3 39.Kd2 Kb5 40.Rd6 Kc5 41.Ra6
Nf2 42.g4 Bd3 43.Re6 1/2-1/2
`

const pgnData = loadPGN(gamePgn);

export const HumanVsCpu = () => {
  const stateManager = boardStateV1Manager;
  const [boardState, setBoardState] = useState(stateManager.getInitialState());
  const [moveNumber, setMoveNumber] = useState(0);

  const evalScore = useEval(boardState);

  const performMove = (action: GameAction) => {
    console.log(action.piece);
    console.log(action.from, "->", action.to);
    const newBoardState = stateManager.applyMove(boardState, action.from, action.to);
    setBoardState(newBoardState);
    // console.log(getBoardEval(newBoardState));
  };
  
  const applyNext = () => {
    setMoveNumber(moveNumber => moveNumber + 1);
    setBoardState(applyPgnMove(pgnData, stateManager, boardState, moveNumber));
  }

  return <>
      <Board boardState={boardState} stateManager={stateManager} performMove={performMove}/>
      <Sidebar evalScore={evalScore}/>
      <button onClick={applyNext}>Apply next</button>
  </>;
}