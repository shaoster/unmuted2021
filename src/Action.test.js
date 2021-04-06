import Actions from "./Action";

test('At least one card looks reasonable.', () => {
  expect(Object.keys(Actions).length).toBeGreaterThan(1);
});
