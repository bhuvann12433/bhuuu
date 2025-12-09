"use client";

export default function NumberPad({ onNumberSelect, onDelete }: any) {
  return (
    <div className="w-full select-none">
      {/* Number Grid */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <button
            key={n}
            onClick={() => onNumberSelect(n)}
            className="
              h-16 rounded-lg 
              text-2xl font-semibold
              bg-[#eef3fb] text-[#2f5fb3]
              hover:bg-[#e0e8f6]
              active:scale-95 transition
              shadow-sm
            "
          >
            {n}
          </button>
        ))}
      </div>

      {/* Erase Button */}
      <button
        onClick={onDelete}
        className="
          w-full h-12 rounded-lg 
          text-lg font-semibold
          bg-red-100 text-red-600
          hover:bg-red-200
          active:scale-95 transition
        "
      >
        Erase
      </button>
    </div>
  );
}
