import { useState, type Dispatch, type SetStateAction } from 'react';
import './App.css';
import { BenchmarkRunner } from './BenchmarkRunner/BenchmarkRunner';
import { HumanVsCpu } from './HumanVsCpu';

type AppMode = "human_vs_cpu" | "benchmark"
const modes: AppMode[] = ["human_vs_cpu", "benchmark"]


type AppHeaderProps = {
  selectedMode: AppMode;
  setMode: Dispatch<SetStateAction<AppMode>>;
}

const AppHeader = ({selectedMode, setMode}: AppHeaderProps) => {
  return <header className="modes-list">
    {modes.map(modeName => 
      <div
        className={modeName === selectedMode ? "selected-mode": "mode"}
        key={modeName}
        onClick={() => setMode(modeName)}
      >{modeName}</div>
    )}
  </header>
}

function App() {
  const [mode, setMode] = useState<AppMode>("human_vs_cpu");
  
  return <div className="app-container">
    <AppHeader selectedMode={mode} setMode={setMode}/>
    <div className="app-body">
      {mode === "benchmark" && <BenchmarkRunner/>}
      {mode === "human_vs_cpu" && <HumanVsCpu/>}
    </div>
  </div>;
}

export default App;
