import { INVALID_MOVE } from 'boardgame.io/core';

import Statuses from './Status';
import {
  MAX_TURN_COUNT,
  TERMINAL_STATE,
} from "./Constants";

import {
  DrawCard
} from './Util';

const INITIAL_BOARD = {
  actionShop: [],
  deck: [],
  hand: [],
  discard: [],
  growthMindsetPoints: 1,
  cardsLeftToDiscard: 0,
  cardsLeftToForget: 0,
  statuses: {},
  currentEvent: null,
  backgroundImage: null,
  studyPoints: 0,
  cardHistory: {},
};

const STARTS_TURN_WITH = {
  money: 0,
  attention: 1,
  energy: 1,
};

function SetupNewTurn(G, ctx) {
  // First process any events.
  console.log(ctx);
  const events = ctx.schedule.getCurrentEvents();
  console.log(events);
  events.forEach(({id, event}) => {
    event.apply(G, ctx);
    G.currentEvent = id;
  });
  if (events.length === 0) {
    // Don't bother with the Events UI if there's no events.
    ctx.events.endStage();
  }
  // Discard the remainder of your hand.
  while (G.hand.length > 0) {
    let remainingCard = G.hand.pop();
    if (!ctx.actions.getAction(remainingCard).forgetsOnDiscard) {
      // You only get one chance to play certain kinds of cards.
      G.discard.push(remainingCard);
    }
  }
  const cardsToDraw = Math.min(5, G.growthMindsetPoints);
  for (let i = 0; i < cardsToDraw; i++) {
    DrawCard(G, ctx);
  }
  Object.assign(G, STARTS_TURN_WITH);
  G.growthMindsetPoints--;

  // Apply status effects last.
  for (let [stat, dur] of Object.entries(G.statuses)) {
    console.log(stat, dur);
    if (dur > 0) {
      Statuses[stat].apply(G, ctx);
      G.statuses[stat]--;
    } else {
      delete G.statuses[stat];
    }
  }
}

export const Apex2021 = {
  setup: (ctx, setupData) => ({
    ...INITIAL_BOARD,
    ...STARTS_TURN_WITH
  }),
  moves: {
    performAction: (G, ctx, handIndex) => {
      const actionId = G.hand[handIndex];
      const action = ctx.actions.getAction(actionId);
      // Remove the card to be plpayed from the hand. Otherwise, weird
      // self-interactions are possible.
      G.hand.splice(handIndex, 1);
      if (!action.perform(G, ctx)) {
        // Return the card to its original location.
        G.hand.splice(handIndex, 0, actionId);
        return INVALID_MOVE;
      }
      // Only call these if successful.
      if (!action.forgetsSelf) {
        // YOLO cards don't do this.
        G.discard.push(actionId);
      }
    },
    buyAction: (G, ctx, shopIndex) => {
      const actionId = G.actionShop[shopIndex];
      const action = ctx.actions.getAction(actionId);
      if (!action.buy(G, ctx)) {
        return INVALID_MOVE;
      }
      // Only call these if successful.
      G.actionShop.splice(shopIndex, 1);
    },
    endTurn: (G, ctx) => {
      ctx.events.endTurn();
    },
  },
  turn: {
    activePlayers: { all: "showEvent" },
    onBegin: (G, ctx) => ( SetupNewTurn(G, ctx) ),
    onEnd: (G, ctx) => {
      if (G.growthMindsetPoints <= 0) {
        ctx.events.endGame(TERMINAL_STATE.FixedMindset);
      } else if (ctx.turn >= MAX_TURN_COUNT) {
        ctx.events.endGame(TERMINAL_STATE.Win);
      }
    },
    stages: {
      showEvent: {
        moves: {
          chooseOption: (G, ctx, optionIndex) => {
            // TBD: Events don't have any choices yet.
          },
          dismiss: (G, ctx) => {
            G.backgroundImage = ctx.schedule.getEvent(G.currentEvent).image;
            G.currentEvent = null;
            ctx.events.endStage();
          },
        },
      },
      discard: {
        moves: {
          discardAction: (G, ctx, handIndex) => {
            console.log(G.cardsLeftToDiscard);
            const actionId = G.hand[handIndex];
            G.hand.splice(handIndex, 1);
            G.discard.push(actionId);
            if (G.hand.length === 0) {
              G.cardsLeftToDiscard = 0;
            } else {
              G.cardsLeftToDiscard--;
            }
            if (G.cardsLeftToDiscard <= 0) {
              ctx.events.endStage();
            }
          }
        }
      },
      forget: {
        moves: {
          forgetAction: (G, ctx, handIndex) => {
            console.log(G.cardsLeftToForget);
            G.hand.splice(handIndex, 1);
            if (G.hand.length === 0) {
              G.cardsLeftToForget = 0;
            } else {
              G.cardsLeftToForget--;
            }
            if (G.cardsLeftToForget <= 0) {
              ctx.events.endStage();
            }
          }
        }
      }
    }
  },
};
