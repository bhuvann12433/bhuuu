"use client"

import type React from "react"
import type { AlgorithmMetrics } from "@/lib/sudoku-algorithms"

interface AlgorithmMetricsProps {
  lsgaMetrics?: AlgorithmMetrics
  backtrackingMetrics?: AlgorithmMetrics
}

export const AlgorithmMetricsDisplay: React.FC<AlgorithmMetricsProps> = ({ lsgaMetrics, backtrackingMetrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {lsgaMetrics && (
        <div className="p-4 rounded-lg bg-card border border-border">
          <h3 className="font-bold text-lg text-primary mb-3">LSGA Algorithm</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Generations:</span>
              <span className="font-semibold">{lsgaMetrics.generations}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Iterations:</span>
              <span className="font-semibold">{lsgaMetrics.iterations}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fitness Evaluations:</span>
              <span className="font-semibold">{lsgaMetrics.fitnessEvaluations}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Execution Time:</span>
              <span className="font-semibold">{lsgaMetrics.executionTime.toFixed(2)}ms</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-muted-foreground">Best Fitness:</span>
              <span className={`font-semibold ${lsgaMetrics.bestFitness === 0 ? "text-green-600" : "text-orange-600"}`}>
                {lsgaMetrics.bestFitness}
              </span>
            </div>
          </div>
        </div>
      )}

      {backtrackingMetrics && (
        <div className="p-4 rounded-lg bg-card border border-border">
          <h3 className="font-bold text-lg text-primary mb-3">Backtracking Algorithm</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Generations:</span>
              <span className="font-semibold">{backtrackingMetrics.generations}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Iterations:</span>
              <span className="font-semibold">{backtrackingMetrics.iterations}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Fitness Evaluations:</span>
              <span className="font-semibold">{backtrackingMetrics.fitnessEvaluations}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Execution Time:</span>
              <span className="font-semibold">{backtrackingMetrics.executionTime.toFixed(2)}ms</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-border">
              <span className="text-muted-foreground">Best Fitness:</span>
              <span
                className={`font-semibold ${backtrackingMetrics.bestFitness === 0 ? "text-green-600" : "text-orange-600"}`}
              >
                {backtrackingMetrics.bestFitness}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
