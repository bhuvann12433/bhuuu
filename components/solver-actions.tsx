"use client";

import React from "react";

export function SolverActions({
  onSolveClicked,
  onHint,
  onReset,
  solving,
  disabled,
}: {
  onSolveClicked: () => void;
  onHint: () => void;
  onReset: () => void;
  solving?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-3">
      <button onClick={onSolveClicked} disabled={disabled} className="w-full py-3 bg-slate-900 text-white rounded-md">Solve Puzzle</button>
      <div className="grid grid-cols-2 gap-3">
        <button onClick={onHint} disabled={disabled} className="py-2 bg-white border rounded">Hint</button>
        <button onClick={onReset} className="py-2 bg-white border rounded">Reset</button>
      </div>
    </div>
  );
}
