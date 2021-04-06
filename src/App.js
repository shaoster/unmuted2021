import { Client } from 'boardgame.io/react';
import { Apex2021 } from './Game';
import Board from './component/Board';
import {
  Route,
  Switch,
} from 'react-router-dom';


const GameClient = Client({
  game: Apex2021,
  board: Board,
  numPlayers: 1,
});

const Editor = function(props) {
  return (
    <h1>Editor</h1>
  )
};

const App = function(props) {
  return (
    <Switch>
      <Route exact path="/" component={GameClient}/>
      <Route exact path="/editor" component={Editor} />
    </Switch>
  );
};


export default App;
