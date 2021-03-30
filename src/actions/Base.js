import { DrawCard, MAX_GROWTH_MINDSET } from '../Game';

const BaseAction = {
  displayName: null,
  image: "holder.js/256x128",
  description: "<FLAVOR>",
  moneyCost: 0,
  energyCost: 0,
  producesGrowthMindset: 0,
  producesMoney: 0,
  producesAttention: 0,
  producesEnergy: 0,
  drawsCards: 0,
  discardsCards: 0,
  gainsCards: [],
  forgetsSelf: false,
  forgetsCards: 0,
  isBuyable: true,
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

export default BaseAction;
