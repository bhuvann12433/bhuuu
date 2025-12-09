"use client"

import type React from "react"
import type { AlgorithmMetrics } from "@/lib/sudoku-algorithms"

interface MetricsComparisonProps {
  gaMetrics: AlgorithmMetrics | null
  lsgaMetrics: AlgorithmMetrics | null
  solving: boolean
}

export const MetricsComparison: React.FC<MetricsComparisonProps> = ({ gaMetrics, lsgaMetrics, solving }) => {
  if (solving) {
    return (
      <div className="text-center py-16">
        <div className="inline-block mb-4">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 font-semibold text-lg">Running both algorithms...</p>
      </div>
    )
  }

  if (!gaMetrics || !lsgaMetrics) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-600 text-lg">Click "Solve Puzzle" to compare algorithms</p>
      </div>
    )
  }

  const lsgaFaster = lsgaMetrics.executionTime < gaMetrics.executionTime
  const lsgaFewerGens = lsgaMetrics.generations < gaMetrics.generations
  const lsgaFewerEvals = lsgaMetrics.fitnessEvaluations < gaMetrics.fitnessEvaluations
  const lsgaWins = [lsgaFaster, lsgaFewerGens, lsgaFewerEvals].filter(Boolean).length

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-black mb-2">Performance Results</h2>
        <p className="text-gray-600">Comparing Genetic Algorithm vs LSGA</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GA Card */}
        <div className="rounded-xl border-2 border-gray-200 p-6 bg-gradient-to-br from-gray-50 to-white hover:shadow-lg transition-all">
          <h3 className="font-bold text-lg text-black mb-6 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gray-400"></span>
            Genetic Algorithm
          </h3>
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Generations</p>
              <p className="text-3xl font-bold text-black">{gaMetrics.generations}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Fitness Evaluations</p>
              <p className="text-3xl font-bold text-black">{gaMetrics.fitnessEvaluations}</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Execution Time</p>
              <p className="text-3xl font-bold text-black">{gaMetrics.executionTime.toFixed(2)}ms</p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Best Fitness</p>
              <p className={`text-3xl font-bold ${gaMetrics.bestFitness === 0 ? "text-green-600" : "text-red-600"}`}>
                {gaMetrics.bestFitness}
              </p>
            </div>
          </div>
        </div>

        {/* LSGA Card */}
        <div className="rounded-xl border-2 border-black p-6 bg-gradient-to-br from-black to-gray-900 hover:shadow-2xl transition-all">
          <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-400"></span>
            LSGA Algorithm
          </h3>
          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-300 mb-1">Generations</p>
              <p className="text-3xl font-bold text-white">{lsgaMetrics.generations}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-300 mb-1">Fitness Evaluations</p>
              <p className="text-3xl font-bold text-white">{lsgaMetrics.fitnessEvaluations}</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-300 mb-1">Execution Time</p>
              <p className="text-3xl font-bold text-white">{lsgaMetrics.executionTime.toFixed(2)}ms</p>
            </div>
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <p className="text-sm text-gray-300 mb-1">Best Fitness</p>
              <p className={`text-3xl font-bold ${lsgaMetrics.bestFitness === 0 ? "text-green-400" : "text-red-400"}`}>
                {lsgaMetrics.bestFitness}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Winner Section */}
      <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-8">
        <h3 className="font-bold text-lg text-black mb-6">Winner: LSGA Algorithm</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`rounded-lg p-4 text-center ${lsgaFaster ? "bg-white border-2 border-green-500 shadow-md" : "bg-gray-100 border border-gray-300"}`}
          >
            <p className="text-sm font-semibold text-gray-700 mb-2">Speed</p>
            <p className={`text-2xl font-bold ${lsgaFaster ? "text-green-600" : "text-gray-600"}`}>
              {lsgaFaster ? "LSGA" : "GA"} Faster
            </p>
            <p className="text-xs text-gray-600 mt-2">
              {Math.abs(gaMetrics.executionTime - lsgaMetrics.executionTime).toFixed(2)}ms faster
            </p>
          </div>
          <div
            className={`rounded-lg p-4 text-center ${lsgaFewerGens ? "bg-white border-2 border-green-500 shadow-md" : "bg-gray-100 border border-gray-300"}`}
          >
            <p className="text-sm font-semibold text-gray-700 mb-2">Generations</p>
            <p className={`text-2xl font-bold ${lsgaFewerGens ? "text-green-600" : "text-gray-600"}`}>
              {lsgaFewerGens ? "LSGA" : "GA"} Better
            </p>
            <p className="text-xs text-gray-600 mt-2">
              {Math.abs(gaMetrics.generations - lsgaMetrics.generations)} fewer
            </p>
          </div>
          <div
            className={`rounded-lg p-4 text-center ${lsgaFewerEvals ? "bg-white border-2 border-green-500 shadow-md" : "bg-gray-100 border border-gray-300"}`}
          >
            <p className="text-sm font-semibold text-gray-700 mb-2">Evaluations</p>
            <p className={`text-2xl font-bold ${lsgaFewerEvals ? "text-green-600" : "text-gray-600"}`}>
              {lsgaFewerEvals ? "LSGA" : "GA"} Better
            </p>
            <p className="text-xs text-gray-600 mt-2">
              {Math.abs(gaMetrics.fitnessEvaluations - lsgaMetrics.fitnessEvaluations)} fewer
            </p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm font-semibold text-gray-700">
            LSGA wins in <span className="text-green-600 font-bold">{lsgaWins}/3</span> categories
          </p>
        </div>
      </div>
    </div>
  )
}
