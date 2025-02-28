import { useState, useEffect, useCallback } from "react";
import { MINI_GAMES } from "../constants/gameData";
import {
  FaMousePointer,
  FaBrain,
  FaCalculator,
  FaKeyboard,
  FaPalette,
  FaHammer,
} from "react-icons/fa";

function MiniGames({ onWin, isDisabled }) {
  const [activeGame, setActiveGame] = useState(null);
  const [gameState, setGameState] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);

  const generateMathProblem = () => {
    const operations = ["+", "-", "x"];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    let num1, num2, answer;

    switch (operation) {
      case "+":
        num1 = Math.floor(Math.random() * 20);
        num2 = Math.floor(Math.random() * 20);
        answer = num1 + num2;
        break;
      case "-":
        num1 = Math.floor(Math.random() * 20);
        num2 = Math.floor(Math.random() * (num1 + 1));
        answer = num1 - num2;
        break;
      case "x":
        num1 = Math.floor(Math.random() * 10);
        num2 = Math.floor(Math.random() * 10);
        answer = num1 * num2;
        break;
    }

    return { question: `${num1} ${operation} ${num2}`, answer };
  };

  const generateMemoryCards = () => {
    const emojis = ["🐱", "🐶", "🐭", "🐰", "🐻", "🐼", "🦊", "🐨"];
    const cards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        content: emoji,
        isFlipped: false,
        isMatched: false,
      }));
    return cards;
  };

  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (activeGame && timeLeft === 0) {
      setActiveGame(null);
    }
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const moveMouse = useCallback(() => {
    if (activeGame === "catchMouse") {
      setGameState((prev) => ({
        ...prev,
        position: {
          x: Math.random() * 80,
          y: Math.random() * 80,
        },
      }));
    }
  }, [activeGame]);

  useEffect(() => {
    let mouseInterval;
    if (activeGame === "catchMouse") {
      mouseInterval = setInterval(moveMouse, 1000);
    }
    return () => clearInterval(mouseInterval);
  }, [activeGame, moveMouse]);

  const startGame = (gameId) => {
    if (isDisabled) return;

    const game = MINI_GAMES[gameId];
    setTimeLeft(game.duration);
    setActiveGame(gameId);

    switch (gameId) {
      case "catchMouse":
        setGameState({
          position: { x: Math.random() * 80, y: Math.random() * 80 },
          score: 0,
          required: 5, // Need to catch 5 times to win
        });
        break;
      case "quickMath":
        const problem = generateMathProblem();
        setGameState({
          ...problem,
          attempts: 0,
        });
        break;
      case "memoryGame":
        setGameState({
          cards: generateMemoryCards(),
          flippedCards: [],
          matchedPairs: 0,
        });
        break;
      case "typingRace":
        const words = [
          "gato",
          "cachorro",
          "pássaro",
          "hamster",
          "coelho",
          "peixe",
          "rato",
          "leão",
          "tigre",
          "urso",
        ];
        setGameState({
          score: 0,
          words: words.sort(() => Math.random() - 0.5),
          currentWord: words[0],
          currentIndex: 0,
        });
        break;

      case "colorMatch":
        const colors = [
          { value: "#FF0000", name: "Vermelho" },
          { value: "#00FF00", name: "Verde" },
          { value: "#0000FF", name: "Azul" },
          { value: "#FFFF00", name: "Amarelo" },
          { value: "#FF00FF", name: "Rosa" },
          { value: "#00FFFF", name: "Ciano" },
        ];
        const target = colors[Math.floor(Math.random() * colors.length)];
        setGameState({
          score: 0,
          targetColor: target,
          options: colors.sort(() => Math.random() - 0.5).slice(0, 4),
          attempts: 0,
        });
        break;

      case "whackAMole":
        setGameState({
          score: 0,
          activeMole: Math.floor(Math.random() * 9),
          lastClickTime: Date.now(),
          combo: 0,
          misses: 0,
          moleSpeed: 1000,
        });

        const moveInterval = setInterval(() => {
          if (!activeGame) {
            clearInterval(moveInterval);
            return;
          }
          setGameState((prev) => {
            const newSpeed = Math.max(400, 1000 - prev.score * 50);
            return {
              ...prev,
              activeMole: Math.floor(Math.random() * 9),
              moleSpeed: newSpeed,
            };
          });
        }, gameState.moleSpeed);

        break;
    }
  };

  const handleMemoryCardClick = (cardId) => {
    if (gameState.flippedCards.length === 2) return;

    const cards = [...gameState.cards];
    const card = cards.find((c) => c.id === cardId);
    if (card.isMatched || card.isFlipped) return;

    card.isFlipped = true;
    const flippedCards = [...gameState.flippedCards, card];

    if (flippedCards.length === 2) {
      if (flippedCards[0].content === flippedCards[1].content) {
        flippedCards.forEach((c) => {
          cards.find((card) => card.id === c.id).isMatched = true;
        });
        const matchedPairs = gameState.matchedPairs + 1;
        if (matchedPairs === 8) {
          handleGameWin("memoryGame");
        }
        setGameState({
          ...gameState,
          cards,
          flippedCards: [],
          matchedPairs,
        });
      } else {
        setGameState({
          ...gameState,
          cards,
          flippedCards,
        });
        setTimeout(() => {
          flippedCards.forEach((c) => {
            cards.find((card) => card.id === c.id).isFlipped = false;
          });
          setGameState({
            ...gameState,
            cards,
            flippedCards: [],
          });
        }, 1000);
      }
    } else {
      setGameState({
        ...gameState,
        cards,
        flippedCards,
      });
    }
  };

  const handleGameWin = (gameId) => {
    const game = MINI_GAMES[gameId];
    const reward =
      Math.floor(Math.random() * (game.reward.max - game.reward.min + 1)) +
      game.reward.min;
    onWin(reward);
    setActiveGame(null);
    setTimeLeft(0);
  };

  const renderGame = () => {
    switch (activeGame) {
      case "catchMouse":
        return (
          <div className="relative h-48 bg-gray-100 rounded-lg p-4">
            <div className="text-center mb-2">
              <div>Tempo: {timeLeft}s</div>
              <div>Capturados: {gameState.score}/5</div>
            </div>
            <button
              className="absolute transform -translate-x-1/2 -translate-y-1/2 text-2xl
                hover:scale-110 transition-transform cursor-pointer"
              style={{
                left: `${gameState.position.x}%`,
                top: `${gameState.position.y}%`,
              }}
              onClick={() => {
                const newScore = gameState.score + 1;
                if (newScore >= 5) {
                  handleGameWin("catchMouse");
                } else {
                  setGameState({
                    ...gameState,
                    score: newScore,
                    position: {
                      x: Math.random() * 80,
                      y: Math.random() * 80,
                    },
                  });
                }
              }}
            >
              🐭
            </button>
          </div>
        );

      case "quickMath":
        return (
          <div className="text-center p-4 bg-gray-100 rounded-lg">
            <div className="mb-2">Tempo: {timeLeft}s</div>
            <h3 className="text-xl mb-4">{gameState.question}</h3>
            <input
              type="number"
              className="border p-2 rounded w-24 text-center"
              placeholder="?"
              autoFocus
              onChange={(e) => {
                if (Number(e.target.value) === gameState.answer) {
                  handleGameWin("quickMath");
                }
              }}
            />
          </div>
        );

      case "memoryGame":
        return (
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="text-center mb-2">Tempo: {timeLeft}s</div>
            <div className="grid grid-cols-4 gap-2">
              {gameState.cards?.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleMemoryCardClick(card.id)}
                  className={`w-12 h-12 flex items-center justify-center text-xl
                    rounded border-2 transition-all duration-300
                    ${
                      card.isFlipped || card.isMatched
                        ? "bg-white"
                        : "bg-purple-200"
                    }`}
                  disabled={card.isFlipped || card.isMatched}
                >
                  {card.isFlipped || card.isMatched ? card.content : ""}
                </button>
              ))}
            </div>
          </div>
        );

      case "typingRace":
        return (
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="text-center mb-2">
              <div>Tempo: {timeLeft}s</div>
              <div>Palavras: {gameState.score}/5</div>
            </div>
            <div className="text-xl mb-4 font-bold text-center text-purple-600">
              {gameState.currentWord}
            </div>
            <input
              type="text"
              autoFocus
              className="w-full p-2 border rounded focus:ring-2 focus:ring-purple-500 outline-none"
              placeholder="Digite a palavra aqui"
              onChange={(e) => {
                const input = e.target.value.toLowerCase().trim();
                if (input === gameState.currentWord.toLowerCase()) {
                  const newScore = gameState.score + 1;
                  if (newScore >= 5) {
                    handleGameWin("typingRace");
                  } else {
                    const nextIndex = gameState.currentIndex + 1;
                    setGameState({
                      ...gameState,
                      score: newScore,
                      currentWord: gameState.words[nextIndex],
                      currentIndex: nextIndex,
                    });
                    e.target.value = "";
                  }
                }
              }}
            />
          </div>
        );

      case "colorMatch":
        return (
          <div className="p-4 bg-gray-100 rounded-lg">
            <div className="text-center mb-2">
              <div>Tempo: {timeLeft}s</div>
              <div>Acertos: {gameState.score}/5</div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div
                  className="h-24 rounded-lg shadow-inner"
                  style={{ backgroundColor: gameState.targetColor.value }}
                />
                <p className="text-center mt-2 text-sm font-medium">
                  Encontre: {gameState.targetColor.name}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {gameState.options.map((color, idx) => (
                  <button
                    key={idx}
                    className="h-12 rounded-lg hover:scale-105 transition-transform shadow-md"
                    style={{ backgroundColor: color.value }}
                    onClick={() => {
                      if (color.value === gameState.targetColor.value) {
                        const newScore = gameState.score + 1;
                        if (newScore >= 5) {
                          handleGameWin("colorMatch");
                        } else {
                          const newTarget =
                            gameState.options[
                              Math.floor(
                                Math.random() * gameState.options.length
                              )
                            ];
                          setGameState({
                            ...gameState,
                            score: newScore,
                            targetColor: newTarget,
                            options: gameState.options.sort(
                              () => Math.random() - 0.5
                            ),
                          });
                        }
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case "whackAMole":
        return (
          <div className="p-4 bg-gradient-to-b from-green-50 to-green-100 rounded-lg">
            <div className="text-center mb-2 space-y-1">
              <div className="text-lg font-bold">Tempo: {timeLeft}s</div>
              <div className="text-sm text-green-700">
                Acertos: {gameState.score}/10
              </div>
              {gameState.combo > 1 && (
                <div className="text-orange-500 font-bold animate-bounce">
                  Combo x{gameState.combo}!
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3 bg-gradient-to-br from-green-200 to-green-300 p-4 rounded-xl">
              {Array.from({ length: 9 }).map((_, idx) => (
                <div
                  key={idx}
                  className="relative h-16 rounded-lg overflow-hidden"
                  style={{
                    background:
                      "radial-gradient(circle at center 80%, #8B4513 0%, #654321 100%)",
                  }}
                >
                  <div className="absolute inset-0 flex items-end justify-center">
                    {/* Buraco */}
                    <div className="w-12 h-12 rounded-full bg-black/30 mb-1" />
                  </div>
                  <button
                    className={`
                      absolute left-1/2 w-12 h-12
                      transform -translate-x-1/2 transition-all duration-150
                      ${
                        gameState.activeMole === idx
                          ? "bottom-2 hover:bottom-3"
                          : "-bottom-full"
                      }
                    `}
                    onClick={() => {
                      if (gameState.activeMole === idx) {
                        const timeSinceLastClick =
                          Date.now() - gameState.lastClickTime;
                        const newCombo =
                          timeSinceLastClick < 800 ? gameState.combo + 1 : 1;
                        const comboBonus = Math.floor(newCombo / 3);
                        const newScore = gameState.score + 1 + comboBonus;

                        if (newScore >= 10) {
                          handleGameWin("whackAMole");
                        } else {
                          setGameState({
                            ...gameState,
                            score: newScore,
                            combo: newCombo,
                            lastClickTime: Date.now(),
                            activeMole: Math.floor(Math.random() * 9),
                          });
                        }
                      } else {
                        setGameState({
                          ...gameState,
                          combo: 0,
                          misses: gameState.misses + 1,
                        });
                      }
                    }}
                  >
                    <div
                      className={`
                        w-full h-full rounded-full flex items-center justify-center
                        bg-gradient-to-b from-brown-400 to-brown-600
                        transform transition-transform duration-100
                        ${
                          gameState.activeMole === idx
                            ? "scale-110"
                            : "scale-100"
                        }
                        hover:from-brown-500 hover:to-brown-700
                      `}
                    >
                      <div className="text-2xl transform -translate-y-1">
                        🦔
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {!activeGame ? (
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(MINI_GAMES).map(([id, game]) => (
            <button
              key={id}
              onClick={() => startGame(id)}
              disabled={isDisabled}
              className="p-3 bg-yellow-100 rounded-lg hover:bg-yellow-200 
                disabled:opacity-50 disabled:cursor-not-allowed
                flex flex-col items-center gap-2 text-sm"
            >
              {id === "catchMouse" ? (
                <FaMousePointer />
              ) : id === "memoryGame" ? (
                <FaBrain />
              ) : id === "quickMath" ? (
                <FaCalculator />
              ) : id === "typingRace" ? (
                <FaKeyboard />
              ) : id === "colorMatch" ? (
                <FaPalette />
              ) : id === "whackAMole" ? (
                <FaHammer />
              ) : null}
              <span>{game.name}</span>
              <span className="text-xs text-gray-600">
                {game.reward.min}-{game.reward.max} moedas
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div>
          {renderGame()}
          <button
            onClick={() => {
              setActiveGame(null);
              setTimeLeft(0);
            }}
            className="mt-4 w-full p-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

export default MiniGames;
