import { MAX_GROWTH_MINDSET, MAX_HAND_SIZE } from './Constants';
import { DrawCard } from './Util';
import Config from './Config';

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
    if (!this.canPerform(G, ctx)) {
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
  canPerform: function (G, ctx) {
    return G.energy > 0;
  },
  buy: function(G, ctx) {
    if (!this.canBuy(G, ctx)) {
      return false;
    }
    // Pay for the action.
    G.attention--;
    G.money -= this.moneyCost;
    G.energy -= this.energyCost;
    G.discard.push(this.id);
    return true;
  },
  canBuy: function (G, ctx) {
    return G.attention > 0  && G.money >= this.moneyCost && G.energy >= this.energyCost;
  }
};

const actionList = Config.actions;

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

const Actions = Config.actions;

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
