import { INVALID_MOVE } from 'boardgame.io/core';

import { RollOutcome } from '../Util';

const BaseAction = {
  type: null,
  displayName: null,
  description: null,
  moneyCost: 0,
  actionCost: 0,
  producesEvents: {
    0: [],
  },
  producesStatuses: {
    0: []
  },
  additionalEffects: (G, ctx) => {},
  // You always start with this action on the first day.
  innate: false,
  // You start with this action every day.
  // Implies "innate".
  alwaysPresent: false,

  // TODO: This is "inheritance" without any protection. Bad idea.
  performAction: function(G, ctx, actionSlot) { ApplyAction(G, ctx, this, actionSlot); },
};

function ApplyAction(G, ctx, action, actionSlot) {
  // First check if we can afford the move.
  if (action.actionCost > G.actionPoints || action.moneyCost > G.money) {
    return INVALID_MOVE;
  }
  // Pay for the move.
  G.actionPoints -= action.actionCost;
  G.money -= action.moneyCost;

  // Correlate our outcomes if necessary.
  const roll = ctx.random.Die(20);
  // Trigger status.
  const statusesToAdd = RollOutcome(roll, action.producesStatuses);
  console.log(statusesToAdd);
  statusesToAdd.forEach((s) => {
    G.statuses[s] = (G.statuses[s] || []);
    G.statuses[s].push(ctx.turn);
  });
  // Add events.
  const eventsToSpawn = RollOutcome(roll, action.producesEvents);
  G.eventsDeck = G.eventsDeck.concat(eventsToSpawn);
  // Additional effects.
  action.additionalEffects(G, ctx);
  // While duplicates are permissable, a given card cannot be played more than once per day.
  G.actionBoard[action.type].splice(actionSlot, 1);
}

export default BaseAction;
