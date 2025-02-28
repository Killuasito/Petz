import { ACHIEVEMENTS } from "../constants/gameData";
import { FaTrophy, FaLock, FaCoins } from "react-icons/fa";

function Achievements({ unlockedAchievements = [] }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
        <FaTrophy className="text-yellow-500" />
        Conquistas
      </h3>

      <div className="grid gap-3">
        {Object.values(ACHIEVEMENTS).map((achievement) => {
          const isUnlocked = unlockedAchievements?.includes(achievement.id);

          return (
            <div
              key={achievement.id}
              className={`
                p-3 rounded-lg border-2 transition-all
                ${
                  isUnlocked
                    ? "border-yellow-300 bg-yellow-50"
                    : "border-gray-200 bg-gray-50"
                }
              `}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium">{achievement.name}</h4>
                  <p className="text-sm text-gray-600">
                    {achievement.description}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-sm">
                    <FaCoins className="text-yellow-500" />
                    <span>{achievement.reward}</span>
                  </div>
                </div>
                {!isUnlocked && <FaLock className="text-gray-400" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Achievements;
