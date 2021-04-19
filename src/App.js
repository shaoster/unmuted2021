import {
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import LocalStorageRouter from "./LocalStorageRouter";

const App = function(props) {
  return (
    <Switch>
      <Route path="/:configId/edit" component={LocalStorageRouter} />
      <Route path="/:configId/game" component={LocalStorageRouter} />
      <Route exact path="/">
        <Redirect to="/static/game" />
      </Route>
      <Route exact path="/editor">
        <Redirect to="/static/edit" />
      </Route>
    </Switch>
  );
};

export default App;
