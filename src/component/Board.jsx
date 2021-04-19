import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Button,
  Container,
  Col,
  Modal,
  Row,
} from "react-bootstrap";

import {
  STATIC_ROOT,
} from "../Constants";

import GameContext from "../GameContext";
import GameInfo from "./GameInfo";
import ActionArea from "./ActionArea";
import MusicPlayer from "./MusicPlayer";

function EventModal(props) {
  const {
    G,
    moves,
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
  const {
    displayName,
    description,
    image,
  } = ev;
  const styles = {
    backgroundImage: image == null ? null : `url(${STATIC_ROOT}/${image})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
  };
  return (
    <Modal
      size = "lg"
      show = {show}
      onHide = {onHide}
      style = {styles}
      className = "event-modal"
      centered
    >
      <Modal.Header>
        <Modal.Title>
          {displayName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {description}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Continue</Button>
      </Modal.Footer>
    </Modal>
  );
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
  const [songUrl, playSong] = useState(null);
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
      songUrl: songUrl,
      playSong: playSong,
    }}>
      <div style={styles} id="bg-container"/>
      <div id="game-wrapper">
        <Container fluid id="game-container">
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
        <EventModal/>
      </div>
      <MusicPlayer songUrl={songUrl}/>
    </GameContext.Provider>
  );
}

export default Board;
