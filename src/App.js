import React, {
  useEffect,
  useState,
} from "react";
import {
  Route,
  Switch,
} from 'react-router-dom';
import { Client } from 'boardgame.io/react';

import Actions from "./Action";
import Events from "./Event";
import {
  SchedulePlugin,
  INITIAL_SCHEDULE,
} from "./Schedule";
import { Apex2021 } from './Game';
import Board from './component/Board';
import GameEditor from './component/GameEditor';
import GameContext from "./GameContext";

const ConfigurableGameClient = function(props) {
  const {
    match,
  } = props;
  const [actions, setActions] = useState(Actions);
  const [events, setEvents] = useState(Events);
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  useEffect(() => {
    const json = localStorage.getItem("saveFiles");
    const knownSaves = JSON.parse(json);
    if (knownSaves && match.params.configId) {
      const saveFile = knownSaves[match.params.configId];
      setActions(saveFile.actions);
      setEvents(saveFile.events);
      setSchedule(saveFile.schedule);
    }
  }, [match]);
  console.log(actions, events, schedule);
  const game = {
    ...Apex2021,
    plugins: [
      SchedulePlugin({
        initialSchedule: schedule
      })
    ]
  }
  const GameClient = Client({
    game: game,
    board: Board,
    numPlayers: 1
  });
  return (
    <GameContext.Provider value={{
      actions: actions,
      events: events,
    }}>
      <GameClient {...props}/>
    </GameContext.Provider>
  );
}

const App = function(props) {
  return (
    <Switch>
      <Route exact path="/" component={ConfigurableGameClient} />
      <Route exact path="/load-config/:configId" component={ConfigurableGameClient} />
      <Route exact path="/editor" component={GameEditor} />
    </Switch>
  );
};

export default App;
