import type { BoardStateManager } from "../boardStateManager"
import { pawn, type GameAction, type GamePiece } from "../state";
import type { MoveInfo, PgnData } from "./loadPgn"

export const applyPgnMove = <T>(
    pgnData: PgnData, stateManager: BoardStateManager<T>, boardState: T, moveNumber: number
): T => {
    const pgnMove = interpretMove(stateManager, boardState, pgnData.moves[moveNumber]);
    console.log(pgnMove);
    return stateManager.applyMove(boardState, pgnMove.from, pgnMove.to);
}

export const interpretMove = <T>(stateManager: BoardStateManager<T>, boardState: T, pgnMove: MoveInfo): GameAction => {
    const {pieceInfo} = pgnMove;

    const legalMoves = stateManager.getLegalMoves(boardState);
    
    const to = pgnMove.file + 8 * pgnMove.rank;

    const candidates = legalMoves.map((_, index) => index).filter((from) => legalMoves[from].includes(to));

    if (candidates.length === 1) {
        return {
            from: candidates[0],
            to,
            piece: pieceInfo as GamePiece ?? pawn
        }
    }

    console.log(candidates);
    throw Error("Too many candidates");
}