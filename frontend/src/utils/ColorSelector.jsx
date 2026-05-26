import React from "react";

const colores = [
  { name: "Blanco", hex: "#ffffff" },
  { name: "Negro", hex: "#1f2937" },
  { name: "Gris", hex: "#9ca3af" },
  { name: "Rojo", hex: "#ff4d4f" },
  { name: "Azul", hex: "#4f46e5" },
  { name: "Verde", hex: "#22c55e" },
  { name: "Amarillo", hex: "#f59e0b" },
  { name: "Naranja", hex: "#f97316" },
  { name: "Rosa", hex: "#ec4899" },
  { name: "Morado", hex: "#8b5cf6" },
  { name: "Cian", hex: "#06b6d4" },
  { name: "Dorado", hex: "#d4af37" },
];

const ColorSelector = ({ selectedColor, onSelect }) => {
  const isCustomSelected = !colores.find((c) => c.hex === selectedColor);

  return (
    <div className="flex flex-wrap justify-start items-center gap-3">
      {colores.map((c) => (
        <button
          key={c.name}
          title={c.name}
          onClick={() => onSelect(c.hex)}
          className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${selectedColor === c.hex
            ? 'scale-125 border-primary-600 dark:border-primary-400 shadow-md'
            : 'border-gray-200 dark:border-gray-700'
            }`}
          style={{ backgroundColor: c.hex }}
        />
      ))}

      <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mx-1 transition-colors" />

      <label
        title="Color personalizado"
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all hover:scale-110
          ${isCustomSelected
            ? 'scale-125 border-primary-600 dark:border-primary-400 shadow-md'
            : 'border-dashed border-gray-400 dark:border-gray-500 hover:border-primary-500 bg-gray-50 dark:bg-gray-800'
          }`}
        style={isCustomSelected ? { backgroundColor: selectedColor } : {}}
      >
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => onSelect(e.target.value)}
          className="sr-only"
        />

        {!isCustomSelected && (
          <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
        )}
      </label>
    </div>
  );
};

export default ColorSelector;