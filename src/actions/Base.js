const BaseAction = {
  moneyCost: 0,
  actionCost: 0,
  // A weighted set of outcomes.
  // The probablility of any outcome being chosen is its weight divided by the
  // total weight.
  // Example:
  //  8: [] (nothing bad happens)
  //  1: [BadEvent]
  //  1: [CatastrophicEvent]
  //
  // Generate no events by default.
  producesEvents: [
    {
      weight: 1,
      outcome: [],
    }
  ],
  producesStatus: [
    {
      weight: 1,
      outcome: [],
    }
  ],
  // You always start with this action on the first day.
  innate: false,
  // You start with this action every day.
  // Implies "innate".
  alwaysPresent: false,
};

export default BaseAction;
