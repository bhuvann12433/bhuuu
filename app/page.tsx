"use client";

import { useState, useEffect, useRef, useCallback } from "react";

import TopNavbar from "@/components/top-navbar";
import SudokuBoard from "@/components/sudoku-board";
import NumberPad from "@/components/number-pad";
import { DifficultySelector } from "@/components/difficulty-selector";
import { SolverActions } from "@/components/solver-actions";
import ComparisonUI from "@/components/comparison-ui";

import {
  generateSudokuPuzzle,
  copyBoard,
  geneticAlgorithmSolver,
  lsgaSolver,
  calculateFitness,
  type AlgorithmMetrics,
} from "@/lib/sudoku-algorithms";

export default function Page() {
  const [activeTab, setActiveTab] = useState<"classic" | "comparison">("classic");

  const [puzzle, setPuzzle] = useState<number[][]>([]);
  const [currentGrid, setCurrentGrid] = useState<number[][]>([]);
  const [difficulty, setDifficulty] = useState("medium");
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [solving, setSolving] = useState(false);
  const [solved, setSolved] = useState(false);

  const [gaMetrics, setGaMetrics] = useState<AlgorithmMetrics | null>(null);
  const [lsgaMetrics, setLsgaMetrics] = useState<AlgorithmMetrics | null>(null);

  // ---------------- Timer ----------------
  // Use browser-friendly types for client-side code
  const [time, setTime] = useState(0);
  const timerRef = useRef<number | null>(null);
  const isRunning = useRef(false);

  const startTimer = () => {
    if (isRunning.current) return;
    isRunning.current = true;

    // Use window.setInterval for correct browser return type (number)
    timerRef.current = window.setInterval(() => {
      setTime((t) => t + 100);
    }, 100);
  };

  const stopTimer = () => {
    isRunning.current = false;
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    setTime(0);
  };

  // Load puzzle on first render
  useEffect(() => {
    const p = generateSudokuPuzzle("medium");
    setPuzzle(p);
    setCurrentGrid(copyBoard(p));
  }, []);

  // Generate new puzzle
  const generateNewPuzzle = useCallback(() => {
    const p = generateSudokuPuzzle(difficulty as any);
    setPuzzle(p);
    setCurrentGrid(copyBoard(p));
    setSelectedCell(null);

    setGaMetrics(null);
    setLsgaMetrics(null);
    setSolved(false);

    resetTimer();
    setActiveTab("classic");
  }, [difficulty]);

  // Sudoku Input
  const handleCellChange = (row: number, col: number, value: number | null) => {
    // Guard: puzzle might not be loaded yet
    if (!puzzle || !puzzle.length) return;
    if (puzzle[row][col] !== 0) return;
    const newG = copyBoard(currentGrid);
    newG[row][col] = value ?? 0;
    setCurrentGrid(newG);
  };

  const handleNumberPadSelect = (num: number) => {
    if (selectedCell) handleCellChange(selectedCell.row, selectedCell.col, num);
  };

  const handleDelete = () => {
    if (!selectedCell) return;
    if (!puzzle || !puzzle.length) return;
    if (puzzle[selectedCell.row][selectedCell.col] !== 0) return;

    const newG = copyBoard(currentGrid);
    newG[selectedCell.row][selectedCell.col] = 0;
    setCurrentGrid(newG);
  };

  // ----------- Solve Puzzle (FIXED TIMER + NO AUTO SWITCH) ----------
  const solvePuzzle = async () => {
    resetTimer();
    startTimer();
    setSolving(true);

    // Allow timer effect to show up
    await new Promise((resolve) => setTimeout(resolve, 100));

    const gaRes = geneticAlgorithmSolver(puzzle, 1000, 50);
    const lsgaRes = lsgaSolver(puzzle, 1000, 50);

    stopTimer();

    setGaMetrics(gaRes.metrics);
    setLsgaMetrics(lsgaRes.metrics);

    if (lsgaRes.solution && calculateFitness(lsgaRes.solution) === 0) {
      setCurrentGrid(lsgaRes.solution);
      setSolved(true);
    } else if (gaRes.solution && calculateFitness(gaRes.solution) === 0) {
      setCurrentGrid(gaRes.solution);
      setSolved(true);
    }

    setSolving(false);

    // ❌ Do NOT auto-switch to comparison tab
  };

  // Reset Puzzle
  const resetPuzzle = () => {
    setCurrentGrid(copyBoard(puzzle));
    setSelectedCell(null);
    setGaMetrics(null);
    setLsgaMetrics(null);
    setSolved(false);

    resetTimer();
    setActiveTab("classic");
  };

  // Build comparison data
  const comparisonData = [
    gaMetrics && {
      algo: "Genetic Algorithm",
      avgGenerations: gaMetrics.generations,
      timeMs: gaMetrics.executionTime,
      memoryKb: 0,
    },
    lsgaMetrics && {
      algo: "LSGA Algorithm",
      avgGenerations: lsgaMetrics.generations,
      timeMs: lsgaMetrics.executionTime,
      memoryKb: 0,
    },
  ].filter(Boolean);

  const timerDisplay = (time / 1000).toFixed(1);

  return (
    <div className="min-h-screen bg-slate-50">
      <TopNavbar active={activeTab} onChange={setActiveTab} />

      {activeTab === "classic" && (
        <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DifficultySelector
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              onGenerateNew={generateNewPuzzle}
              disabled={solving}
            />

            <div className="text-xl font-semibold text-gray-700 pl-2">
              Time: <span className="text-blue-600">{timerDisplay}s</span>
            </div>

            <div className="bg-white rounded shadow p-4 flex justify-center">
              <SudokuBoard
                grid={currentGrid}
                original={puzzle}
                onCellChange={handleCellChange}
                onSelectCell={setSelectedCell}
                selectedCell={selectedCell}
              />
            </div>

            <div className="bg-white rounded shadow p-4">
              <NumberPad
                onNumberSelect={handleNumberPadSelect}
                onDelete={handleDelete}
                disabled={solving}
              />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded shadow p-4">
              <SolverActions
                onSolveClicked={solvePuzzle}
                onHint={() => {}}
                onReset={resetPuzzle}
                solving={solving}
              />
            </div>
          </aside>
        </main>
      )}

      {activeTab === "comparison" && <ComparisonUI data={comparisonData} />}
    </div>
  );
}
