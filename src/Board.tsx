import './Board.css';

import BlackKing from "./assets/pieces/Chess_kdt45.svg?react";
import BlackQueen from "./assets/pieces/Chess_qdt45.svg?react";
import BlackRook from "./assets/pieces/Chess_rdt45.svg?react";
import BlackBishop from "./assets/pieces/Chess_bdt45.svg?react";
import BlackKnight from "./assets/pieces/Chess_ndt45.svg?react";
import BlackPawn from "./assets/pieces/Chess_pdt45.svg?react";
import WhiteKing from "./assets/pieces/Chess_klt45.svg?react";
import WhiteQueen from "./assets/pieces/Chess_qlt45.svg?react";
import WhiteRook from "./assets/pieces/Chess_rlt45.svg?react";
import WhiteBishop from "./assets/pieces/Chess_blt45.svg?react";
import WhiteKnight from "./assets/pieces/Chess_nlt45.svg?react";
import WhitePawn from "./assets/pieces/Chess_plt45.svg?react";
import { blackBishop, blackKing, blackKnight, blackPawn, blackQueen, blackRook, emptyCell, whiteBishop, whiteKing, whiteKnight, whitePawn, whiteQueen, whiteRook, type BoardCellState, type GameAction, type PlayerTurn } from './state';
import { useState } from 'react';


const GetCellStateComponent = (cellState: BoardCellState) => {
    switch(cellState) {
        case emptyCell:
            return () => null;
        case blackKing:
            return BlackKing;
        case blackQueen:
            return BlackQueen;
        case blackRook:
            return BlackRook;
        case blackBishop:
            return BlackBishop;
        case blackKnight:
            return BlackKnight;
        case blackPawn:
            return BlackPawn;
        case whiteKing:
            return WhiteKing;
        case whiteQueen:
            return WhiteQueen;
        case whiteRook:
            return WhiteRook;
        case whiteBishop:
            return WhiteBishop;
        case whiteKnight:
            return WhiteKnight;
        case whitePawn:
            return WhitePawn;
    }
}

type BoardCellProps = {
    cellState: BoardCellState;
    onClick: () => void;
    isSelected: boolean;
    isHighlighted: boolean;
}

const BoardCell = ({cellState, onClick, isSelected, isHighlighted}: BoardCellProps) => {
    const CellStateComponent = GetCellStateComponent(cellState);

    const boardCellClasses = [
        "cell-overlay",
        isSelected ? "cell-selected": "",
        isHighlighted ? "cell-highlighted": ""
    ].join(" ");

    if (cellState === emptyCell) {
        return <div className="board-cell" onClick={onClick}>
            <div className={boardCellClasses}/>
        </div>
    }
    return <div className="board-cell" onClick={onClick}>
        <div className={boardCellClasses}/>
        <div draggable className="draggable-piece">
            <CellStateComponent />
        </div>
    </div>
}

const boardRows = Array(8).fill(0).map((_, i) => i);

type BoardProps = {
    boardState: string;
    playerTurn: PlayerTurn;
    legalMoves: Array<GameAction[]>;
}

export const Board = ({boardState, playerTurn, legalMoves}: BoardProps) => {
    const [selectedCell, setSelectedCell] = useState(-1);
    if (boardState.length != 8 * 8) {
        return "Invalid board size";
    }

    const legalDestinations = selectedCell >= 0 ? legalMoves[selectedCell]: [];

    return <div className="board">
        {boardRows.map(rowIndex => (
            <div key={rowIndex} className="board-row">
                {boardRows.map(columnIndex => (
                    <BoardCell 
                        key={columnIndex} 
                        cellState={boardState[rowIndex * 8 + columnIndex] as BoardCellState}
                        isSelected={selectedCell === (rowIndex * 8 + columnIndex)}
                        isHighlighted={legalDestinations.some(({to}) => to === (rowIndex * 8 + columnIndex))}
                        onClick={() => setSelectedCell(rowIndex * 8 + columnIndex)}
                    />
                ))
                }
            </div>)

        )}
    </div>
}