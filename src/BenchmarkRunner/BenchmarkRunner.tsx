import { useEffect, useState } from "react";
import "./Benchmark.css";
import { availableBenchmarks, type BenchmarkRun } from "./types";
import { useBenchmarkForm } from "./useBenchmarkForm";
import { useBenchmarkStats } from "./useBenchmarkStats";


export const BenchmarkRunner = () => {
    const {runningBenchmark, benchmarkRuns, formState, onChangeFormValue, onSubmit, onCancel, removeRun} = useBenchmarkForm();
    const {averagesMap} = useBenchmarkStats(benchmarkRuns);
    
    const expectedDuration = averagesMap[formState.benchmarkName] * parseInt(formState.iterations);
    const expectedDurationSeconds = (expectedDuration / 1000);

    return <div>
        <form className="benchmark-form" onSubmit={onSubmit}>
            <div className="form-field">
                <label htmlFor="iterations">iterations</label>
                <input id="iterations" type="number" value={formState.iterations} onChange={e => onChangeFormValue("iterations", e)}/>
            </div>
            <div className="form-field">
                <label htmlFor="benchmarkName">benchmark</label>
                <select id="benchmarkName" value={formState.benchmarkName} onChange={e => onChangeFormValue("benchmarkName", e)}>
                    {availableBenchmarks.map(benchmarkName => 
                        <option key={benchmarkName} value={benchmarkName}>{benchmarkName}</option>
                    )}
                </select>
            </div>
            <div>
                {expectedDuration > 0 && <div className="form-field">
                        <div>Expected duration:</div>
                        <div>{expectedDurationSeconds.toFixed(2)} seconds</div>
                    </div>
                }
            </div>
            <button className="submit-button" disabled={runningBenchmark != null}>Run benchmark</button>
        </form>
        <div className="benchmark-run-history">
            {benchmarkRuns.length == 0 && runningBenchmark == null && <div>No benchmark history</div>}
            {runningBenchmark != null && <BenchmarkActiveItem runningBenchmark={runningBenchmark} onCancel={onCancel} />}
            {benchmarkRuns.map((benchmarkRun, index) => <BenchmarkRunItem key={benchmarkRun.start} benchmarkRun={benchmarkRun} onRemove={() => removeRun(index)} />)}
        </div>
    </div>;
};

type BenchmarkRunViewProps = {
    benchmarkRun: BenchmarkRun;
    onRemove: () => void;
}

const BenchmarkRunItem = ({benchmarkRun: {start, end, benchmarkName, status, iterations }, onRemove}: BenchmarkRunViewProps) => {
    const duration = end - start;
    const durationPerIteration = duration / iterations;

    return <>
        <div className="benchmark-date">{new Date(start).toLocaleString()}</div>
        <div className="benchmark-name">{benchmarkName}({iterations})</div>
        <div className={status === "cancelled" ? "benchmark-cancelled": ""}>{end - start}ms</div>
        <div>
            {status === "complete" && durationPerIteration.toFixed(2) + "ms"}
            {status === "cancelled" && "-"}
            <div className="delete-run" onClick={onRemove}>X</div>
       </div>
    </>
}

type BenchmarkActiveItemProps = {
    runningBenchmark: BenchmarkRun;
    onCancel: () => void;
};
const BenchmarkActiveItem = ({runningBenchmark: {benchmarkName, start, iterations}, onCancel}: BenchmarkActiveItemProps) => {
    const [end, setEnd] = useState(Date.now());

    useEffect(() => {
        setTimeout(() => setEnd(Date.now()), 50);
    })

    return <>
        <div className="benchmark-date">{new Date(start).toLocaleString()}</div>
        <div className="benchmark-name">{benchmarkName}({iterations})</div>
        <div className="benchmark-timer">{end - start}ms</div>
        <button className="benchmark-cancel" type="button" onClick={onCancel}>Cancel</button>
    </>
}