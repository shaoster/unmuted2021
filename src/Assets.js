const StripPrefix = (x, p, t) => {
  let cleaned = x.replace(/^\.\//, "");
  let value = `${p}/${cleaned}`;
  return {
    [value]: {
      label: cleaned,
      value: value,
      type: t,
    }
  }
};

const FromRequireContext = (rc, p, t) => Object.assign(
  {},
  ...rc.keys().map(k => StripPrefix(k, p, t))
);

const CardImages = FromRequireContext(
  require.context('../public/images/card', false, /.png$/),
  "images/card",
  "img"
);
const EventImages = FromRequireContext(
  require.context('../public/images/event', false, /.png$/),
  "images/event",
  "img"
);
const Songs = FromRequireContext(
  require.context('../public/songs', false, /.mp3$/),
  "songs",
  "audio"
);
export { CardImages, EventImages, Songs };

const PreloadAssetList = [
  ...Object.values(CardImages),
  ...Object.values(EventImages),
  ...Object.values(Songs),
].map(x=>({[x.value]: x.type}));

console.log(CardImages);

const Assets = Object.assign(
  {},
  ...PreloadAssetList
);

console.log(Assets);
export default Assets;
