import { FaPalette, FaLock, FaLockOpen } from "react-icons/fa";

const PRESET_COLORS = {
  pet: [
    "#FFA500", // Orange
    "#808080", // Gray
    "#000000", // Black
    "#FFFFFF", // White
    "#8B4513", // Brown
    "#FFD700", // Golden
    "#FFC0CB", // Pink
    "#A0522D", // Sienna
  ],
  background: [
    "#F0F0F0", // Light Gray
    "#FFE4E1", // Misty Rose
    "#E6E6FA", // Lavender
    "#F0FFF0", // Honeydew
    "#FFF0F5", // Lavender Blush
    "#F5F5DC", // Beige
    "#E0FFFF", // Light Cyan
    "#FFF8DC", // Cornsilk
  ],
};

function ColorPicker({
  currentColor,
  currentBackgroundColor,
  onColorChange,
  onBackgroundColorChange,
  disabled,
  isColorLocked,
}) {
  return (
    <div className="p-4 bg-gray-100 rounded-lg space-y-4">
      {/* Pet Color Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FaPalette className="text-purple-500" />
            <span className="text-sm font-medium">Cor do Gatinho</span>
          </div>
          {isColorLocked ? (
            <div className="flex items-center gap-1 text-gray-500">
              <FaLock size={12} />
              <span className="text-xs">Cor definida</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-yellow-600">
              <FaLockOpen size={12} />
              <span className="text-xs">Escolha uma vez</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_COLORS.pet.map((color) => (
            <button
              key={color}
              onClick={() => !isColorLocked && onColorChange(color)}
              disabled={disabled || isColorLocked}
              className={`
                w-10 h-10 rounded-full border-2 transition-all duration-200
                ${
                  currentColor === color
                    ? "scale-110 border-purple-500"
                    : "border-gray-200"
                }
                ${
                  isColorLocked
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105"
                }
              `}
              style={{ backgroundColor: color }}
              title={isColorLocked ? "Cor já definida" : "Escolher cor"}
            />
          ))}
        </div>
      </div>

      {/* Background Color Section */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <FaPalette className="text-purple-500" />
          <span className="text-sm font-medium">Cor do Fundo</span>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {PRESET_COLORS.background.map((color) => (
            <button
              key={color}
              onClick={() => onBackgroundColorChange(color)}
              disabled={disabled}
              className={`
                w-10 h-10 rounded-full border-2 transition-all duration-200
                ${
                  currentBackgroundColor === color
                    ? "scale-110 border-purple-500"
                    : "border-gray-200"
                }
                hover:scale-105
              `}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ColorPicker;
