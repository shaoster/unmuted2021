import { INVALID_MOVE } from 'boardgame.io/core';

import Actions from './Action';
import Events from './Event';
import Schedule from './Schedule';
import Statuses from './Status';

import {
  DrawCard
} from './Util';

const SCHEDULE = new Schedule({
  1: ["SummerStart"],
  3: ["SchoolStart"],
});

const INITIAL_BOARD = {
  actionShop: [
    /*
    ...Array(2).fill("Card02"),
    ...Array(1).fill("Card06"),
    ...Array(2).fill("Card09"),
    ...Array(1).fill("Card10"),
    ...Array(1).fill("Card12"),
    ...(Object.keys(Actions).filter((c)=>Actions[c].isBuyable))
    */
  ].sort(),
  deck: [
    /*
    // Turn 2. Will require some sacrifice.
    "Card02", "Card01",
    // Turn 1.
    "Card02", "Card02", "Card01",
    */
  ],
  hand: [],
  discard: [],
  growthMindsetPoints: 1,
  cardsLeftToDiscard: 0,
  cardsLeftToForget: 0,
  statuses: {},
  currentEvent: null,
  backgroundImage: null,
};

const STARTS_TURN_WITH = {
  money: 0,
  attention: 1,
  energy: 1,
};

function SetupNewTurn(G, ctx) {
  // First process any events.
  const events = SCHEDULE.getEvents(ctx.turn);
  events.forEach((eventId) => {
    Events[eventId].apply(G, ctx, SCHEDULE);
    G.currentEvent = eventId;
  });
  if (events.length === 0) {
    // Don't bother with the Events UI if there's no events.
    ctx.events.endStage();
  }
  // Discard the remainder of your hand.
  while (G.hand.length > 0) {
    let remainingCard = G.hand.pop();
    if (!Actions[remainingCard].forgetsOnDiscard) {
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
      const action = Actions[actionId];
      if (!action.perform(G, ctx)) {
        return INVALID_MOVE;
      }
      G.hand.splice(handIndex, 1);
      if (!action.forgetsSelf) {
        G.discard.push(actionId);
      }
    },
    buyAction: (G, ctx, shopIndex) => {
      const actionId = G.actionShop[shopIndex];
      const action = Actions[actionId];
      if (!action.buy(G, ctx)) {
        return INVALID_MOVE;
      }
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
         ctx.events.endGame("fixed-mindset");
      }
      //return G;
    },
    stages: {
      showEvent: {
        moves: {
          chooseOption: (G, ctx, optionIndex) => {
            // TBD: Events don't have any choices yet.
          },
          dismiss: (G, ctx) => {
            G.backgroundImage = Events[G.currentEvent].image;
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
