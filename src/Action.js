function importAll(r) {
  const allActions = r.keys().flatMap(
      (key) => r(key).default,
  );
  let result = {};
  allActions.forEach((action) => {
    result[action.id] = action;
  });
  return result;
}

export default importAll(require.context('./actions/', false, /Action\.js$/));
