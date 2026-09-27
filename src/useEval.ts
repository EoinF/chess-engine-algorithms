import { useEffect, useRef, useState } from "react";
import type { BoardState } from "./BoardStateV1/state";

export const useEval = (boardState: BoardState, legalMoves: number[][], isActive: boolean = true) => {
    const [evalScore, setEval] = useState(0);
    const workerRef = useRef(new Worker(new URL("evalWorker.ts", import.meta.url), {type: "module"}));

    useEffect(() => {
        workerRef.current.onmessage = (e) => {
            setEval(e.data as number);
        }
    }, []);
    
    useEffect(() => {
        if (isActive) {
            workerRef.current.postMessage({boardState, legalMoves});
        } else {
            workerRef.current.terminate();
        }
    }, [boardState, legalMoves, isActive]);

    return evalScore;
}