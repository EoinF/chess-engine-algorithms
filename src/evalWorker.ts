import { MiniMaxInstance } from "./eval";
import type { BoardState } from "./state";
import { cellIndexToBoardLabel } from "./utils";

const evalFunction = depthLimitedMiniMaxEval;

const MiniMax = MiniMaxInstance(3);

export function* depthLimitedMiniMaxEval(boardState: BoardState, legalMoves: number[][]) {
    const {score: evalScore, moves} = MiniMax(boardState, legalMoves);

    for (const move of moves) {
        console.log(`${move.piece} ${cellIndexToBoardLabel(move.from)} -> ${cellIndexToBoardLabel(move.to)}`);
    }
    yield evalScore;
};

onmessage = (e) => {
  const {boardState, legalMoves} = e.data;

  for (const val of evalFunction(boardState, legalMoves)) {
    postMessage(val);
  }
};
