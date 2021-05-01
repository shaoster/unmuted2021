import {
  TERMINAL_STATE,
} from "./Constants";

import Config from './Config';

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
    if (this.studyPointsThreshold > G.studyPoints) {
      ctx.events.endGame(TERMINAL_STATE.FailedExam);
    }
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
      // To ensure seamless transition, clear shop one item at a time.
      while (G.actionShop.length > 0) {
        G.actionShop.pop();
      }
    }
    for (let card of this.addsCardsToShop) {
      G.actionShop.push(card);
    }
    for (let card of this.addsCardsToDiscardPile) {
      G.discard.push(card);
    }
  }
};

const Events = Config.events;
export default Events;
