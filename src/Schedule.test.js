import { Schedule } from './Schedule';

test('Can construct schedule', () => {
  let s = new Schedule();
  expect(s.eventsByDay).toEqual({});
  expect(s.getEvents(1)).toEqual([]);
});

test('Can add events to schedule', () => {
  let s = new Schedule();
  s.addEvent(1, "foo");
  s.addEvent(2, "bar");
  s.addEvent(2, "baz");
  expect(s.getEvents(1)).toEqual(["foo"]);
  expect(s.getEvents(2)).toEqual(["bar", "baz"]);
  expect(s.getEvents(3)).toEqual([]);
});
