import BaseEvent from './Base';

const GoodEvent = {
  // Good events will probably have a green border or something.
  type: "good",
  ...BaseEvent
};

const GoodEvents = [
  {
    id: "EnergyBurst",
    displayName: "Burst of Energy",
    description: "You feel much more energetic today!.",
    additionalEffects: (G, ctx) => {
      G.actionPoints++;
      G.eventsToDraw++;
    },
  },
].map(c => ({
  ...GoodEvent,
  ...c
}));

export default GoodEvents;
