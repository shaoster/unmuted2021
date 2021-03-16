import BaseAction from './Base';
import { RollOutcome } from '../Util'; 

const BaseWork = {
  ...BaseAction,
  type: "work",
  additionalEffects: function(G, ctx) {
    const salary = RollOutcome(ctx.random.Die(20), this.salary);
    console.log("Salary:", this.salary);
    console.log("Money:", G.money);
    G.money += salary; 
  }
};

const WorkCards = [
  {
    id: "RestaurantShift",
    displayName: "Restaurant Shift",
    description: "Your aunt's restaurant will pay you to work all evening. The pay is not very good...",
    actionCost: 2,
    moneyCost: 0,
    salary: {
      0: 3,
    },
    innate: true,
  },
].map(c => ({
  ...BaseWork,
  ...c,
}));

export default WorkCards;
