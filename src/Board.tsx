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
import { bishop, king, knight, pawn, queen, rook, emptyCell, type BoardCellState, type GameAction, type PlayerTurn } from './state';
import { useState } from 'react';


const GetCellStateComponent = (cellState: BoardCellState) => {
    if (cellState.isWhite) {
        switch(cellState.piece) {
            case emptyCell:
                return () => null;
            case king:
                return WhiteKing;
            case queen:
                return WhiteQueen;
            case rook:
                return WhiteRook;
            case bishop:
                return WhiteBishop;
            case knight:
                return WhiteKnight;
            case pawn:
                return WhitePawn;
        }
    }
    
    switch(cellState.piece) {
        case emptyCell:
            return () => null;
        case king:
            return BlackKing;
        case queen:
            return BlackQueen;
        case rook:
            return BlackRook;
        case bishop:
            return BlackBishop;
        case knight:
            return BlackKnight;
        case pawn:
            return BlackPawn;
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

    if (cellState.piece === emptyCell) {
        return <div className="board-cell" onClick={onClick}>
            <div className={boardCellClasses}/>
        </div>
    }
    return <div className="board-cell board-cell-piece" onClick={onClick}>
        <div className={boardCellClasses}/>
        <div draggable className="draggable-piece">
            <CellStateComponent />
        </div>
    </div>
}

const boardRows = Array(8).fill(0).map((_, i) => i);

type BoardProps = {
    boardState: BoardCellState[];
    isWhite: boolean;
    legalMoves: Array<number[]>;
    performMove: (move: GameAction) => void;
}

export const Board = ({boardState, isWhite, legalMoves, performMove}: BoardProps) => {
    const [selectedCell, setSelectedCell] = useState(-1);
    if (boardState.length != 8 * 8) {
        return "Invalid board size";
    }

    const legalDestinations = selectedCell >= 0 ? legalMoves[selectedCell]: [];

    return <div className="board">
        {boardRows.map(rowIndex => (
            <div key={rowIndex} className="board-row">
                {boardRows.map(columnIndex => {
                    const cellIndex = rowIndex * 8 + columnIndex;
                    const isLegalMove = legalDestinations.includes(cellIndex);
                    const isSelected = selectedCell === cellIndex;
                    return <BoardCell 
                        key={columnIndex} 
                        cellState={boardState[cellIndex]}
                        isSelected={isSelected}
                        isHighlighted={isLegalMove}
                        onClick={() => {
                            if (isSelected) {
                                setSelectedCell(-1);
                                return;
                            }
                            if (isLegalMove && boardState[selectedCell].piece != emptyCell) {
                                performMove({from: selectedCell, to: cellIndex, piece: boardState[selectedCell].piece})
                                return;
                            }
                            setSelectedCell(rowIndex * 8 + columnIndex);
                        }}
                    />
                })}
            </div>)
        )}
    </div>
}