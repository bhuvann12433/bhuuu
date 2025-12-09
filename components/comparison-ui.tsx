"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import React from "react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Row = {
  algo: string;
  avgGenerations: number;
  timeMs: number;
  memoryKb: number;
};

export default function ComparisonUI({ data }: { data: Row[] | any[] }) {
  // If no data or empty, show placeholder
  if (!data || data.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 mt-6 text-gray-500">
        No comparison data yet. Run a solver (Solve Puzzle) to populate results.
      </div>
    );
  }

  // Normalize rows into expected shape (safety checks)
  const rows: Row[] = data.map((d: any) => {
    const g = Number(d.avgGenerations ?? d.generations ?? 0);
    const t = Number(d.timeMs ?? d.executionTime ?? 0);
    const m = Number(d.memoryKb ?? d.memoryKb ?? 0);
    return {
      algo: String(d.algo ?? d.name ?? "Algorithm"),
      avgGenerations: Number.isFinite(g) ? g : 0,
      timeMs: Number.isFinite(t) ? t : 0,
      memoryKb: Number.isFinite(m) ? m : 0,
    };
  });

  // Compute "best" values. For generations and memory smaller is better,
  // for generations maybe smaller = better (fewer generations) — keep logic consistent:
  const gens = rows.map((r) => r.avgGenerations);
  const times = rows.map((r) => r.timeMs);
  const mems = rows.map((r) => r.memoryKb);

  // when all zeros, Math.min returns 0 — we handle that display-wise
  const bestGen = gens.length ? Math.min(...gens) : 0;
  const bestTime = times.length ? Math.min(...times) : 0;
  const bestMem = mems.length ? Math.min(...mems) : 0;

  // Chart data
  const chartData = {
    labels: rows.map((r) => r.algo),
    datasets: [
      {
        label: "Avg Generations",
        data: rows.map((r) => r.avgGenerations),
        backgroundColor: rows.map((r) => (r.avgGenerations === bestGen ? "#3b82f6cc" : "#93c5fd")),
        yAxisID: "y",
      },
      {
        label: "Time (ms)",
        data: rows.map((r) => r.timeMs),
        backgroundColor: rows.map((r) => (r.timeMs === bestTime ? "#10b981cc" : "#6ee7b7")),
        yAxisID: "y",
      },
      {
        label: "Memory (KB)",
        data: rows.map((r) => r.memoryKb),
        backgroundColor: rows.map((r) => (r.memoryKb === bestMem ? "#facc15cc" : "#fde047")),
        yAxisID: "y",
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || "";
            const val = context.raw ?? 0;
            if (typeof val === "number") return `${label}: ${val.toFixed(2)}`;
            return `${label}: ${String(val)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 mt-6">
      <h2 className="text-2xl font-bold mb-4">Algorithm Comparison</h2>

      {/* Chart */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <Bar data={chartData as any} options={chartOptions} />
      </div>

      {/* Table */}
      <div className="overflow-auto bg-white rounded shadow">
        <table className="w-full border text-left">
          <thead>
            <tr className="bg-slate-200">
              <th className="p-2">Algorithm</th>
              <th className="p-2">Avg Generations</th>
              <th className="p-2">Time (ms)</th>
              <th className="p-2">Memory (KB)</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((d, i) => {
              const gen = d.avgGenerations;
              const time = d.timeMs;
              const mem = d.memoryKb;

              const genIsBest = gen === bestGen && (bestGen !== 0 || rows.length === 1);
              const timeIsBest = time === bestTime && (bestTime !== 0 || rows.length === 1);
              const memIsBest = mem === bestMem && (bestMem !== 0 || rows.length === 1);

              return (
                <tr key={d.algo + "-" + i} className="border-t">
                  <td className="p-3 font-semibold">{d.algo}</td>

                  <td className={`p-3 ${genIsBest ? "text-blue-600 font-bold" : "text-gray-700"}`}>
                    {Number.isFinite(gen) ? gen : 0}
                    {genIsBest && <span className="ml-2 text-blue-600">✓ Best</span>}
                  </td>

                  <td className={`p-3 ${timeIsBest ? "text-green-600 font-bold" : "text-gray-700"}`}>
                    {Number.isFinite(time) ? time.toFixed(2) : "0.00"}
                    {timeIsBest && <span className="ml-2 text-green-600">✓ Fastest</span>}
                  </td>

                  <td className={`p-3 ${memIsBest ? "text-yellow-600 font-bold" : "text-gray-700"}`}>
                    {Number.isFinite(mem) ? mem.toFixed(2) : "0.00"}
                    {memIsBest && <span className="ml-2 text-yellow-600">✓ Lowest</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
