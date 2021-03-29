import { INVALID_MOVE } from 'boardgame.io/core';

import Actions from './Action';

const MAX_HAND_SIZE = 7;
const INITIAL_BOARD = {
  actionShop: Object.keys(Actions),
  deck: [
    "Card1", "Card1", "Card1",
    "Card2", "Card2"
  ],
  hand: [],
  discard: [],
  growthMindsetPoints: 5,
};

function DrawCard(G, ctx) {
  if (G.deck.length >= MAX_HAND_SIZE) {
    return false;
  }

  console.log(G.deck);

  if (G.deck.length <= 0) {
    G.deck = ctx.random.Shuffle(G.discard);
    G.discard = [];
  }
  G.hand.push(G.deck.pop());
  return true;
}

function SetupNewTurn(G, ctx) {
  const startsTurnWith = {
    money: 0,
    memory: 1,
    energy: 1,
  };

  for (
    let cardsToDraw = Math.min(5, G.growthMindsetPoints);
    cardsToDraw--;
    cardsToDraw > 0
  ) {
    DrawCard(G, ctx);
  }
}

export const Apex2021 = {
  setup: (ctx, setupData) => INITIAL_BOARD,
  moves: {
    performAction: (G, ctx, handIndex) => {
      let action = G.hand[handIndex];
      if (!action.perform(G, ctx)) {
        return INVALID_MOVE;
      }
      G.hand.splice(handIndex, 1);
    },
    buyAction: (G, ctx, shopIndex) => {
      let action = G.actionShop[shopIndex];
      if (!action.buy(G, ctx)) {
        return INVALID_MOVE;
      }
      G.actionShop.splice(shopIndex, 1);
    },
    drawCard: (G, ctx) => {
      if (!DrawCard(G, ctx)) {
        return INVALID_MOVE;
      }
    }
  },
  turn: {
    onBegin: (G, ctx) => ( SetupNewTurn(G, ctx) ),
    onEnd: (G, ctx) => {
      G.growthMindsetPoints--;
      if (G.growthMindsetPoints <= 0) {
         // TBD: You lose.
      }
      //return G;
    },

  },
};
