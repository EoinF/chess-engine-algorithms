export type MoveInfo = {
    moveNumber: number;
    pieceInfo: string;
    captureInfo: boolean;
    file: number,
    rank: number;
    checkOrMate: string;
};

const tagRegex = /^\s*\[(\w+)\s*\"(.*)\"\s*\]\s*$/;
const commentRegex = /{.*?}/g;
const tokenizer = /\s*(.*?)\s+/g;
const moveExtractor = /(\d+)?\.*([PNBRQK]+)?(x)?(\w)(\d)/

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
    for (const info of moveInfos) {
        console.log(info);
    }
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
    let isAlternativeLine = false;
    let nextMoveNumber = 1;

    while((match = tokenizer.exec(normalisedLine)) != null) {
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
        const result =  moveExtractor.exec(token);
        if (result == null) {
            console.log("Unable to parse move", token);
            continue;
            // throw Error(`Unable to parse move ${token}`);
        }
        
        const [_, moveNumber, pieceInfo, captureInfo, file, rank, checkOrMate] = result;
        if (moveNumber != null) {
            nextMoveNumber = parseInt(moveNumber);
        }
        moveInfos.push({
            moveNumber: nextMoveNumber,
            pieceInfo, 
            captureInfo: captureInfo === "x", 
            file: 7 - (file.charCodeAt(0) - 0x61), // Subtract hex code for 'a'
            rank: 7 - (parseInt(rank) - 1),
            checkOrMate
        });

        // console.log(token);
        // console.log({moveNumber, pieceInfo, captureInfo, file, rank, checkOrMate});
    }
    return moveInfos;
}