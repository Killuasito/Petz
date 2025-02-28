import {
  FaHamburger,
  FaSmile,
  FaBatteryFull,
  FaHeartbeat,
} from "react-icons/fa";

function StatusBars({ petState }) {
  const getBarColor = (value, type) => {
    const baseColors = {
      hunger: {
        high: "from-green-400 to-green-500",
        medium: "from-yellow-400 to-yellow-500",
        low: "from-red-400 to-red-500",
      },
      happiness: {
        high: "from-pink-400 to-pink-500",
        medium: "from-orange-400 to-orange-500",
        low: "from-red-400 to-red-500",
      },
      energy: {
        high: "from-blue-400 to-blue-500",
        medium: "from-indigo-400 to-indigo-500",
        low: "from-purple-400 to-purple-500",
      },
      health: {
        high: "from-emerald-400 to-emerald-500",
        medium: "from-yellow-400 to-yellow-500",
        low: "from-red-400 to-red-500",
      },
    };

    const colors = baseColors[type] || baseColors.health;

    if (value > 70) return `bg-gradient-to-r ${colors.high}`;
    if (value > 30) return `bg-gradient-to-r ${colors.medium}`;
    return `bg-gradient-to-r ${colors.low}`;
  };

  const StatusBar = ({ icon, label, value, type }) => (
    <div
      className={`
        backdrop-blur-sm bg-white/50 p-3 rounded-lg shadow-sm 
        hover:shadow-md transition-all duration-300
        ${value < 30 ? "ring-2 ring-red-400 ring-opacity-50" : ""}
      `}
    >
      <div className="flex justify-between mb-1 items-center">
        <span className="text-sm font-medium text-gray-700 flex items-center">
          {icon}
          {label}
        </span>
        <span className="text-sm font-medium text-gray-700">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
        <div
          className={`h-3 rounded-full transition-all duration-500 ${getBarColor(
            value,
            type
          )} 
            ${value < 30 ? "animate-pulse" : ""}`}
          style={{
            width: `${value}%`,
            boxShadow: value > 70 ? "0 0 8px rgba(34, 197, 94, 0.5)" : "none",
          }}
        ></div>
      </div>
    </div>
  );

  const stats = [
    {
      icon: <FaHamburger className="mr-2 text-orange-500" />,
      label: "Fome",
      value: petState.hunger,
      type: "hunger",
    },
    {
      icon: <FaSmile className="mr-2 text-pink-500" />,
      label: "Felicidade",
      value: petState.happiness,
      type: "happiness",
    },
    {
      icon: <FaBatteryFull className="mr-2 text-blue-500" />,
      label: "Energia",
      value: petState.energy,
      type: "energy",
    },
    {
      icon: <FaHeartbeat className="mr-2 text-emerald-500" />,
      label: "Saúde",
      value: petState.health,
      type: "health",
    },
  ];

  return (
    <div className="grid gap-3">
      {stats.map((stat, index) => (
        <StatusBar key={index} {...stat} />
      ))}
    </div>
  );
}

export default StatusBars;
