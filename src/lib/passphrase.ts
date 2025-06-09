import CryptoJS from "crypto-js";

export interface PhraseWord {
  word: string;
  icon: string;
  category: string;
}

export interface MnemonicPhrase {
  id: string;
  words: PhraseWord[];
  createdAt: Date;
  title: string;
  encrypted: string;
}

const WORD_CATEGORIES = {
  animals: {
    words: [
      "собака",
      "кот",
      "лев",
      "орел",
      "дельфин",
      "панда",
      "тигр",
      "волк",
      "медведь",
      "лиса",
      "заяц",
      "слон",
      "жираф",
      "лошадь",
      "корова",
      "свинья",
      "овца",
      "коза",
      "курица",
      "утка",
    ],
    icons: [
      "🐕",
      "🐱",
      "🦁",
      "🦅",
      "🐬",
      "🐼",
      "🐅",
      "🐺",
      "🐻",
      "🦊",
      "🐰",
      "🐘",
      "🦒",
      "🐴",
      "🐄",
      "🐷",
      "🐑",
      "🐐",
      "🐔",
      "🦆",
    ],
  },
  nature: {
    words: [
      "солнце",
      "луна",
      "звезда",
      "океан",
      "гора",
      "лес",
      "река",
      "цветок",
      "дерево",
      "трава",
      "облако",
      "дождь",
      "снег",
      "ветер",
      "земля",
      "камень",
      "песок",
      "лед",
      "огонь",
      "вода",
    ],
    icons: [
      "☀️",
      "🌙",
      "⭐",
      "🌊",
      "🏔️",
      "🌲",
      "🏞️",
      "🌸",
      "🌳",
      "🌿",
      "☁️",
      "🌧️",
      "❄️",
      "💨",
      "🌍",
      "🪨",
      "🏖️",
      "🧊",
      "🔥",
      "💧",
    ],
  },
  objects: {
    words: [
      "ключ",
      "замок",
      "дом",
      "мост",
      "корабль",
      "самолет",
      "машина",
      "велосипед",
      "телефон",
      "компьютер",
      "книга",
      "ручка",
      "стол",
      "стул",
      "окно",
      "дверь",
      "часы",
      "зеркало",
      "лампа",
      "сумка",
    ],
    icons: [
      "🔑",
      "🔒",
      "🏠",
      "🌉",
      "🚢",
      "✈️",
      "🚗",
      "🚲",
      "📱",
      "💻",
      "📚",
      "✏️",
      "🪑",
      "🪑",
      "🪟",
      "🚪",
      "⏰",
      "🪞",
      "💡",
      "👜",
    ],
  },
  food: {
    words: [
      "яблоко",
      "хлеб",
      "мед",
      "молоко",
      "рыба",
      "мясо",
      "овощи",
      "фрукты",
      "сыр",
      "масло",
      "сахар",
      "соль",
      "перец",
      "чай",
      "кофе",
      "вода",
      "сок",
      "торт",
      "печенье",
      "конфеты",
    ],
    icons: [
      "🍎",
      "🍞",
      "🍯",
      "🥛",
      "🐟",
      "🥩",
      "🥬",
      "🍇",
      "🧀",
      "🧈",
      "🍬",
      "🧂",
      "🌶️",
      "🍵",
      "☕",
      "💧",
      "🧃",
      "🍰",
      "🍪",
      "🍭",
    ],
  },
  colors: {
    words: [
      "красный",
      "синий",
      "зеленый",
      "желтый",
      "белый",
      "черный",
      "серый",
      "розовый",
      "фиолетовый",
      "оранжевый",
      "коричневый",
      "золотой",
      "серебряный",
      "бирюзовый",
      "малиновый",
    ],
    icons: [
      "🔴",
      "🔵",
      "🟢",
      "🟡",
      "⚪",
      "⚫",
      "🔘",
      "🩷",
      "🟣",
      "🟠",
      "🤎",
      "🟨",
      "⚫",
      "🩵",
      "🌺",
    ],
  },
  emotions: {
    words: [
      "радость",
      "грусть",
      "смех",
      "улыбка",
      "любовь",
      "дружба",
      "мир",
      "счастье",
      "удача",
      "мечта",
      "надежда",
      "вера",
      "сила",
      "мудрость",
      "терпение",
    ],
    icons: [
      "😊",
      "😢",
      "😂",
      "😄",
      "❤️",
      "🤝",
      "☮️",
      "😍",
      "🍀",
      "💭",
      "🙏",
      "✨",
      "💪",
      "🧠",
      "⏳",
    ],
  },
};

function getSecureRandomInt(max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max;
}

export function generateMnemonicPhrase(length: number = 6): PhraseWord[] {
  const categories = Object.keys(WORD_CATEGORIES);
  const phrase: PhraseWord[] = [];
  const usedWords = new Set<string>();

  for (let i = 0; i < length; i++) {
    let category: string;
    let categoryData: { words: string[]; icons: string[] };
    let wordIndex: number;
    let selectedWord: string;

    let attempts = 0;
    do {
      category = categories[getSecureRandomInt(categories.length)];
      categoryData = WORD_CATEGORIES[category as keyof typeof WORD_CATEGORIES];
      wordIndex = getSecureRandomInt(categoryData.words.length);
      selectedWord = categoryData.words[wordIndex];
      attempts++;

      if (attempts > 50) break;
    } while (usedWords.has(selectedWord));

    usedWords.add(selectedWord);

    phrase.push({
      word: selectedWord,
      icon: categoryData.icons[wordIndex],
      category,
    });
  }

  return phrase;
}

export function encryptData(data: string, passphrase: string): string {
  return CryptoJS.AES.encrypt(data, passphrase).toString();
}

export function decryptData(encryptedData: string, passphrase: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptedData, passphrase);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export function phraseToString(phrase: PhraseWord[]): string {
  return phrase.map((p) => p.word).join(" ");
}

export function generatePhraseId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}
