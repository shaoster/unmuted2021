import BaseEvent from './Base';

const BadEvent = {
  // Bad events will probably have a green border or something.
  type: "bad",
  ...BaseEvent
};

const BadEvents = [
  {
    id: "UpsetStomach",
    displayName: "Upset Stomach",
    description: "You don't feel very well... Better rest up today.",
    additionalEffects: (G, ctx) => {
      G.actionPoints--;
    },
    endsDay: true,
    replenish: false,
  },
  {
    id: "MedicalEmergency",
    displayName: "Medical Emergency!",
    description: "Something terrible happens! You wake up in the hospital much poorer than you were before.",
    additionalEffects: (G, ctx) => {
      G.money -= 100;
    },
    endsDay: true,
    replenish: false,
  }
].map(c => ({
  ...BadEvent,
  ...c
}));

export default BadEvents;
