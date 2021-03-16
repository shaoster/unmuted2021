import { Client } from 'boardgame.io/react';
import { Apex2021 } from './Game';
import Board from './component/Board';


const App = Client({
  game: Apex2021,
  board: Board,
  numPlayers: 1,
});

export default App;
