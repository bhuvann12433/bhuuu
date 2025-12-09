"use client";

import React from "react";

export default function TopNavbar({
  active,
  onChange,
}: {
  active: "classic" | "comparison";
  onChange: (tab: "classic" | "comparison") => void;
}) {
  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="text-2xl font-extrabold text-slate-800">
          Sudoku solver
        </div>

        <nav className="flex gap-8 items-end">
          <button
            onClick={() => onChange("classic")}
            className={`pb-2 ${
              active === "classic"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            Classic
          </button>

          <button
            onClick={() => onChange("comparison")}
            className={`pb-2 ${
              active === "comparison"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            Comparison
          </button>
        </nav>
      </div>
    </header>
  );
}
