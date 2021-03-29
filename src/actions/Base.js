const BaseAction = {
  displayName: null,
  description: "<PLACEHOLDER>",
  moneyCost: 0,
  energyCost: 0,
  producesGrowthMindset: 0,
  producesMoney: 0,
  producesMemory: 0,
  producesEnergy: 0,
  drawsCards: 0,
  // TODO: This is "inheritance" without any protection. Bad idea.
  perform: function(G, ctx) {
    // First check if we can afford the move.
    if (G.energy <= 0) {
      return false;
    }
    // Pay for the action.
    G.energy--;
    G.growthMindsetPoints += this.producesGrowthMindset;
    G.money += this.producesMoney;
    G.memory += this.producesMemory;
    G.energy += this.producesEnergy;
    for (let i = 0; i < this.drawsCards; i++) {
      
    }
    return true;
  },
  buy: function(G, ctx) {
    if (G.memory <= 0 || G.money <= this.moneyCost || G.energy <= this.energyCost) {
      return false;
    }
    // Pay for the action.
    G.memory--;
    G.money -= this.moneyCost;
    G.energy -= this.energyCost;
    G.discard.append(this.id);
  },
};

export default BaseAction;
