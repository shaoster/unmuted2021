function importAll(r) {
  const allCards = r.keys().flatMap(
      (key) => r(key).default,
  );
  let result = {};
  allCards.reduce((r, k) => {
    (r[k.type] = r[k.type] || []).push(k);
    return r;
  }, result);
  console.log(result);
  return result;
}

export default importAll(require.context('./actions/', false, /Action\.js$/));
