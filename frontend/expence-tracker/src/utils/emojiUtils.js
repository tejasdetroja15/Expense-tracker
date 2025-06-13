// Common emoji mappings for income sources
const INCOME_EMOJI_MAPPINGS = {
  // Direct mappings
  salary: "💰",
  business: "💼",
  investment: "📈",
  freelance: "💻",
  gift: "🎁",
  rent: "🏠",
  bonus: "🎯",
  commission: "📊",
  consulting: "👨‍💼",
  teaching: "📚",
  
  // Keywords and their emojis
  money: "💰",
  cash: "💵",
  payment: "💳",
  bank: "🏦",
  work: "💼",
  job: "👔",
  office: "🏢",
  project: "📋",
  client: "🤝",
  online: "🌐",
  digital: "💻",
  remote: "🏠",
  home: "🏠",
  house: "🏠",
  property: "🏘️",
  real: "🏘️",
  estate: "🏘️",
  stock: "📈",
  share: "📈",
  market: "📈",
  trading: "📈",
  crypto: "₿",
  bitcoin: "₿",
  ethereum: "Ξ",
  coin: "🪙",
  gold: "🪙",
  silver: "🪙",
  metal: "🪙",
  dividend: "📈",
  interest: "📈",
  profit: "📈",
  gain: "📈",
  return: "📈",
  reward: "🎁",
  prize: "🏆",
  award: "🏆",
  bonus: "🎯",
  extra: "➕",
  additional: "➕",
  side: "➕",
  part: "➕",
  time: "⏰",
  hourly: "⏰",
  daily: "📅",
  weekly: "📅",
  monthly: "📅",
  yearly: "📅",
  annual: "📅",
  contract: "📝",
  agreement: "📝",
  deal: "🤝",
  sale: "💰",
  sell: "💰",
  product: "📦",
  service: "🛠️",
  consulting: "👨‍💼",
  advice: "💡",
  mentor: "👨‍🏫",
  coach: "👨‍🏫",
  training: "📚",
  course: "📚",
  class: "📚",
  lesson: "📚",
  workshop: "🛠️",
  seminar: "🎓",
  conference: "🎓",
  event: "🎪",
  performance: "🎭",
  show: "🎭",
  concert: "🎵",
  music: "🎵",
  art: "🎨",
  design: "🎨",
  creative: "🎨",
  writing: "✍️",
  content: "📝",
  blog: "📝",
  article: "📝",
  book: "📚",
  publication: "📚",
  research: "🔬",
  study: "📚",
  analysis: "📊",
  data: "📊",
  tech: "💻",
  software: "💻",
  app: "📱",
  mobile: "📱",
  web: "🌐",
  internet: "🌐",
  online: "🌐",
  digital: "💻",
  virtual: "💻",
  remote: "🏠",
  other: "📦"
};

export const getEmojiByKeyword = (keyword) => {
  if (!keyword) return "💰";

  const lowercaseKeyword = keyword.toLowerCase().trim();
  
  // First try exact match
  if (INCOME_EMOJI_MAPPINGS[lowercaseKeyword]) {
    return INCOME_EMOJI_MAPPINGS[lowercaseKeyword];
  }

  // Then try partial match
  for (const [key, emoji] of Object.entries(INCOME_EMOJI_MAPPINGS)) {
    if (lowercaseKeyword.includes(key) || key.includes(lowercaseKeyword)) {
      return emoji;
    }
  }

  // If no match found, return default
  return "💰";
};

export const getEmojiSuggestions = (keyword) => {
  if (!keyword) return [];

  const lowercaseKeyword = keyword.toLowerCase().trim();
  const suggestions = [];

  for (const [key, emoji] of Object.entries(INCOME_EMOJI_MAPPINGS)) {
    if (lowercaseKeyword.includes(key) || key.includes(lowercaseKeyword)) {
      suggestions.push({ key, emoji });
    }
  }

  return suggestions;
}; 