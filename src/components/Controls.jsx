import { useState } from "react";
import { FOODS, ACTIVITIES, CARE_ACTIONS } from "../constants/gameData";
import MiniGames from "./MiniGames";
import {
  FaUtensils,
  FaGamepad,
  FaBed,
  FaMedkit,
  FaCoins,
  FaBath,
  FaBrush,
  FaPencilAlt,
  FaSave,
  FaSyncAlt,
} from "react-icons/fa";
import ColorPicker from "./ColorPicker";

function Controls({
  onFeed,
  onPlay,
  onCare,
  onSleep,
  coins,
  energy,
  cleanliness,
  onReset,
  onChangeName,
  petName,
  isDead,
  isSleeping,
  onGameWin,
  onColorChange,
  currentColor,
  onBackgroundColorChange,
  currentBackgroundColor,
  isColorLocked,
  ...props
}) {
  const [isNameEditing, setIsNameEditing] = useState(false);
  const [newName, setNewName] = useState(petName);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showGames, setShowGames] = useState(false);

  const handleNameSubmit = () => {
    if (newName.trim()) {
      onChangeName(newName);
    }
    setIsNameEditing(false);
  };

  const renderSubMenu = () => {
    switch (activeMenu) {
      case "food":
        return (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.entries(FOODS).map(([key, food]) => (
              <button
                key={key}
                onClick={() => onFeed(key)}
                disabled={coins < food.cost}
                className="p-2 bg-orange-100 rounded-lg text-sm hover:bg-orange-200
                  flex flex-col items-center gap-1 disabled:opacity-50"
              >
                <span>{food.name}</span>
                <span className="text-xs flex items-center">
                  <FaCoins className="text-yellow-500 mr-1" />
                  {food.cost}
                </span>
              </button>
            ))}
          </div>
        );
      case "play":
        return (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.entries(ACTIVITIES).map(([key, activity]) => (
              <button
                key={key}
                onClick={() => onPlay(key)}
                disabled={energy < Math.abs(activity.energy)}
                className="p-2 bg-green-100 rounded-lg text-sm hover:bg-green-200
                  flex flex-col items-center gap-1 disabled:opacity-50"
              >
                <span>{activity.name}</span>
                <span className="text-xs">Energia: {activity.energy}</span>
              </button>
            ))}
          </div>
        );
      case "care":
        return (
          <div className="grid grid-cols-2 gap-2 mt-2">
            {Object.entries(CARE_ACTIONS).map(([key, action]) => (
              <button
                key={key}
                onClick={() => onCare(key)}
                className="p-2 bg-blue-100 rounded-lg text-sm hover:bg-blue-200
                  flex flex-col items-center gap-1"
              >
                <span>{action.name}</span>
                <span className="text-xs">Saúde: +{action.health}</span>
              </button>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Name editing section */}
      <div className="backdrop-blur-sm bg-white/50 p-3 rounded-lg">
        {isNameEditing ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-purple-500
                bg-white/75 backdrop-blur-sm"
              maxLength={20}
              placeholder="Nome do seu pet"
            />
            <button
              onClick={handleNameSubmit}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg
                hover:bg-purple-700 transition-colors duration-300
                focus:outline-none focus:ring-2 focus:ring-purple-500
                flex items-center gap-2"
            >
              <FaSave /> Salvar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsNameEditing(true)}
            className="w-full text-sm text-purple-700 hover:text-purple-800
              py-2 flex items-center justify-center gap-2
              transition-colors duration-300"
            disabled={isDead}
          >
            <FaPencilAlt size={12} /> Renomear seu gatinho
          </button>
        )}
      </div>

      {/* Status display with sleep indicator */}
      <div className="flex justify-between text-sm mb-2">
        <span className="flex items-center">
          <FaCoins className="text-yellow-500 mr-1" /> {coins}
        </span>
        <span className="flex items-center">
          <FaBath className="text-blue-500 mr-1" /> {cleanliness.toFixed(0)}%
        </span>
        {isSleeping && (
          <span className="flex items-center text-indigo-500 animate-pulse">
            <FaBed className="mr-1" /> Dormindo...
          </span>
        )}
      </div>

      {/* Main action buttons */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { id: "food", icon: <FaUtensils />, label: "Alimentar" },
          { id: "play", icon: <FaGamepad />, label: "Brincar" },
          { id: "care", icon: <FaBath />, label: "Cuidar" },
          { id: "sleep", icon: <FaBed />, label: "Dormir" },
        ].map((action) => (
          <button
            key={action.id}
            onClick={() => {
              if (action.id === "sleep") {
                onSleep();
              } else {
                setActiveMenu(activeMenu === action.id ? null : action.id);
              }
            }}
            disabled={isSleeping || isDead}
            className={`p-2 rounded-lg flex flex-col items-center
              ${
                action.id === "sleep" && isSleeping
                  ? "bg-indigo-200 animate-pulse"
                  : activeMenu === action.id
                  ? "bg-purple-200"
                  : "bg-purple-100"
              }
              hover:bg-purple-200 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {action.icon}
            <span className="text-xs mt-1">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Sub menu for selected action */}
      {!isSleeping && renderSubMenu()}

      {/* Games section */}
      <div className="mt-4">
        <button
          onClick={() => setShowGames(!showGames)}
          className="w-full p-2 bg-yellow-100 rounded-lg hover:bg-yellow-200
            flex items-center justify-center gap-2"
          disabled={isSleeping || isDead}
        >
          <FaGamepad /> {showGames ? "Fechar Jogos" : "Mini Games"}
        </button>

        {showGames && (
          <div className="mt-2">
            <MiniGames onWin={onGameWin} isDisabled={isSleeping || isDead} />
          </div>
        )}
      </div>

      {/* Color picker section */}
      {!props.isDead && !props.isSleeping && (
        <ColorPicker
          currentColor={currentColor}
          currentBackgroundColor={currentBackgroundColor}
          onColorChange={onColorChange}
          onBackgroundColorChange={onBackgroundColorChange}
          disabled={props.isDead || props.isSleeping}
          isColorLocked={isColorLocked}
        />
      )}

      {/* Reset button */}
      {isDead && (
        <button
          onClick={onReset}
          className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600
            text-white rounded-lg transition-all duration-300
            hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2
            focus:ring-purple-500 flex items-center justify-center gap-2"
        >
          <FaSyncAlt className="animate-spin" /> Adotar novo gatinho
        </button>
      )}
    </div>
  );
}

export default Controls;
