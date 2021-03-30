import BaseAction from './Base';

export default [
  {
    id: "Card01",
    displayName: "Card1",
    description: "Make sure to play this every turn!",
    producesGrowthMindset: 1,
    isBuyable: false,
  },
  {
    id: "Card02",
    displayName: "Card2",
    description: "Getting money lets you buy stuff.",
    producesMoney: 1,
    producesEnergy: 1,
  },
  {
    id: "Card03",
    displayName: "Card3",
    description: "Sometimes you just want to forget everything.",
    moneyCost: 2,
    forgetsSelf: true,
    forgetsCards: 99,
  },
  {
    id: "Card04",
    displayName: "Card4",
    description: "If you play this, you'll have to pick another card in your hand to discard.",
    moneyCost: 2,
    drawsCards: 3,
    discardsCards: 1,
  },
  {
    id: "Card05",
    displayName: "Card5",
    description: "Doing too much can make you tired.",
    moneyCost: 2,
    producesGrowthMindset: 1,
    producesMoney: 1,
    producesEnergy: 1,
    drawsCards: 1,
    gainsCards: ["fatigue"],
  },
  {
    id: "Card06",
    displayName: "Card6",
    description: "More energy means you can play more actions!",
    moneyCost: 3,
    producesEnergy: 2,
    drawsCards: 1,
  },
  {
    id: "Card07",
    displayName: "Card7",
    description: "Attention will let you buy more cards from the shop!",
    moneyCost: 3,
    producesMoney: 2,
    producesAttention: 1
  },
  {
    id: "Card08",
    displayName: "Card8",
    description: "More money",
    moneyCost: 4,
    producesMoney: 2,
    producesEnergy: 1,
  },
  {
    id: "Card09",
    displayName: "Card9",
    description: "That's a lot of energy.",
    moneyCost: 3,
    producesAttention: 1,
    producesEnergy: 4,
  },
  {
    id: "Card10",
    displayName: "Card10",
    description: "Maybe there are better options.",
    moneyCost: 5,
    producesEnergy: 1,
    drawsCards: 2,
  },
  {
    id: "Card11",
    displayName: "Card11",
    description: "More more money",
    moneyCost: 6,
    producesMoney: 3,
    producesEnergy: 1,
  },
  {
    id: "fatigue",
    displayName: "Fatigue",
    description: "Better rest up or I'll just get even more tired later.",
    isBuyable: false,
    forgetsSelf: true,
  }

].map(c => ({
  ...BaseAction,
  ...c,
}));
