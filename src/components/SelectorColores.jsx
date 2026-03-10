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

const SelectorColores = ({ selectedColor, onSelect }) => {
  return (
    // CAMBIO AQUÍ: justify-start en lugar de justify-center para que se alinee a la izquierda
    <div className="flex flex-wrap justify-start items-center gap-3">
      {colores.map((c) => (
        <button
          key={c.name}
          title={c.name}
          onClick={() => onSelect(c.hex)}
          className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
            selectedColor === c.hex ? 'scale-125 border-primary-600 shadow-md' : 'border-gray-200'
          }`}
          style={{ backgroundColor: c.hex }}
        />
      ))}

      {/* Divisor visual opcional */}
      <div className="w-px h-8 bg-gray-200 mx-1" />

      {/* Input de color personalizado */}
      <div className="relative group flex items-center">
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => onSelect(e.target.value)}
          className="w-10 h-8 rounded-lg cursor-pointer border-2 border-gray-200 p-0 overflow-hidden"
          title="Color personalizado"
        />
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Personalizado
        </span>
      </div>
    </div>
  );
};

export default SelectorColores;