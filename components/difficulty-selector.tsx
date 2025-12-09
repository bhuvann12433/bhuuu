"use client";

import React from "react";

export function DifficultySelector({
  difficulty,
  onDifficultyChange,
  onGenerateNew,
  disabled,
}: {
  difficulty: string;
  onDifficultyChange: (d: string) => void;
  onGenerateNew: () => void;
  disabled?: boolean;
}) {
  const levels = ["Easy","Medium","Hard","Expert","Master","Extreme"];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        {levels.map((lvl) => (
          <button
            key={lvl}
            onClick={() => onDifficultyChange(lvl.toLowerCase())}
            disabled={disabled}
            className={`px-3 py-2 rounded-md ${difficulty === lvl.toLowerCase() ? "bg-blue-50 border border-blue-300 text-blue-700" : "bg-white border"}`}
          >
            {lvl}
          </button>
        ))}
      </div>
      <div>
        <button
          onClick={onGenerateNew}
          disabled={disabled}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md shadow"
        >
          New Game
        </button>
      </div>
    </div>
  );
}
