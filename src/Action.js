import { MAX_GROWTH_MINDSET, MAX_HAND_SIZE } from './Constants';
import { DrawCard } from './Util';


export const BaseAction = {
  displayName: null,
  displayNameInShop: null,
  image: null,
  description: "<FLAVOR>",
  moneyCost: 0,
  energyCost: 0,
  producesGrowthMindset: 0,
  producesMoney: 0,
  producesAttention: 0,
  producesEnergy: 0,
  producesStudyPoints: 0,
  drawsCards: 0,
  discardsCards: 0,
  gainsCards: [],
  forgetsOnDiscard: false,
  forgetsSelf: false,
  forgetsCards: 0,
  // TODO: This is "inheritance" without any protection. Bad idea.
  perform: function(G, ctx) {
    // First check if we can afford the move.
    if (G.energy <= 0) {
      return false;
    }
    // Pay for the action.
    G.energy--;
    G.growthMindsetPoints = Math.min(MAX_GROWTH_MINDSET, G.growthMindsetPoints + this.producesGrowthMindset);
    G.money += this.producesMoney;
    G.attention += this.producesAttention;
    G.energy += this.producesEnergy;
    G.studyPoints += this.producesStudyPoints;
    for (let i = 0; i < this.drawsCards; i++) {
      DrawCard(G, ctx);
    }
    if (this.discardsCards > 0 && G.hand.length > 0) {
      G.cardsLeftToDiscard = this.discardsCards;
      ctx.events.setStage('discard');
    }
    if (this.forgetsCards > 0 && G.hand.length > 0) {
      G.cardsLeftToForget = this.forgetsCards;
      ctx.events.setStage('forget');
    }
    this.gainsCards.forEach((c) => G.discard.push(c));
    return true;
  },
  buy: function(G, ctx) {
    if (G.attention <= 0 || G.money < this.moneyCost || G.energy < this.energyCost) {
      return false;
    }
    // Pay for the action.
    G.attention--;
    G.money -= this.moneyCost;
    G.energy -= this.energyCost;
    G.discard.push(this.id);
    return true;
  },
};

const actionList = [
  {
    id: "Card01",
    displayName: "Card1",
    description: "Make sure to play this every turn!",
    producesGrowthMindset: 1,
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
    forgetsCards: MAX_HAND_SIZE,
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
    description: "IDK",
    moneyCost: 3,
  },
  {
    id: "Card08",
    displayName: "Card8",
    description: "IDK",
    moneyCost: 4,
  },
  {
    id: "Card09",
    displayName: "Card9",
    description: "More money",
    moneyCost: 4,
    producesMoney: 2,
    producesEnergy: 1,
  },
  {
    id: "Card10",
    displayName: "Card10",
    description: "That's a lot of energy.",
    moneyCost: 4,
    producesAttention: 1,
    producesEnergy: 4,
  },
  {
    id: "Card11",
    displayName: "Card11",
    description: "Maybe there are better options.",
    moneyCost: 5,
    producesEnergy: 1,
    drawsCards: 2,
  },
  {
    id: "Card12",
    displayName: "Card12",
    description: "More more money",
    moneyCost: 6,
    producesMoney: 3,
    producesEnergy: 1,
  },
  {
    id: "fatigue",
    displayName: "Fatigue",
    description: "Better rest up or I'll just get even more tired later.",
    forgetsSelf: true,
  },
  {
    id: "summerHomework",
    displayName: "Summer Homework",
    description: "So tedious...",
    producesGrowthMindset: 1,
    forgetsSelf: true,
    forgetsOnDiscard: true,
  },
].map(c => ({
  ...BaseAction,
  ...c,
}));

export const PatchDisplayName = function(action) {
  return {
    ...BaseAction,
    ...action,
    ...{
      // Hack to back-populate the displayName.
      displayNameInShop: action.displayNameInShop ? action.displayNameInShop : action.displayName
    }
  };
}
export const PatchDisplayNames = function(actions) {
  const patchedActions = {};
  for (let [id, action] of Object.entries(actions)) {
    patchedActions[id] = PatchDisplayName(action);
  }
  return patchedActions;
}

const Actions = actionList.reduce(function(rv, x) {
  rv[x.id] = x;
  return rv;
}, {});

export const ActionsPlugin = (options) => {
  const {
    initialActions,
  } = options;
  return {
    name: "actions",
    setup: () => ({
      actions: initialActions,
    }),
    api: ({ctx, data}) => ({
      getActions: function():object {
        // Get the nice re-hydrated version of events.
        const patchedActions = {}
        for (let id in data.actions) {
          patchedActions[id] = this.getAction(id);
        }
        return patchedActions;
      },
      getAction: (actionId) => PatchDisplayName(data.actions[actionId]),
    }),
  };
};

export default Actions;
