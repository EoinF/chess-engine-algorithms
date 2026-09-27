import { useEffect, useState } from "react";
import type { BenchmarkRun } from "./types";

export const useBenchmarkHistory = () => {
    const [benchmarkRuns, setBenchmarkRuns] = useState<BenchmarkRun[]>([]);

    useEffect(() => {
        const history = localStorage.getItem("benchmark-history");
        if (history != null) {
            setBenchmarkRuns(JSON.parse(history));
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("benchmark-history", JSON.stringify(benchmarkRuns));
    })

    return [benchmarkRuns, setBenchmarkRuns] as const;
}
