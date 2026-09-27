
import { boardStateV1Manager, initialBoardState } from "../BoardStateV1/state";

const stateManager = boardStateV1Manager;
const legalMoves = stateManager.getLegalMoves(initialBoardState);
const legalMovesFlattened = legalMoves.flatMap((legalMovesAtCell, from) => legalMovesAtCell.map(to => [from, to]));
const boardStates = legalMovesFlattened.map(([from, to]) => stateManager.applyMove(initialBoardState, from, to))

onmessage = (e) => {
  const {iterations} = e.data;
 
  for (let i = 0; i < iterations; i++) {
    stateManager.getLegalMoves(boardStates[i % boardStates.length]);
  }
  postMessage({});
};
