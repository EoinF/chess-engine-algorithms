import { king, pawn, type GamePiece } from "../state";

export type MoveInfo = {
    raw: string;
    moveNumber: number;
    pieceInfo: GamePiece;
    captureInfo: boolean;
    file: number,
    rank: number;
    fileHint: number | undefined;
    rankHint: number | undefined;
    checkOrMate: string;
};

const tagRegex = /^\s*\[(\w+)\s*\"(.*)\"\s*\]\s*$/;
const commentRegex = /{.*?}/g;
const tokenizer = /\s*(.+?)\s*(?:\s|$)/g;
const moveExtractor = /(\d+)?\.*([PNBRQK]+)?([a-h])?([1-8])?(x)?(\w)(\d)(\+|#)?/

const castlingExtractor = /(\d+)?\.*O-O(-O)?/;

export type PgnData = {
    tags: Record<string, string>;
    moves: MoveInfo[];
}

export const loadPGN = (pgnData: string): PgnData => {
    const lines = pgnData.split("\n");
    const tags: Record<string, string> = {};
    let moveInfos: MoveInfo[] = [];
    for (const line of lines) {
        if (line === "") {
            continue;
        }
        const result = tagRegex.exec(line);
        if (result) {
            const [_, tagName, tagValue] = result;
            tags[tagName] = tagValue;
            continue;
        }
        moveInfos = [...moveInfos, ...extractMoveInfo(line)];
    }

    console.log(tags);
    return {
        tags, 
        moves: moveInfos
    };
};

const extractMoveInfo = (line: string) => {
    const moveInfos: MoveInfo[] = [];
    const withoutComments = line.replaceAll(commentRegex, "");
    // const moveNumber = 1;

    const normalisedLine = withoutComments.replaceAll("(", " ( ").replaceAll(")", " ) ");

    let match: RegExpExecArray | null = null;
    let isWhiteTurn = false;
    let isAlternativeLine = false;
    let nextMoveNumber = 1;
    let tokensCount = 0;

    while((match = tokenizer.exec(normalisedLine)) != null && tokensCount < 10000) {
        isWhiteTurn = !isWhiteTurn;
        tokensCount++;
        const token = match[1];
        if (token === "(") {
            isAlternativeLine = true;
            continue;
        }
        if (token === ")") {
            isAlternativeLine = false;
            continue;
        }
        if (isAlternativeLine) {
            // Ignore all alternative moves for now
            continue;
        }

        const castlingResult =  castlingExtractor.exec(token)

        if (castlingResult != null) {
            const [_, moveNumber, queenSideMarker] = castlingResult;
            if (moveNumber != null) {
                nextMoveNumber = parseInt(moveNumber);
            }
            moveInfos.push({
                raw: token,
                moveNumber: nextMoveNumber,
                pieceInfo: king,
                captureInfo: false, 
                file: queenSideMarker === "-O" ? 2: 6,
                rank: isWhiteTurn ? 7: 0,
                fileHint: undefined,
                rankHint: undefined,
                checkOrMate: "",
            });
            continue;
        }

        const result =  moveExtractor.exec(token);
        if (result == null) {
            console.log("Unable to parse move", token);
            continue;
            // throw Error(`Unable to parse move ${token}`);
        }
        
        const [_, moveNumber, pieceInfo, fileHint, rankHint, captureInfo, file, rank, checkOrMate] = result;
        // console.log({token, moveNumber, pieceInfo, captureInfo, file, rank, checkOrMate})
        if (moveNumber != null) {
            nextMoveNumber = parseInt(moveNumber);
        }
        moveInfos.push({
            raw: token,
            moveNumber: nextMoveNumber,
            pieceInfo: pieceInfo ? pieceInfo as GamePiece : pawn,
            captureInfo: captureInfo === "x",
            file: (file.charCodeAt(0) - 0x61), // Subtract hex code for 'a' 
            rank: 7 - (parseInt(rank) - 1),
            fileHint: fileHint ? (fileHint.charCodeAt(0) - 0x61): undefined,
            rankHint: rankHint ? (7 - (parseInt(rankHint) - 1)) : undefined,
            checkOrMate
        });

        // console.log(token);
        // console.log({moveNumber, pieceInfo, captureInfo, file, rank, checkOrMate});
    }
    return moveInfos;
}