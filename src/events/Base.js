const BaseEvent = {
  // A weighted set of outcomes.
  // The probablility of any outcome being chosen is its weight divided by the
  // total weight.
  // Example:
  //  8: [] ()
  //  1: [B]
  //  1: [CatastrophicEvent]
  //
  // Generate no events by default.
  producesActions: [
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
  // Override this if the event has additional behavior not captured in the data above.
  additionalEffect: (ctx, G) => {},
  // Whether or not the event removes itself from the events
  exhausts: true,
  // Whether or not the event triggers another event to be drawn.
  replenish: true,
  // Whether or not the event should immediately end the day.
  endsDay: false,
};

export default BaseEvent;
