import Actions from './Action';
import Events from './Event';

function GenerateInitialActions(ctx) {
  // TBD
  return Actions;
};

function GenerateInitialEvents(ctx) {
  // TBD
  return Events;
};

export const Apex2021 = {
  setup: (ctx, setupData) => ({
    actionBoard: GenerateInitialActions(ctx),
    eventsDeck: GenerateInitialEvents(ctx),
    statuses: {},
    eventsToDraw: 5,
    actionsPoints: 5,
    money: 0,
    interviewStrength: 0,
  }),
  moves: {
    buyCard: (G, ctx, cardPosition) => {
    },
  },
};
