import BaseAction from './Base';

const BaseFood = {
  ...BaseAction,
  type: "food",
  producesStatuses: [
    {
      weight: 1,
      outcome: ["Fed"],
    }
  ]
};

const AlwaysPresentFoodCards = [
  {
    id: "FastFood",
    displayName: "Junk Food",
    description: "Cheap and fast, but bad for your health!",
    producesEvents: [
      {
        weight: 1,
        outcome: ["UpsetStomach"],
      },
      {
        weight: 1,
        outcome: [],
      },
    ],
    moneyCost: 1,
  },
  {
    id: "FreshFood",
    displayName: "Cook Fresh Food",
    description: "Make yourself a healthy meal. Delicious and filling, if you have the time.",
    producesEvents: [
      {
        weight: 1,
        outcome: ["EnergyBurst"],
      },
      {
        weight: 1,
        outcome: [],
      },
    ],
    moneyCost: 1,
    actionCost: 2,
  },
  {
    id: "DumpsterDive",
    displayName: "Go Dumpster Diving",
    description: "Sift through the dumpster behind the deli downstairs. You might find yourself a treat or become very sick indeed.",
    actionCost: 1,
    producesEvents: [
      {
        weight: 1,
        outcome: ["MedicalEmergency"],
      },
      {
        weight: 3,
        outcome: ["UpsetStomach"],
      },
      {
        weight: 6,
        events: [],
      }
    ],
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
