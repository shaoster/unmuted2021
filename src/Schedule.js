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

export default Schedule;
