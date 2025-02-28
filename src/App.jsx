import { useState, useEffect } from "react";
import Pet from "./components/Pet";
import StatusBars from "./components/StatusBars";
import Controls from "./components/Controls";
import Shop from "./components/Shop";
import Achievements from "./components/Achievements";
import DailyTasks from "./components/DailyTasks";
import {
  FOODS,
  ACTIVITIES,
  CARE_ACTIONS,
  WEATHER_EFFECTS,
  LEVELS,
  ACHIEVEMENTS,
} from "./constants/gameData";

function App() {
  const savedState = localStorage.getItem("petState");
  const initialState = savedState
    ? JSON.parse(savedState)
    : {
        name: "Miau",
        hunger: 100,
        happiness: 100,
        energy: 100,
        health: 100,
        age: 0,
        lastFed: Date.now(),
        lastPlayed: Date.now(),
        lastSlept: Date.now(),
        cleanliness: 100,
        coins: 100,
        lastBath: Date.now(),
        lastBrushed: Date.now(),
        color: "#FFA500", // Default orange color
        backgroundColor: "#F0F0F0",
        isColorLocked: false,
        level: 1,
        xp: 0,
        achievements: [], // Ensure arrays are initialized
        inventory: [], // Ensure arrays are initialized
        foodHistory: [], // Add missing array
        dailyTasks: {
          lastUpdate: Date.now(),
          tasks: [
            { id: 1, description: "Dar banho no pet", reward: 50 },
            { id: 2, description: "Brincar com o pet", reward: 30 },
            { id: 3, description: "Alimentar o pet", reward: 20 },
          ],
          completedTasks: [], // Add tracking for completed tasks
        },
        photos: [],
        weather: "sunny",
        usedToys: {}, // Add tracking for used toys
        statistics: {
          feedCount: 0,
          playCount: 0,
          bathCount: 0,
        },
      };

  const [petState, setPetState] = useState(initialState);
  const [isDead, setIsDead] = useState(false);
  const [mood, setMood] = useState("happy");
  const [isSleeping, setIsSleeping] = useState(false);
  const [isWandering, setIsWandering] = useState(false);
  const [currentWeather, setCurrentWeather] = useState(initialState.weather);

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem("petState", JSON.stringify(petState));
  }, [petState]);

  // Diminuir os status do pet ao longo do tempo
  useEffect(() => {
    if (isDead) return;

    const timer = setInterval(() => {
      setPetState((prevState) => {
        const timeOfDay = new Date().getHours();
        const isNightTime = timeOfDay >= 22 || timeOfDay <= 6;

        // Taxas ajustadas para serem mais realistas (valores por minuto)
        const hungerRate = 0.08; // ~20.8 horas para esvaziar
        const happinessRate = 0.06; // ~27.7 horas para esvaziar
        const baseEnergyRate = isNightTime ? 0.03 : 0.07; // ~23.8 horas para esvaziar durante o dia

        // Fatores de modificação baseados no tempo desde a última ação
        const timeSinceLastFed =
          (Date.now() - prevState.lastFed) / (1000 * 60 * 60);
        const timeSinceLastPlayed =
          (Date.now() - prevState.lastPlayed) / (1000 * 60 * 60);
        const timeSinceLastSlept =
          (Date.now() - prevState.lastSlept) / (1000 * 60 * 60);

        // Modificadores de taxa baseados no tempo
        const hungerModifier = timeSinceLastFed > 12 ? 1.2 : 1;
        const happinessModifier = timeSinceLastPlayed > 8 ? 1.3 : 1;
        const energyModifier = timeSinceLastSlept > 16 ? 1.5 : 1;

        // Cálculos mais complexos
        const newHunger = Math.max(
          0,
          prevState.hunger - hungerRate * hungerModifier
        );
        const newHappiness = Math.max(
          0,
          prevState.happiness -
            happinessRate * happinessModifier * (newHunger < 30 ? 1.2 : 1)
        );
        const newEnergy = Math.max(
          0,
          prevState.energy -
            baseEnergyRate * energyModifier * (newHunger < 20 ? 1.2 : 1)
        );

        // Sistema de saúde mais complexo
        const healthImpact =
          (newHunger < 20 ? 0.1 : 0) +
          (newHappiness < 20 ? 0.05 : 0) +
          (newEnergy < 20 ? 0.05 : 0) +
          (timeSinceLastFed > 24 ? 0.1 : 0) +
          (timeSinceLastSlept > 24 ? 0.1 : 0);

        const newHealth = Math.max(0, prevState.health - healthImpact);
        const newAge = prevState.age + 0.001; // Idade aumenta mais lentamente

        return {
          ...prevState,
          hunger: newHunger,
          happiness: newHappiness,
          energy: newEnergy,
          health: newHealth,
          age: newAge,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isDead]);

  // Adicionar novos efeitos para limpeza
  useEffect(() => {
    if (isDead) return;

    const timer = setInterval(() => {
      setPetState((prev) => ({
        ...prev,
        cleanliness: Math.max(0, prev.cleanliness - 0.05),
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [isDead]);

  // Verificar a saúde do pet
  useEffect(() => {
    if (petState.health <= 0 && !isDead) {
      setIsDead(true);
    }

    // Definir o humor baseado nos status
    if (petState.health < 30 || petState.hunger < 30) {
      setMood("sad");
    } else if (petState.happiness < 30) {
      setMood("bored");
    } else if (petState.energy < 30) {
      setMood("tired");
    } else {
      setMood("happy");
    }
  }, [petState, isDead]);

  // Add new effect for weather changes
  useEffect(() => {
    const weatherInterval = setInterval(() => {
      const weathers = Object.keys(WEATHER_EFFECTS);
      const newWeather = weathers[Math.floor(Math.random() * weathers.length)];
      setCurrentWeather(newWeather);

      // Apply weather effects
      setPetState((prev) => ({
        ...prev,
        happiness: Math.min(
          100,
          prev.happiness + WEATHER_EFFECTS[newWeather].mood
        ),
        energy: Math.min(100, prev.energy + WEATHER_EFFECTS[newWeather].energy),
      }));
    }, 1000 * 60 * 30); // Change weather every 30 minutes

    // Set initial weather if not valid
    if (!WEATHER_EFFECTS[currentWeather]) {
      setCurrentWeather("sunny");
    }

    return () => clearInterval(weatherInterval);
  }, []);

  // Funções para cuidar do pet com efeitos mais realistas
  const feedPet = (foodType) => {
    if (isDead || petState.coins < FOODS[foodType].cost) return;

    setPetState((prev) => {
      const statistics = prev.statistics || {};
      // Calculate new values with limits
      const newHunger = Math.min(100, prev.hunger + FOODS[foodType].hunger);
      // Too much food reduces energy and can make pet unhappy
      const energyPenalty = newHunger > 90 ? -5 : -2;
      const happinessPenalty = newHunger > 95 ? -5 : 0;

      return {
        ...prev,
        hunger: newHunger,
        energy: Math.max(0, prev.energy + energyPenalty),
        health: Math.min(100, prev.health + (FOODS[foodType].health || 0)),
        happiness: Math.max(
          0,
          Math.min(
            100,
            prev.happiness + (FOODS[foodType].happiness || 0) + happinessPenalty
          )
        ),
        coins: prev.coins - FOODS[foodType].cost,
        lastFed: Date.now(),
        xp: prev.xp + 5, // Ganhar XP ao alimentar
        statistics: {
          ...statistics,
          feedCount: (statistics.feedCount || 0) + 1,
        },
        foodHistory: [...(prev.foodHistory || []), foodType],
      };
    });

    checkAchievements("wellFed");
  };

  const playWithPet = (activityType) => {
    if (isDead || petState.energy < Math.abs(ACTIVITIES[activityType].energy)) {
      return;
    }

    // Check if the toy is in inventory and not used up
    if (ACTIVITIES[activityType].isToy) {
      const toy = petState.inventory.find((item) => item === activityType);
      if (!toy) return; // Toy not in inventory
      const usedCount = petState.usedToys[activityType] || 0;
      if (usedCount >= ACTIVITIES[activityType].maxUses) return; // Toy used up
    }

    setPetState((prev) => {
      const hungerPenalty = prev.hunger < 30 ? -10 : 0;
      const happinessModifier = prev.energy < 40 ? 0.5 : 1;

      // Update toy usage count
      const newUsedToys = ACTIVITIES[activityType].isToy
        ? {
            ...prev.usedToys,
            [activityType]: (prev.usedToys[activityType] || 0) + 1,
          }
        : prev.usedToys;

      const statistics = prev.statistics || {};
      return {
        ...prev,
        happiness: Math.min(
          100,
          prev.happiness +
            ACTIVITIES[activityType].happiness * happinessModifier
        ),
        energy: Math.max(0, prev.energy + ACTIVITIES[activityType].energy),
        hunger: Math.max(0, prev.hunger + ACTIVITIES[activityType].hunger),
        health: Math.min(
          100,
          prev.health + (ACTIVITIES[activityType].health || 0) + hungerPenalty
        ),
        lastPlayed: Date.now(),
        usedToys: newUsedToys,
        xp: prev.xp + 10, // Ganhar XP ao brincar
        statistics: {
          ...statistics,
          playCount: (statistics.playCount || 0) + 1,
        },
      };
    });

    checkAchievements("playful");
  };

  const carePet = (careType) => {
    if (isDead) return;

    const action = CARE_ACTIONS[careType];
    setPetState((prev) => {
      const statistics = prev.statistics || {};
      return {
        ...prev,
        health: Math.min(100, prev.health + action.health),
        happiness: Math.max(0, prev.happiness + (action.happiness || 0)),
        energy: Math.max(0, prev.energy + action.energy),
        cleanliness: careType === "bath" ? 100 : prev.cleanliness,
        [`last${careType.charAt(0).toUpperCase() + careType.slice(1)}`]:
          Date.now(),
        xp: prev.xp + 8, // Ganhar XP ao cuidar
        statistics: {
          ...statistics,
          bathCount:
            careType === "bath"
              ? (statistics.bathCount || 0) + 1
              : statistics.bathCount || 0,
        },
      };
    });

    if (careType === "bath") {
      checkAchievements("caringOwner");
    }
  };

  const letPetSleep = () => {
    if (isDead) return;
    setIsSleeping(true);

    setTimeout(() => {
      setIsSleeping(false);
      setPetState((prev) => {
        // Sleeping when not tired enough reduces happiness
        const happinessPenalty = prev.energy > 70 ? -10 : 0;
        // Sleeping when very hungry is less effective
        const energyModifier = prev.hunger < 30 ? 0.5 : 1;

        return {
          ...prev,
          energy: Math.min(100, prev.energy + 50 * energyModifier),
          hunger: Math.max(0, prev.hunger - 15),
          lastSlept: Date.now(),
          health: Math.min(100, prev.health + 5),
          happiness: Math.min(
            100,
            Math.max(0, prev.happiness + 5 + happinessPenalty)
          ),
        };
      });
    }, 5000);
  };

  const healPet = () => {
    if (isDead) return;
    setPetState((prev) => ({
      ...prev,
      health: Math.min(100, prev.health + 30),
      energy: Math.max(0, prev.energy - 10), // Gasta energia para se curar
    }));
  };

  const resetPet = () => {
    setIsDead(false);
    setPetState({
      name: "Miau",
      hunger: 100,
      happiness: 100,
      energy: 100,
      health: 100,
      age: 0,
      lastFed: Date.now(),
      lastPlayed: Date.now(),
      lastSlept: Date.now(),
      cleanliness: 100,
      coins: 100,
      lastBath: Date.now(),
      lastBrushed: Date.now(),
      color: "#FFA500", // Default orange color
      backgroundColor: "#F0F0F0",
      isColorLocked: false,
      level: 1,
      xp: 0,
      achievements: [],
      inventory: [],
      foodHistory: [],
      dailyTasks: {
        lastUpdate: Date.now(),
        tasks: [],
        completedTasks: [],
      },
      photos: [],
      weather: "sunny",
      usedToys: {},
      statistics: {
        feedCount: 0,
        playCount: 0,
        bathCount: 0,
      },
    });
  };

  const changeName = (newName) => {
    setPetState((prev) => ({
      ...prev,
      name: newName,
    }));
  };

  const earnCoins = () => {
    setPetState((prev) => ({
      ...prev,
      coins: prev.coins + Math.floor(Math.random() * 10) + 1,
    }));
  };

  const handleGameWin = (coins) => {
    setPetState((prev) => ({
      ...prev,
      coins: prev.coins + coins,
      happiness: Math.min(100, prev.happiness + 5), // Bonus happiness for playing
      energy: Math.max(0, prev.energy - 3), // Small energy cost
    }));
  };

  const changePetColor = (newColor) => {
    if (petState.isColorLocked) return;
    setPetState((prev) => ({
      ...prev,
      color: newColor,
      isColorLocked: true,
    }));
  };

  const changeBackgroundColor = (newColor) => {
    setPetState((prev) => ({
      ...prev,
      backgroundColor: newColor,
    }));
  };

  const addXP = (amount) => {
    setPetState((prev) => {
      const newXP = prev.xp + amount;
      const xpForNextLevel = LEVELS.xpPerLevel;

      if (newXP >= xpForNextLevel) {
        const newLevel = prev.level + 1;
        const reward = LEVELS.rewards[newLevel];

        if (reward) {
          return {
            ...prev,
            level: newLevel,
            xp: newXP - xpForNextLevel,
            coins: prev.coins + (reward.coins || 0),
            inventory: reward.item
              ? [...prev.inventory, reward.item]
              : prev.inventory,
          };
        }
      }

      return {
        ...prev,
        xp: newXP,
      };
    });
  };

  const handlePurchase = (item) => {
    if (petState.coins >= item.price) {
      setPetState((prev) => ({
        ...prev,
        coins: prev.coins - item.price,
        inventory: Array.isArray(prev.inventory)
          ? [...prev.inventory, item.id]
          : [item.id],
        happiness: Math.min(
          100,
          prev.happiness + (item.effect?.happiness || 0)
        ),
      }));

      checkAchievements("shopaholic");
    }
  };

  const checkAchievements = (type) => {
    const unlockedAchievements = Array.isArray(petState.achievements)
      ? [...petState.achievements]
      : [];
    let shouldUpdate = false;

    switch (type) {
      case "foodLover":
        if (!unlockedAchievements.includes("foodLover")) {
          const allFoodTypes = Object.keys(FOODS);
          const hasTriedAllFoods = allFoodTypes.every((food) =>
            Array.isArray(petState.foodHistory)
              ? petState.foodHistory.includes(food)
              : false
          );

          if (hasTriedAllFoods) {
            unlockedAchievements.push("foodLover");
            shouldUpdate = true;
          }
        }
        break;

      case "shopaholic":
        if (!unlockedAchievements.includes("shopaholic")) {
          const uniqueItems = new Set(petState.inventory || []);
          if (uniqueItems.size >= 5) {
            unlockedAchievements.push("shopaholic");
            shouldUpdate = true;
          }
        }
        break;

      case "caringOwner":
        if (!unlockedAchievements.includes("caringOwner")) {
          const bathCount = petState.statistics?.bathCount || 0;
          if (bathCount >= 10) {
            unlockedAchievements.push("caringOwner");
            shouldUpdate = true;
          }
        }
        break;

      case "playful":
        if (!unlockedAchievements.includes("playful")) {
          const playCount = petState.statistics?.playCount || 0;
          if (playCount >= 20) {
            unlockedAchievements.push("playful");
            shouldUpdate = true;
          }
        }
        break;

      case "wellFed":
        if (!unlockedAchievements.includes("wellFed")) {
          const feedCount = petState.statistics?.feedCount || 0;
          if (feedCount >= 30) {
            unlockedAchievements.push("wellFed");
            shouldUpdate = true;
          }
        }
        break;
    }

    if (shouldUpdate) {
      setPetState((prev) => ({
        ...prev,
        achievements: unlockedAchievements,
        coins: prev.coins + ACHIEVEMENTS[type].reward,
      }));
    }
  };

  const checkDailyTasks = () => {
    const now = Date.now();
    const lastUpdate = petState.dailyTasks?.lastUpdate || now;
    const isNewDay = new Date(lastUpdate).getDate() !== new Date(now).getDate();

    if (isNewDay) {
      setPetState((prev) => ({
        ...prev,
        dailyTasks: {
          lastUpdate: now,
          tasks: [
            { id: 1, description: "Dar banho no pet", reward: 50 },
            { id: 2, description: "Brincar com o pet", reward: 30 },
            { id: 3, description: "Alimentar o pet", reward: 20 },
          ],
          completedTasks: [],
        },
      }));
    }
  };

  const handleTaskComplete = (taskId) => {
    const currentTasks = petState.dailyTasks?.tasks || [];
    const taskReward = currentTasks.find((t) => t.id === taskId)?.reward || 0;

    // Add safety check for dailyTasks
    if (!petState.dailyTasks?.completedTasks) {
      setPetState((prev) => ({
        ...prev,
        dailyTasks: {
          ...prev.dailyTasks,
          lastUpdate: Date.now(),
          tasks: currentTasks,
          completedTasks: [taskId],
        },
        coins: prev.coins + taskReward,
        xp: prev.xp + 15, // Ganhar XP ao completar tarefas
      }));
      return;
    }

    if (!petState.dailyTasks.completedTasks.includes(taskId)) {
      setPetState((prev) => ({
        ...prev,
        dailyTasks: {
          ...prev.dailyTasks,
          completedTasks: [...prev.dailyTasks.completedTasks, taskId],
        },
        coins: prev.coins + taskReward,
        xp: prev.xp + 15, // Ganhar XP ao completar tarefas
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {/* Weather indicator com posição ajustada e z-index */}
      <div className="absolute top-2 left-2 md:top-4 md:right-4 md:left-auto text-4xl p-2 bg-white/50 rounded-full shadow-lg z-50">
        {WEATHER_EFFECTS[currentWeather]?.icon || WEATHER_EFFECTS.sunny.icon}
      </div>

      {/* Wandering Pet */}
      {isWandering && (
        <Pet
          mood={mood}
          isDead={isDead}
          isSleeping={isSleeping}
          color={petState.color}
          backgroundColor={petState.backgroundColor}
          isWandering={true}
          onReturn={() => setIsWandering(false)}
        />
      )}

      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden relative">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
              {isDead ? `${petState.name} ✝️` : petState.name}
            </h1>

            {/* Level display */}
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium">
                Nível {petState.level}
              </span>
              <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 transition-all"
                  style={{
                    width: `${(petState.xp / LEVELS.xpPerLevel) * 100}%`,
                  }}
                />
              </div>
              <span className="text-sm text-gray-600">
                {petState.xp}/{LEVELS.xpPerLevel}
              </span>
            </div>

            {/* Pet home area */}
            {!isWandering && (
              <div className="relative h-[300px] bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl overflow-hidden">
                <Pet
                  mood={mood}
                  isDead={isDead}
                  isSleeping={isSleeping}
                  color={petState.color}
                  backgroundColor={petState.backgroundColor}
                  isWandering={false}
                  onWander={() => setIsWandering(true)}
                />
              </div>
            )}

            <div className="mt-6 space-y-4">
              <StatusBars petState={petState} />

              {/* New components */}
              <div className="grid gap-4 mt-4">
                <Shop
                  coins={petState.coins}
                  inventory={petState.inventory}
                  onPurchase={handlePurchase}
                />
                <Achievements unlockedAchievements={petState.achievements} />
                <DailyTasks
                  tasks={petState.dailyTasks?.tasks || []}
                  completedTasks={petState.dailyTasks?.completedTasks || []}
                  onTaskComplete={handleTaskComplete}
                />
              </div>
            </div>

            <div className="mt-8">
              <Controls
                petName={petState.name}
                onChangeName={changeName}
                onReset={isDead ? resetPet : null}
                onHeal={healPet}
                onSleep={letPetSleep}
                onCare={carePet}
                onPlay={playWithPet}
                onFeed={feedPet}
                isDead={isDead}
                coins={petState.coins}
                energy={petState.energy}
                cleanliness={petState.cleanliness}
                isSleeping={isSleeping}
                onGameWin={handleGameWin}
                onColorChange={changePetColor}
                onBackgroundColorChange={changeBackgroundColor}
                currentColor={petState.color}
                currentBackgroundColor={petState.backgroundColor}
                isColorLocked={petState.isColorLocked}
                inventory={petState.inventory}
                usedToys={petState.usedToys}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
