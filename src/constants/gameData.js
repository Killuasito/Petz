export const FOODS = {
  basicFood: {
    name: "Ração Básica",
    hunger: 30,
    energy: -2,
    health: 2,
    happiness: 5,
    cost: 10,
  },
  premiumFood: {
    name: "Ração Premium",
    hunger: 45,
    energy: -3,
    health: 5,
    happiness: 10,
    cost: 25,
  },
  treat: {
    name: "Petisco",
    hunger: 15,
    energy: 5,
    happiness: 15,
    cost: 15,
  },
  fish: {
    name: "Peixe Fresco",
    hunger: 35,
    energy: -5,
    health: 8,
    happiness: 20,
    cost: 30,
  },
};

export const ACTIVITIES = {
  ballPlay: {
    name: "Bola de Lã",
    happiness: 25,
    energy: -15,
    hunger: -10,
  },
  laser: {
    name: "Laser",
    happiness: 35,
    energy: -20,
    hunger: -15,
  },
  petting: {
    name: "Carinho",
    happiness: 20,
    energy: -5,
    hunger: -5,
    health: 2,
  },
  running: {
    name: "Corrida",
    happiness: 30,
    energy: -25,
    hunger: -20,
    health: 5,
  },
  woolBall: {
    happiness: 15,
    energy: -5,
    hunger: -5,
    isToy: true, // Mark as toy
    maxUses: 3, // Maximum number of uses before being consumed
    name: "Novelo de Lã",
  },
  play: {
    happiness: 10,
    energy: -5,
    hunger: -5,
    name: "Brincar",
    health: 0,
  },
  mouseToy: {
    happiness: 15,
    energy: -3,
    hunger: -3,
    health: 0,
    isToy: true,
    maxUses: 5,
    name: "Ratinho de Brinquedo",
    icon: "🐭",
  },
};

export const CARE_ACTIONS = {
  bath: { name: "Banho", health: 10, happiness: -5, energy: -8 },
  brush: { name: "Escovar", health: 5, happiness: 10, energy: -3 },
  medicine: { name: "Remédio", health: 40, happiness: -10, energy: -15 },
};

export const MINI_GAMES = {
  catchMouse: {
    name: "Pegar o Rato",
    reward: { min: 10, max: 25 },
    description: "Clique no rato antes que ele escape!",
    duration: 10,
  },
  quickMath: {
    name: "Matemática",
    reward: { min: 15, max: 30 },
    description: "Resolva a conta matemática",
    duration: 5,
  },
  memoryGame: {
    name: "Memória",
    reward: { min: 20, max: 40 },
    description: "Encontre os pares",
    duration: 30,
  },
  typingRace: {
    name: "Digitação",
    reward: { min: 25, max: 45 },
    description: "Digite as palavras o mais rápido possível",
    duration: 15,
  },
  colorMatch: {
    name: "Cores",
    reward: { min: 15, max: 35 },
    description: "Combine as cores corretas",
    duration: 20,
  },
  whackAMole: {
    name: "Toupeira",
    reward: { min: 20, max: 40 },
    description: "Acerte as toupeiras que aparecem",
    duration: 15,
  },
  puzzleSolve: {
    name: "Quebra-Cabeça",
    reward: { min: 30, max: 50 },
    description: "Monte o quebra-cabeça do gatinho",
  },
  songMemory: {
    name: "Memória Musical",
    reward: { min: 25, max: 45 },
    description: "Repita a sequência de sons",
  },
};

export const LEVELS = {
  xpPerLevel: 100, // XP necessário para subir de nível
  rewards: {
    2: { coins: 100 },
    3: { coins: 150 },
    4: { coins: 200 },
    5: { coins: 250, item: "woolBall" },
    // Adicione mais níveis conforme necessário
  },
};

export const WEATHER_EFFECTS = {
  sunny: {
    mood: +5,
    energy: +2,
    icon: "☀️",
    name: "Ensolarado",
  },
  rainy: {
    mood: -3,
    energy: -1,
    icon: "🌧️",
    name: "Chuvoso",
  },
  snowy: {
    mood: +2,
    energy: -2,
    icon: "❄️",
    name: "Nevando",
  },
  cloudy: {
    mood: 0,
    energy: 0,
    icon: "☁️",
    name: "Nublado",
  },
};

export const ACHIEVEMENTS = {
  foodLover: {
    id: "foodLover",
    name: "Gourmet",
    description: "Experimentou todos os tipos de comida",
    reward: 100,
    icon: "🍽️",
  },
  shopaholic: {
    id: "shopaholic",
    name: "Consumista",
    description: "Comprou 5 itens diferentes",
    reward: 150,
    icon: "🛍️",
  },
  caringOwner: {
    id: "caringOwner",
    name: "Dono Atencioso",
    description: "Deu banho 10 vezes no pet",
    reward: 200,
    icon: "🛁",
  },
  playful: {
    id: "playful",
    name: "Brincalhão",
    description: "Brincou 20 vezes com o pet",
    reward: 180,
    icon: "🎮",
  },
  wellFed: {
    id: "wellFed",
    name: "Bem Alimentado",
    description: "Alimentou o pet 30 vezes",
    reward: 150,
    icon: "🍖",
  },
};
