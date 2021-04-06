import { MAX_GROWTH_MINDSET } from "./Constants";

export const BaseStatus = {
  displayName: null,
  image: null,
  description: "<FLAVOR>",
  apply: function(G, ctx) { }
};

const statusList = [
  {
    id: "energized",
    displayName: "Energized",
    description: "Gain an extra energy at the start of each turn.",
    apply: function(G, ctx) {
      G.energy += 1;
    },
  },
  {
    id: "inspired",
    displayName: "Inspired",
    description: "Nullify the usual loss of growth mindset at the start of each turn.",
    apply: function(G, ctx) {
      G.growthMindsetPoints = Math.min(MAX_GROWTH_MINDSET, G.growthMindsetPoints);
    },
  },
].map(c => ({
  ...BaseStatus,
  ...c,
}));

const Statuses = statusList.reduce(function(rv, x) {
  rv[x.id] = x;
  return rv;
}, {});

export default Statuses;
