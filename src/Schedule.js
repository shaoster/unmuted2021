import { BaseEvent } from "./Event";

export class Schedule {
  eventsByDay:object;

  constructor(eventsByDay: object) {
    this.eventsByDay = eventsByDay || {};
  }

  addEvent(turnNumber: number, eventId: string):void {
    if (!(turnNumber in this.eventsByDay)) {
      this.eventsByDay[turnNumber] = [];
    }
    this.eventsByDay[turnNumber].push(eventId);
  }

  getEvents(turnNumber: number):Array<string> {
    if (turnNumber in this.eventsByDay) {
      return this.eventsByDay[turnNumber]
    }
    return [];
  }
}

export const SchedulePlugin = (options) => {
  const {
    initialSchedule,
    initialEvents,
  } = options;
  return {
    name: "schedule",
    setup: () => ({
      schedule: initialSchedule,
      events: initialEvents,
    }),
    api: ({ctx, data}) => ({
      getCurrentEvents: function():Array<object> {
        return new Schedule(data.schedule)
          .getEvents(ctx.turn)
          .map((eventId)=>({
            id:eventId,
            event: this.getEvent(eventId),
          }));
      },
      addEvent: (turnNumber, eventId) => {
        new Schedule(data.schedule).addEvent(turnNumber, eventId);
      },
      getEvents: function():object {
        // Get the nice re-hydrated version of events.
        const patchedEvents = {}
        for (let id in data.events) {
          patchedEvents[id] = this.getEvent(id);
        }
        return patchedEvents;
      },
      getEvent: (eventId) => ({
        // Re-hydrate functions for use in the Game engine.
        ...BaseEvent,
        ...data.events[eventId]
      }),
      getRaw: () => {
        return data;
      }
    }),
  }
}

export const INITIAL_SCHEDULE = {
    0: ["SummerStart"],
    2: ["SchoolStart"],
};

export default Schedule;
