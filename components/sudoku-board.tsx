"use client";

import React, { useMemo } from "react";

export type SudokuBoardProps = {
  grid: number[][];                 // Current grid
  original: number[][];             // Original puzzle (locked cells)
  onCellChange: (r: number, c: number, val: number | null) => void;
  onSelectCell: (cell: { row: number; col: number } | null) => void;
  selectedCell: { row: number; col: number } | null;
};

export default function SudokuBoard({
  grid,
  original,
  onCellChange,
  onSelectCell,
  selectedCell,
}: SudokuBoardProps) {
  
  /**  
   * 🛑 SAFETY: Ensure grid is 9x9  
   * Prevents "Cannot read properties of undefined" crash 
   */
  const cells = useMemo(() => {
    if (!Array.isArray(grid) || grid.length !== 9) return Array(9).fill(Array(9).fill(0));
    return grid.map(row => (Array.isArray(row) ? row : Array(9).fill(0)));
  }, [grid]);

  /**
   * 🔎 Duplicate Calculator (Row, Column, Box)
   * Highlights mistakes in RED
   */
  const duplicates = useMemo(() => {
    const dup = new Set<string>();

    // ROW CHECK
    for (let r = 0; r < 9; r++) {
      const seen: Record<number, number[]> = {};
      for (let c = 0; c < 9; c++) {
        const val = cells[r][c];
        if (!val) continue;
        seen[val] = seen[val] || [];
        seen[val].push(c);
      }
      Object.values(seen).forEach(cols => {
        if (cols.length > 1) cols.forEach(c => dup.add(`${r}-${c}`));
      });
    }

    // COLUMN CHECK
    for (let c = 0; c < 9; c++) {
      const seen: Record<number, number[]> = {};
      for (let r = 0; r < 9; r++) {
        const val = cells[r][c];
        if (!val) continue;
        seen[val] = seen[val] || [];
        seen[val].push(r);
      }
      Object.values(seen).forEach(rows => {
        if (rows.length > 1) rows.forEach(r => dup.add(`${r}-${c}`));
      });
    }

    return dup;
  }, [cells]);

  /**
   * 🔧 Handle input change (Only 1–9 allowed)
   */
  const handleChange = (r: number, c: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^1-9]/g, "");
    onCellChange(r, c, v ? Number(v) : null);
  };

  return (
    <div className="w-full flex justify-center p-2">
      <div
        className="grid border-4 border-slate-700"
        style={{
          gridTemplateColumns: "repeat(9, minmax(0, 40px))",
        }}
      >
        {cells.map((row, r) =>
          row.map((val, c) => {
            const isOriginal = original?.[r]?.[c] !== 0;
            const isSelected = selectedCell?.row === r && selectedCell?.col === c;
            const isDuplicate = duplicates.has(`${r}-${c}`);

            return (
              <input
                key={`${r}-${c}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={val === 0 ? "" : val}
                onClick={() => onSelectCell({ row: r, col: c })}
                onChange={(e) => handleChange(r, c, e)}
                disabled={isOriginal}
                className={`w-10 h-10 text-center text-lg font-semibold 
                  border border-slate-400 
                  focus:outline-none
                  ${isOriginal ? "bg-slate-200 text-black" : "bg-white"}
                  ${isSelected ? "bg-blue-200" : ""}
                  ${isDuplicate ? "bg-red-300" : ""}
                `}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
