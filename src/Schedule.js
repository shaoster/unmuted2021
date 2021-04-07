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
    initialSchedule
  } = options;
  return {
    name: "schedule",
    setup: () => ({
      schedule: initialSchedule,    
    }),
    api: ({ctx, data}) => ({
      getCurrentEvents: () => {
        return new Schedule(data.schedule).getEvents(ctx.turn);
      },
      addEvent: (turnNumber, eventId) => {
        new Schedule(data.schedule).addEvent(turnNumber, eventId);
      },
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
