import { MAX_HAND_SIZE } from "./Constants";

// A weighted set of outcomes.
// The key represents the lowest roll of a 20-sided dice that will result in that outcome.
// Example: {
//  0: [], // 50%
//  10: [BadEvent], // 45%
//  19: [CatastrophicEvent], // 5%
// }
//
// Generate no events by default.
export const RollOutcome = function(roll, weightedOutcomes) {
  const threshold = roll - 1;
	const rollIndices = Object.keys(weightedOutcomes).map(k => parseInt(k));
  const selectedIndex = rollIndices.find(k => threshold >= k);
	return weightedOutcomes["" + selectedIndex];
};

export const DrawCard = function(G, ctx) {
  if (G.hand.length >= MAX_HAND_SIZE) {
    return false;
  }
  if (G.deck.length <= 0) {
    while (G.discard.length > 0) {
      G.deck.push(G.discard.pop());
    }
  }
  // If the deck is still empty, no draw.
  if (G.deck.length <= 0) {
    return false;
  }
  G.hand.push(G.deck.pop());
  return true;
}
