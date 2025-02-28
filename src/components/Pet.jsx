import { useState, useEffect, useCallback, useRef } from "react";
import { FaCat, FaSadCry, FaMeh, FaTired, FaSkull } from "react-icons/fa";

function Pet({
  mood,
  isDead,
  isSleeping,
  color,
  backgroundColor,
  isWandering,
  onWander,
  onReturn,
}) {
  const [animation, setAnimation] = useState("");
  const [isIdle, setIsIdle] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const moveToRandomPosition = useCallback(() => {
    if (!isWandering) return;

    const maxX = window.innerWidth - 100;
    const maxY = window.innerHeight - 100;

    const newX = Math.max(50, Math.min(maxX, Math.random() * maxX));
    const newY = Math.max(50, Math.min(maxY, Math.random() * maxY));

    setPosition({ x: newX, y: newY });
  }, [isWandering]);

  // Random idle animations
  useEffect(() => {
    if (isDead) return;

    // Random idle animations
    const idleInterval = setInterval(() => {
      const random = Math.random();
      if (random > 0.7) {
        setIsIdle(true);
        setTimeout(() => setIsIdle(false), 1000);
      }
    }, 3000);

    return () => clearInterval(idleInterval);
  }, [isDead]);

  // Random wandering behavior
  useEffect(() => {
    if (isDead || isSleeping || !isWandering) return;

    const wanderInterval = setInterval(() => {
      moveToRandomPosition();
    }, 3000); // Move every 3 seconds

    return () => clearInterval(wanderInterval);
  }, [isDead, isSleeping, isWandering, moveToRandomPosition]);

  const handleClick = () => {
    if (isDead || isSleeping) return;
    if (isWandering) {
      onReturn?.();
    } else {
      onWander?.();
    }
  };

  const renderCatIcon = () => {
    const iconSize = 100;
    const baseClass = `transition-all duration-300 transform
      ${isIdle ? "scale-110 rotate-3" : ""}
      ${isSleeping ? "animate-pulse opacity-75" : ""}
      ${animation === "bounce" ? "animate-bounce" : ""}`;

    if (isDead) {
      return (
        <FaSkull
          size={iconSize}
          className={`${baseClass} text-gray-700 rotate-180`}
        />
      );
    }

    const moodIcons = {
      happy: (
        <FaCat
          size={iconSize}
          className={baseClass}
          style={{ color: isDead ? "gray" : color }}
        />
      ),
      sad: (
        <FaSadCry
          size={iconSize}
          className={baseClass}
          style={{ color: isDead ? "gray" : color }}
        />
      ),
      tired: (
        <FaTired
          size={iconSize}
          className={baseClass}
          style={{ color: isDead ? "gray" : color }}
        />
      ),
      bored: (
        <FaMeh
          size={iconSize}
          className={baseClass}
          style={{ color: isDead ? "gray" : color }}
        />
      ),
    };

    return moodIcons[mood] || moodIcons.happy;
  };

  const moodStyles = {
    happy: "bg-gradient-to-br from-amber-100 to-amber-200 shadow-amber-200",
    sad: "bg-gradient-to-br from-blue-100 to-blue-200 shadow-blue-200",
    tired: "bg-gradient-to-br from-yellow-100 to-yellow-200 shadow-yellow-200",
    bored: "bg-gradient-to-br from-gray-100 to-gray-200 shadow-gray-200",
    dead: "bg-gradient-to-br from-gray-200 to-gray-300 shadow-gray-300",
    sleeping:
      "bg-gradient-to-br from-indigo-100 to-indigo-200 shadow-indigo-200",
  };

  if (!isWandering) {
    return (
      <div className="h-[300px] w-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl flex items-center justify-center">
        <div
          className="relative cursor-pointer"
          onClick={handleClick}
          title="Clique para passear"
        >
          <div
            className={`
              w-48 h-48 rounded-full flex items-center justify-center
              transition-all duration-500 hover:scale-105
              shadow-lg hover:shadow-xl border-4 border-white
              ${isIdle ? "animate-pulse" : ""}
            `}
            style={{ backgroundColor }}
          >
            {renderCatIcon()}
            {isSleeping && (
              <div className="absolute top-0 right-0 text-2xl animate-bounce">
                💤
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Wandering pet
  return (
    <div
      className={`
        ${isWandering ? "fixed" : "absolute"} 
        transition-all duration-1000 ease-in-out cursor-pointer
      `}
      style={{
        left: isWandering ? `${position.x}px` : "50%",
        top: isWandering ? `${position.y}px` : "50%",
        transform: `translate(-50%, -50%) ${
          isWandering ? "scale(0.8)" : "scale(1)"
        }`,
        zIndex: isWandering ? 9999 : 1,
      }}
      onClick={handleClick}
      title={isWandering ? "Clique para voltar" : "Clique para passear"}
    >
      <div
        className={`
          w-48 h-48 rounded-full flex items-center justify-center
          transition-all duration-500 hover:scale-105
          shadow-lg hover:shadow-xl border-4 border-white
          ${isIdle ? "animate-pulse" : ""}
          ${isWandering ? "animate-bounce" : ""}
        `}
        style={{ backgroundColor }}
      >
        {renderCatIcon()}
        {isSleeping && (
          <div className="absolute top-0 right-0 text-2xl animate-bounce">
            💤
          </div>
        )}
      </div>
    </div>
  );
}

export default Pet;
