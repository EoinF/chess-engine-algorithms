
export const toFileLetter = (fileNumber: number) => 
    String.fromCharCode('A'.charCodeAt(0) + fileNumber);

export const cellIndexToBoardLabel = (cellIndex: number) =>
    `${toFileLetter(cellIndex % 8)}${1 + Math.floor(cellIndex / 8)}`