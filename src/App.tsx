import { useState } from 'react'
import './App.css'
import { Board } from './Board'

const initialBoardState = [
  "RNBQKBNR",
  "PPPPPPPP",
  "OOOOOOOO",
  "OOOOOOOO",
  "OOOOOOOO",
  "OOOOOOOO",
  "pppppppp",
  "rnbqkbnr"
].join("");

function App() {
  const [boardState, setBoardState] = useState(initialBoardState);

  return <div className="app-container">
    <Board boardState={boardState}/>
  </div>;
}

export default App
