import BaseAction from './Base';

// We model "earning money" by just setting a negative moneyCost.
const BaseFood = {
  ...BaseAction,
  type: "work",
  moneyCost: 0,
};

const WorkCards = [
  {
    id: "Restaurant Gig",
    displayName: "Junk Food",
    description: "Your aunt's restaurant will pay you to perform all evening. The pay is not very good...",
    actionCost: 2,
    moneyCost: -1,
  },
].map(c => ({
  ...BaseFood,
  ...c,
}));
export default WorkCards;
