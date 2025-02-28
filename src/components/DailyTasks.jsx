import { DAILY_TASKS } from "../constants/dailyTasks";
import { FaCalendarAlt, FaCheck, FaCoins } from "react-icons/fa";

function DailyTasks({ tasks, completedTasks = [], onTaskComplete }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
        <FaCalendarAlt className="text-blue-500" />
        Tarefas Diárias
      </h3>

      <div className="grid gap-2">
        {Object.entries(DAILY_TASKS).map(([id, task]) => {
          const isCompleted = completedTasks.includes(id);

          return (
            <div
              key={id}
              className={`
                flex items-center justify-between p-3 rounded-lg
                ${isCompleted ? "bg-green-50" : "bg-gray-50"}
              `}
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={() => !isCompleted && onTaskComplete(id)}
                  disabled={isCompleted}
                  className={`
                    w-5 h-5 rounded-full border-2 
                    ${
                      isCompleted
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300 hover:border-blue-500"
                    }
                    transition-colors duration-200
                    flex items-center justify-center
                  `}
                >
                  {isCompleted && <FaCheck className="text-white text-xs" />}
                </button>
                <span className="text-sm">{task.description}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <FaCoins className="text-yellow-500" />
                <span>{task.reward}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DailyTasks;
