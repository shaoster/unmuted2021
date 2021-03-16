import { INVALID_MOVE } from 'boardgame.io/core';

import Actions from './Action';
import Events from './Event';

function GenerateInitialActions(ctx) {
  // TBD
  let actionBoard = {}
  for (let id in Actions) {
    let action = Actions[id];
    let type = action.type;
    if (action.innate || action.alwaysPresent) {
      actionBoard[type] = (actionBoard[type] || []).concat([action.id]);
    }
  }
  return actionBoard;
};

function GenerateInitialEvents(ctx) {
  // Initially, the Event Deck is empty.
  return []
};

export const Apex2021 = {
  setup: (ctx, setupData) => ({
    actionBoard: GenerateInitialActions(ctx),
    eventsDeck: GenerateInitialEvents(ctx),
    statuses: {},
    eventsToDraw: 5,
    actionPoints: 5,
    money: 0,
    interviewStrength: 0,
  }),
  moves: {
    performAction: (G, ctx, type, actionSlot) => {
      let actionId = G.actionBoard[type][actionSlot];
      let action = Actions[actionId];
      console.log("Attempting to buy action: " + actionId);
      return action.performAction(G, ctx, actionSlot);
    },
  },
};
