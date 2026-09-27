import { applyMove } from "../BoardStateV1/gameLogic";
import { getLegalMoves } from "../BoardStateV1/legalMoves";
import { initialBoardState } from "../BoardStateV1/state";

const legalMoves = getLegalMoves(initialBoardState);
const legalMovesFlattened = legalMoves.flatMap((legalMovesAtCell, from) => legalMovesAtCell.map(to => [from, to]));

onmessage = (e) => {
  const {iterations} = e.data;
 
  for (let i = 0; i < iterations; i++) {
    const [from, to] = legalMovesFlattened[i % legalMovesFlattened.length];
    applyMove(initialBoardState, from, to);
  }
  postMessage({});
};
