import { useMemo } from "react";
import { availableBenchmarks, type BenchmarkRun } from "./types";

export const useBenchmarkStats = (benchmarkRuns: BenchmarkRun[]) => {
    return useMemo(() => {
        const durationTotalMap: Record<string, number> = {};
        const countsMap: Record<string, number> = {}
        for (const benchmarkName of availableBenchmarks) {
            durationTotalMap[benchmarkName] = 0;
            countsMap[benchmarkName] = 0;
        }

        const completedRuns = benchmarkRuns.filter(({status}) => status === "complete");

        for (const run of completedRuns) {    
            durationTotalMap[run.benchmarkName] += run.duration;
            countsMap[run.benchmarkName] += run.iterations;
        }

        const averagesMap: Record<string, number> = {};
        for (const benchmarkName of availableBenchmarks) {
            if (countsMap[benchmarkName] === 0) {
                averagesMap[benchmarkName] = 0;
                continue;
            }
            averagesMap[benchmarkName] = durationTotalMap[benchmarkName] / countsMap[benchmarkName];
        }

        return {averagesMap};
    }, [benchmarkRuns]);
}