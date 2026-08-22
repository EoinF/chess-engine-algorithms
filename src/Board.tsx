import './Board.css';

type BoardCellProps = {
    piece: string;
}

const BoardCell = ({piece}: BoardCellProps) => {
    if (piece === "O") {
        return <div className="board-cell"/>
    }
    return <div className="board-cell">{piece}</div>
}

const boardRows = Array(8).fill(0).map((_, i) => i);

type BoardProps = {
    boardState: string;
}

export const Board = ({boardState}: BoardProps) => {
    if (boardState.length != 8 * 8) {
        return "Invalid board size";
    }

    return <div className="board">
        {boardRows.map(rowIndex => (
            <div className="board-row">
                {boardRows.map(columnIndex => (
                    <BoardCell key={rowIndex * 8 + columnIndex} piece={boardState[rowIndex * 8 + columnIndex]} />
                ))
                }
            </div>)

        )}
    </div>
}