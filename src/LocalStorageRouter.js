import React, {
  useEffect,
  useState,
} from "react";

import {
  Route,
} from 'react-router-dom';

import { Client } from 'boardgame.io/react';

import Actions, {
  ActionsPlugin,
} from "./Action";

import Events from "./Event";
import {
  SchedulePlugin,
  INITIAL_SCHEDULE,
} from "./Schedule";

import LocalStorageContext from "./LocalStorageContext";
import { Apex2021 } from './Game';
import Board from './component/Board';
import GameEditor from './component/GameEditor';
import LoadingScreen from './component/LoadingScreen';

const LocalStorageRouter = (props) => {
  const {
    match,
  } = props;
  const [isDebug, setIsDebug] = useState(true);
  const [actions, setActions] = useState(Actions);
  const [events, setEvents] = useState(Events);
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const json = localStorage.getItem("saveFiles");
    const knownSaves = JSON.parse(json);
    if (knownSaves && match.params.configId) {
      const saveFile = knownSaves[match.params.configId];
      if (saveFile) {
        setActions(saveFile.actions);
        setEvents(saveFile.events);
        setSchedule(saveFile.schedule);
      }
    }
  }, [match]);
  const game = {
    ...Apex2021,
    plugins: [
      SchedulePlugin({
        initialSchedule: schedule,
        initialEvents: events,
      }),
      ActionsPlugin({
        initialActions: actions,
      }),
    ]
  };
  const MaybeBoardOrEditor = (props) => (
    <LocalStorageContext.Provider value={{
      actions: actions,
      setActions: setActions,
      events: events,
      setEvents: setEvents,
      schedule: schedule,
      setSchedule: setSchedule,
      isDebug: isDebug,
      setIsDebug: setIsDebug,
    }}>
      <LoadingScreen
        // The "is-loading" state has to be owned at the root, else the child
        // editor will re-trigger the loading screen every time an edit is made.
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        {...props}
        >
        <Route exact path="/:configId/game" component={Board} />
        <Route exact path="/:configId/edit">
          <GameEditor saveId={match.params.configId ? match.params.configId : 0 } />
        </Route>
      </LoadingScreen>
    </LocalStorageContext.Provider>
  );
  const GameClient = Client({
    game: game,
    board: MaybeBoardOrEditor,
    numPlayers: 1,
    debug: isDebug,
  });
  return <GameClient {...props}/>
};

export default LocalStorageRouter;
