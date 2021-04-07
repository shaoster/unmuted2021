import { Client } from 'boardgame.io/react';
import { Apex2021 } from './Game';
import Board from './component/Board';
import GameEditor from './component/GameEditor';
import {
  Route,
  Switch,
} from 'react-router-dom';


const GameClient = Client({
  game: Apex2021,
  board: Board,
  numPlayers: 1,
});

const App = function(props) {
  return (
    <Switch>
      <Route exact path="/" component={GameClient}/>
      <Route exact path="/load-config/:configId" component={GameClient}/>
      <Route exact path="/editor" component={GameEditor} />
    </Switch>
  );
};

export default App;
