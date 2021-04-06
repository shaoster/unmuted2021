export const BaseEvent = {
  displayName: null,
  image: null,
  description: "<FLAVOR>",
  producesStatuses: {},
  addsCardsToShop: [],
  addsCardsToDiscard: [],
  apply: function(G, ctx) {
    for (let [stat, duration] of Object.entries(this.producesStatuses)) {
      G.statuses[stat] = Math.max((G.statuses[stat] || 0), duration);
    }
    for (let card of this.addsCardsToShop) {
      G.actionShop.push(card);
    }
    for (let card of this.addsCardsToDiscard) {
      G.discard.push(card);
    }
  }
};

const eventList = [
  {
    id: "SummerStart",
    displayName: "Summer Begins",
    producesStatuses: {
      "inspired": 2, // No growth mindset lost.
      "energized": 2, // One extra energy per turn.
    },
    addsCardsToDiscard: [
      "summerHomework",
      "summerHomework",
      "Card01",
    ],
  },
  {
    id: "SchoolStart",
    displayName: "Summer Begins",
    addsCardsToDiscard: [
      "Card02",
      "Card02",
      "Card02",
      "Card02",
      "Card02",
      "Card01",
      "Card01",
    ],
    addCardsToShop: [
      "Card02",
      "Card02",
      "Card04",
      "Card05",
    ],
  },
].map(c => ({
  ...BaseEvent,
  ...c,
}));

const Events = eventList.reduce(function(rv, x) {
  rv[x.id] = x;
  return rv;
}, {});

export default Events;
