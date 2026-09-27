import { MiniMaxInstance } from "./eval";
import { boardStateV1Manager, type BoardState } from "./BoardStateV1/state";
import { cellIndexToBoardLabel } from "../utils";

const evalFunction = depthLimitedMiniMaxEval;

const MiniMax = MiniMaxInstance(3, boardStateV1Manager);

export function* depthLimitedMiniMaxEval(boardState: BoardState) {
    const {score: evalScore, moves} = MiniMax(boardState);

    for (const move of moves) {
        console.log(`${move.piece} ${cellIndexToBoardLabel(move.from)} -> ${cellIndexToBoardLabel(move.to)}`);
    }
    yield evalScore;
};

onmessage = (e) => {
  const {boardState} = e.data;

  for (const val of evalFunction(boardState)) {
    postMessage(val);
  }
};
