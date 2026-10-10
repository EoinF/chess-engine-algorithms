import { cellIndexToBoardLabel } from "../../utils";
import type { BoardStateManager } from "../boardStateManager"
import { pawn, type GameAction, type GamePiece } from "../state";
import type { MoveInfo, PgnData } from "./loadPgn"

export const applyPgnMove = <T>(
    pgnData: PgnData, stateManager: BoardStateManager<T>, boardState: T, moveNumber: number
): T => {
    if (moveNumber < 0 || moveNumber >= pgnData.moves.length) {
        throw Error("Invalid move number " + moveNumber + ". There are " + pgnData.moves.length + " available moves")
    }
    console.log(pgnData.moves[moveNumber]);
    const pgnMove = interpretMove(stateManager, boardState, pgnData.moves[moveNumber]);
    console.log(pgnMove);
    return stateManager.applyMove(boardState, pgnMove.from, pgnMove.to);
}

export const interpretMove = <T>(stateManager: BoardStateManager<T>, boardState: T, pgnMove: MoveInfo): GameAction => {
    const {pieceInfo, fileHint, rankHint} = pgnMove;

    const legalMoves = stateManager.getLegalMoves(boardState);

    const to = pgnMove.file + 8 * pgnMove.rank;

    const initialCandidates = legalMoves.map((_, index) => index)
        .filter((from) => legalMoves[from].includes(to));

    const candidates = initialCandidates
        .filter((from) => stateManager.getBoardCell(boardState, from).piece === pgnMove.pieceInfo)
        .filter((from) => stateManager.getBoardCell(boardState, from).isWhite === stateManager.isWhiteTurn(boardState))

    if (candidates.length === 1) {
        return {
            from: candidates[0],
            to,
            piece: pieceInfo as GamePiece ?? pawn
        }
    }

    const finalCandidates = candidates.filter(from => {
        const rank = from / 8;
        const file = from % 8;

        const rankMatches = rankHint == null || rank === rankHint;
        const fileMatches = fileHint == null || file === fileHint;

        return rankMatches && fileMatches;
    })
    
    if (finalCandidates.length === 1) {
        return {
            from: finalCandidates[0],
            to,
            piece: pieceInfo as GamePiece ?? pawn
        }
    }

    console.log(initialCandidates.map(cellIndexToBoardLabel));
    console.log(candidates.map(cellIndexToBoardLabel));
    console.log(finalCandidates.map(cellIndexToBoardLabel));
    throw Error("Too many or not enough candidates");
}