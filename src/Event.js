import {
  STATIC_ROOT
} from "./Constants";

export const BaseEvent = {
  displayName: null,
  image: null,
  description: "<FLAVOR>",
  producesStatuses: {},
  addsCardsToShop: [],
  addsCardsToDiscard: [],
  options: {},
  apply: function(G, ctx) {
    // TBD: Events can potentially have choices that spawn other events later.
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
    image: `${STATIC_ROOT}middle_school_graduation.png`,
    displayName: "Congratulations",
    description: "After a long year, you've finally graduated from middle school.",
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
    displayName: "High School Begins",
    description: "And just like that High School begins.",
    image: `${STATIC_ROOT}welcome_back.png`,
    addsCardsToDiscard: [
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
