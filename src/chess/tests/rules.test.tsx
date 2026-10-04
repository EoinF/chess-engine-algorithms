import {describe, test, expect} from "vitest"
import { boardStateV1Manager } from "../BoardStateV1/state";
import game1 from "./game1.pgn?raw";
import { loadPGN } from "../pgn/loadPgn";

describe("Legal moves", () => {
    const stateManager = boardStateV1Manager;
    test("snapshots", () => {
        expect(stateManager.getLegalMoves(stateManager.getInitialState())).toMatchSnapshot("initialBoard");

        // const pgnData = loadPGN(game1);
        // pgnData.applyAllMoves(stateManager.getInitialState());
        // expect(stateManager.getLegalMoves(boardState)).toMatchSnapshot("initialBoard");
    });
});