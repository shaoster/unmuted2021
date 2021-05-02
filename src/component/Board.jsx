import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Container,
  Col,
  Row,
} from "react-bootstrap";

import {
  STATIC_ROOT,
  TERMINAL_STATE,
} from "../Constants";

import GameContext from "../GameContext";
import ActionArea from "./ActionArea";
import EventModal from "./EventModal";
import GameInfo from "./GameInfo";
import MusicPlayer from "./MusicPlayer";

function Event(props) {
  const {
    G,
    moves,
    actions,
    events,
    playSong,
  } = useContext(GameContext);
  const show = G.currentEvent in events;
  const onHide = () => moves.dismiss();
  const ev = events[G.currentEvent];
  useEffect(() => {
    if (ev && ev.song && show) {
      playSong(ev.song);
    }
  }, [ev, playSong, show]);
  if (!show) {
    return <></>;
  }
  return <EventModal
    actions={actions}
    event={ev}
    show={show}
    onHide={onHide}
  />
}

const Board = function(props) {
  const {
    G,
    ctx,
    moves,
    plugins,
  } = useContext(GameContext);
  const actions = plugins.actions.api.getActions();
  const events = plugins.schedule.api.getEvents();
  const specialEvents = plugins.schedule.api.getSpecialEvents();
  const [songUrl, playSong] = useState(null);
  if (ctx.gameover) {
    let eventId;
    switch (ctx.gameover) {
      case TERMINAL_STATE.Win:
        eventId = specialEvents.win;
        break;
      case TERMINAL_STATE.FixedMindset:
        eventId = specialEvents.fixedMindset;
        break;
      case TERMINAL_STATE.FailedExam:
        eventId = specialEvents.failedExam;
        break;
      default:
        throw new Error(`Unknown terminal state: ${G.gameover}`);
    }
    const event = events[eventId];
    return <EventModal
      event={event}
      show={true}
      onHide={()=>window.location.reload()}
    />
  }
  const {
    backgroundImage
  } = G;
  const styles = {
    backgroundImage: backgroundImage == null ? null : `url(${STATIC_ROOT}/${backgroundImage})`,
    backgroundSize: "cover",
  };
  // Game has started.
  return (
    <GameContext.Provider value={{
      G: G,
      ctx: ctx,
      moves: moves,
      actions: actions,
      events: events,
      specialEvents: specialEvents,
      plugins: plugins,
      songUrl: songUrl,
      playSong: playSong,
    }}>
      {
        !(G.currentEvent in events) ? (
          <Container fluid id="game-container" style={styles}>
            <Row>
              <Col>
                <GameInfo/>
              </Col>
            </Row>
            <Row>
              <Col>
                <ActionArea/>
              </Col>
            </Row>
          </Container>
        ) : <Event/>
      }
      <MusicPlayer songUrl={songUrl}/>
    </GameContext.Provider>
  );
}

export default Board;
