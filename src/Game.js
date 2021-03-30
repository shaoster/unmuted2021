import { INVALID_MOVE } from 'boardgame.io/core';

import Actions from './Action';

export const MAX_HAND_SIZE = 8;
export const MAX_GROWTH_MINDSET = 5;
const INITIAL_BOARD = {
  actionShop: [
    ...Array(2).fill("Card02"),
    ...Array(1).fill("Card06"),
    ...Array(2).fill("Card09"),
    ...Array(1).fill("Card10"),
    ...Array(1).fill("Card12"),
    ...(Object.keys(Actions).filter((c)=>Actions[c].isBuyable))
  ].sort(),
  deck: [
    // Turn 2. Will require some sacrifice.
    "Card02", "Card01",
    // Turn 1.
    "Card02", "Card02", "Card01",
  ],
  hand: [],
  discard: [],
  growthMindsetPoints: 3,
  cardsLeftToDiscard: 0,
  cardsLeftToForget: 0,
};
const STARTS_TURN_WITH = {
  money: 0,
  attention: 1,
  energy: 1,
};


export function DrawCard(G, ctx) {
  if (G.hand.length >= MAX_HAND_SIZE) {
    return false;
  }
  if (G.deck.length <= 0) {
    while (G.discard.length > 0) {
      G.deck.push(G.discard.pop());
    }
  }
  // If the deck is still empty, no draw.
  if (G.deck.length <= 0) {
    return false;
  }
  G.hand.push(G.deck.pop());
  return true;
}

function SetupNewTurn(G, ctx) {
  console.log([...G.discard]);
  // Discard the remainder of your hand.
  while (G.hand.length > 0) {
    G.discard.push(G.hand.pop());
  }
  console.log([...G.discard]);
  const cardsToDraw = Math.min(5, G.growthMindsetPoints);
  for (let i = 0; i < cardsToDraw; i++) {
    DrawCard(G, ctx);
  }
  Object.assign(G, STARTS_TURN_WITH);
  G.growthMindsetPoints--;
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
      console.log(G.actionShop);
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
    onBegin: (G, ctx) => ( SetupNewTurn(G, ctx) ),
    onEnd: (G, ctx) => {
      if (G.growthMindsetPoints <= 0) {
         ctx.events.endGame("fixed-mindset");
      }
      //return G;
    },
    stages: {
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
            const actionId = G.hand[handIndex];
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
