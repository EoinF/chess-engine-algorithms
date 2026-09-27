import { bishop, emptyCell, king, knight, pawn, queen, rook, type EmptyCell, type GamePiece } from "../state";
import type { BoardState } from "./state";

const scoreMap: Record<GamePiece | EmptyCell, number> = {
    [emptyCell]: 0,
    [pawn]: 1,
    [knight]: 3,
    [bishop]: 3,
    [rook]: 5,
    [queen]: 9,
    [king]: 0
}

export const getBoardEval = (boardState: BoardState) => {
    return boardState.cells.reduce<number>((acc, c) =>
        acc + (c.isWhite ? 1 : -1) * scoreMap[c.piece]
    , 0);
}
