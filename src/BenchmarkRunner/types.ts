
export type BenchmarkFormData = {
    benchmarkName: string;
    iterations: string;
}

export type BenchmarkRun = {
    benchmarkName: string;
    start: number;
    end: number;
    duration: number;
    status: "complete" | "cancelled" | "running";
    iterations: number;
}

export const availableBenchmarks = [
    "getLegalMoves",
    "applyMove",
    "test1"
] as const;
