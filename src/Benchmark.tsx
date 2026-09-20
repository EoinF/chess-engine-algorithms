import { useEffect, useState, type ChangeEvent } from "react";
import "./Benchmark.css";

type BenchmarkFormData = {
    benchmarkName: string;
    iterations: string;
}

type BenchmarkRun = {
    benchmarkName: string;
    start: number;
    end: number;
    status: "complete" | "cancelled";
    iterations: number;
}

type RunningBenchmark = {
    benchmark: Worker;
    benchmarkName: string;
    start: number;
    iterations: number;
}

const availableBenchmarks = [
    "getLegalMoves",
    "applyMove",
    "test1"
] as const;

const loadBenchmark = (benchmarkName: string) => new Worker(new URL("benchmarks/" + benchmarkName + ".ts", import.meta.url), {type: "module"})

const workersMap: Partial<Record<string, Worker>> = {};
for (const benchmarkName of availableBenchmarks) {
    workersMap[benchmarkName] = loadBenchmark(benchmarkName);
}

export const Benchmark = () => {
    const [state, setFormState] = useState<BenchmarkFormData>({
        benchmarkName: availableBenchmarks[0],
        iterations: "1"
    });
    const [runningBenchmark, setRunningBenchmark] = useState<RunningBenchmark | null>(null);
    const [benchmarkRuns, setBenchmarkRuns] = useState<BenchmarkRun[]>([]);
    const onChangeFormValue = (fieldName: string, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormState({...state, [fieldName]: e.target.value});
    }
    const onSubmitForm: React.SubmitEventHandler = async (e) => {
        const benchmark = workersMap[state.benchmarkName];
        const numIterations = Number(state.iterations);

        e.preventDefault();
        if (runningBenchmark != null || benchmark == null) {
            return false;
        }
        const startTime = Date.now();
        setRunningBenchmark({benchmarkName: state.benchmarkName, benchmark, start: startTime, iterations: numIterations});
        benchmark.onmessage = (() => {
            benchmark.onmessage = null;
            setRunningBenchmark(null)
            setBenchmarkRuns(runs => ([
                {
                    benchmarkName: state.benchmarkName, 
                    start: startTime, 
                    end: Date.now(), 
                    status: "complete",
                    iterations: numIterations,
                }, 
                ...runs]));
        });
        benchmark.postMessage({iterations: numIterations});
    };

    const onCancel = () => {
        if (runningBenchmark != null) {
            runningBenchmark.benchmark.terminate();
            // Reload benchmark after terminating
            workersMap[runningBenchmark.benchmarkName] = loadBenchmark(runningBenchmark.benchmarkName);
            
            setBenchmarkRuns(runs => ([
                {
                    benchmarkName: runningBenchmark.benchmarkName, 
                    start: runningBenchmark.start, 
                    end: Date.now(), 
                    status: "cancelled",
                    iterations: runningBenchmark.iterations,
                }, ...runs]));
            setRunningBenchmark(null);
        }
    }

    return <div>
        <form className="benchmark-form" onSubmit={onSubmitForm}>
            <div className="form-field">
                <label htmlFor="iterations">iterations</label>
                <input id="iterations" type="number" value={state.iterations} onChange={e => onChangeFormValue("iterations", e)}/>
            </div>
            <div className="form-field">
                <label htmlFor="benchmarkName">benchmark</label>
                <select id="benchmarkName" value={state.benchmarkName} onChange={e => onChangeFormValue("benchmarkName", e)}>
                    {availableBenchmarks.map(benchmarkName => 
                        <option key={benchmarkName} value={benchmarkName}>{benchmarkName}</option>
                    )}
                </select>
            </div>
            <button className="submit-button">Run benchmark</button>
        </form>
        <div className="benchmark-run-history">
            {runningBenchmark != null && <BenchmarkActiveItem runningBenchmark={runningBenchmark} onCancel={onCancel} />}
            {benchmarkRuns.map((benchmarkRun) => <BenchmarkRunItem key={benchmarkRun.start} benchmarkRun={benchmarkRun} />)}
        </div>
    </div>;
};

type BenchmarkRunViewProps = {
    benchmarkRun: BenchmarkRun;
}

const BenchmarkRunItem = ({benchmarkRun: {start, end, benchmarkName, status, iterations }}: BenchmarkRunViewProps) => {
    const duration = end - start;
    const durationPerIteration = duration / iterations
    return <div className="benchmark-run-item">
        <div>{benchmarkName}({iterations})</div>
        <div className={status === "cancelled" ? "benchmark-cancelled": ""}>{end - start}ms</div>
       {status === "complete" && <div>({durationPerIteration.toFixed(2)} ms)</div>}
    </div>
}

type BenchmarkActiveItemProps = {
    runningBenchmark: RunningBenchmark;
    onCancel: () => void;
};
const BenchmarkActiveItem = ({runningBenchmark: {benchmarkName, start, iterations}, onCancel}: BenchmarkActiveItemProps) => {
    const [end, setEnd] = useState(Date.now());

    useEffect(() => {
        setTimeout(() => setEnd(Date.now()), 50);
    })

    return <div className="benchmark-run-item">
        <div>{benchmarkName}({iterations})</div>
        <div className="benchmark-timer">{end - start}ms</div>
        <button className="benchmark-cancel" type="button" onClick={onCancel}>Cancel</button>
    </div>
}