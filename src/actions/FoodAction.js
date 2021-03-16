import BaseAction from './Base';

const BaseFood = {
  ...BaseAction,
  type: "food",
  // Weighted random selector. All food defaults to "Fed".
  producesStatuses: {
    0: ["Fed"],
  }
};

const AlwaysPresentFoodCards = [
  {
    id: "FastFood",
    displayName: "Junk Food",
    description: "Cheap and fast, but bad for your health!",
    producesEvents: {
      0: ["UpsetStomach"], 
    },
    moneyCost: 1,
  },
  {
    id: "FreshFood",
    displayName: "Cook Fresh Food",
    description: "Make yourself a healthy meal. Delicious and filling, if you have the time.",
    producesEvents: {
      0: ["EnergyBurst"],
    },
    moneyCost: 1,
    actionCost: 2,
  },
  {
    id: "DumpsterDive",
    displayName: "Go Dumpster Diving",
    description: "Sift through the dumpster behind the deli downstairs. You might find yourself a treat or become very sick indeed.",
    actionCost: 1,
    producesStatuses: {
      0: [],
      10: ["Fed"]
    },
    producesEvents: {
      0: [],
      15: ["UpsetStomach"],
      19: ["MedicalEmergency"],
    },
  },
].map(c => ({
  ...c,
  alwaysPresent: true,
}));

const EventGeneratedFoodCards = [
  {
    id: "FoodDrive",
    displayName: "Go to the Food Drive",
    description: "A local nonprofit is organizing a food drive. Healthy and delicious!",
    actionCost: 2,
    // We can turn this off, but it might make the early game easier.
    innate: true,
  },
];

const FoodCards = ([
  AlwaysPresentFoodCards,
  EventGeneratedFoodCards
].flat()).map(c => ({
  ...BaseFood,
  ...c,
}));
export default FoodCards;
