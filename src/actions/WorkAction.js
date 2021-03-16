import BaseAction from './Base';

// We model "earning money" by just setting a negative moneyCost.
const BaseWork = {
  ...BaseAction,
  type: "work",
  moneyCost: 0,
};

const WorkCards = [
  {
    id: "RestaurantShift",
    displayName: "Restaurant Shift",
    description: "Your aunt's restaurant will pay you to work all evening. The pay is not very good...",
    actionCost: 2,
    moneyCost: -1,
    innate: true,
  },
].map(c => ({
  ...BaseWork,
  ...c,
}));

export default WorkCards;
