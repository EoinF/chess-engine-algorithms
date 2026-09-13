import { depthLimitedMiniMaxEval } from "./eval";

const evalFunction = depthLimitedMiniMaxEval;

onmessage = (e) => {
  const {boardState, legalMoves} = e.data;

  for (const val of evalFunction(boardState, legalMoves)) {
    postMessage(val);
  }
};
