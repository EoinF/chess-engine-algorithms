import { applyMove } from "../gameLogic";
import { getLegalMoves } from "../legalMoves";
import { initialBoardState } from "../state";

const legalMoves = getLegalMoves(initialBoardState);
const legalMovesFlattened = legalMoves.flatMap((legalMovesAtCell, from) => legalMovesAtCell.map(to => [from, to]));
const boardStates = legalMovesFlattened.map(([from, to]) => applyMove(initialBoardState, from, to))

onmessage = (e) => {
  const {iterations} = e.data;
 
  for (let i = 0; i < iterations; i++) {
    getLegalMoves(boardStates[i % boardStates.length]);
  }
  postMessage({});
};

