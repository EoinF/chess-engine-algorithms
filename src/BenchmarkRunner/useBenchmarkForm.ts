import { useState, type ChangeEvent } from "react";
import { availableBenchmarks, type BenchmarkFormData, type BenchmarkRun } from "./types";
import { useBenchmarkHistory } from "./useBenchmarkHistory";

const benchmarksFolder = "/src/chess/benchmarks/";

const loadBenchmark = (benchmarkName: string) => new Worker(new URL(benchmarksFolder + benchmarkName + ".ts", import.meta.url), {type: "module"})

const workersMap: Partial<Record<string, Worker>> = {};
for (const benchmarkName of availableBenchmarks) {
    workersMap[benchmarkName] = loadBenchmark(benchmarkName);
}

export const useBenchmarkForm = () => {
    const [formState, setFormState] = useState<BenchmarkFormData>({
        benchmarkName: availableBenchmarks[0],
        iterations: "1"
    });
    const [runningBenchmark, setRunningBenchmark] = useState<BenchmarkRun | null>(null);
    const [benchmarkRuns, setBenchmarkRuns] = useBenchmarkHistory();

    const onChangeFormValue = (fieldName: string, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormState({...formState, [fieldName]: e.target.value});
    }
    const onSubmit: React.SubmitEventHandler = async (e) => {
        const benchmark = workersMap[formState.benchmarkName];
        const numIterations = Number(formState.iterations);

        e.preventDefault();
        if (runningBenchmark != null || benchmark == null) {
            return false;
        }
        const startTime = Date.now();
        setRunningBenchmark({benchmarkName: formState.benchmarkName, start: startTime, duration: -1, end: -1, iterations: numIterations, status: "running"});
        benchmark.onmessage = (() => {
            benchmark.onmessage = null;
            setRunningBenchmark(null);
            const endTime = Date.now();
            setBenchmarkRuns(runs => ([
                {
                    benchmarkName: formState.benchmarkName, 
                    start: startTime, 
                    end: endTime,
                    duration: endTime - startTime,
                    status: "complete",
                    iterations: numIterations,
                },
                ...runs]));
        });
        benchmark.postMessage({iterations: numIterations});
    };

    const onCancel = () => {
        if (runningBenchmark == null) {
            return;
        }
        workersMap[runningBenchmark.benchmarkName]?.terminate();
        // Reload benchmark script after terminating
        workersMap[runningBenchmark.benchmarkName] = loadBenchmark(runningBenchmark.benchmarkName);
        const endTime = Date.now();

        setBenchmarkRuns(runs => ([
            {
                benchmarkName: runningBenchmark.benchmarkName, 
                start: runningBenchmark.start, 
                end: endTime,
                duration: endTime - runningBenchmark.start,
                status: "cancelled",
                iterations: runningBenchmark.iterations,
            }, ...runs]));
        setRunningBenchmark(null);    
    }

    const removeRun = (index: number) => {
        setBenchmarkRuns(runs => runs.toSpliced(index, 1));
    }

    return {benchmarkRuns, runningBenchmark, formState, onChangeFormValue, onSubmit, onCancel, removeRun}
}