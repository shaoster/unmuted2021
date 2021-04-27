export const BaseEvent = {
  displayName: null,
  image: null,
  song: null,
  description: "<FLAVOR>",
  clearsShop: false,
  studyPointsThreshold: 0,
  engrossedTurns: 0,
  inspiredTurns: 0,
  indebtedTurns: 0,
  energizedTurns: 0,
  addsCardsToShop: [],
  addsCardsToDiscardPile: [],
  apply: function(G, ctx) {
    // TBD: Events can potentially have choices that spawn other events later.
    if (this.inspiredTurns > 0) {
      G.statuses.inspired = Math.max((G.statuses.inspired || 0), this.inspiredTurns);
    }
    if (this.energizedTurns > 0) {
      G.statuses.energized = Math.max((G.statuses.energized || 0), this.energizedTurns);
    }
    if (this.engrossedTurns > 0) {
      G.statuses.engrossed = Math.max((G.statuses.engrossed || 0), this.engrossedTurns);
    }
    if (this.indebtedTurns > 0) {
      G.statuses.indebted = Math.max((G.statuses.indebted || 0), this.indebtedTurns);
    }

    if (this.clearsShop) {
      G.actionShop.splice(0, G.actionShop.length);
    }
    for (let card of this.addsCardsToShop) {
      G.actionShop.push(card);
    }
    for (let card of this.addsCardsToDiscardPile) {
      G.discard.push(card);
    }
  }
};

const eventList = [
  {
    id: "SummerStart",
    image: "middle_school_graduation.png",
    song: "af.mp3",
    displayName: "Congratulations",
    description: "After a long year, you've finally graduated from middle school.",
    inspiredTurns: 2, // No growth mindset lost.
    energizedTurns: 2, // One extra energy per turn.
    addsCardsToDiscardPile: [
      "summerHomework",
      "summerHomework",
      "Card01",
    ],
  },
  {
    id: "SchoolStart",
    image: "welcome_back.png",
    song: "da.mp3",
    displayName: "High School Begins",
    description: "And just like that High School begins.",
    addsCardsToDiscardPile: [
      "Card02",
      "Card02",
      "Card02",
      "Card02",
      "Card02",
      "Card01",
      "Card01",
    ],
    addsCardsToShop: [
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
