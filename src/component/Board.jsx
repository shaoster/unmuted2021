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
  Tab,
  Tabs,
} from "react-bootstrap";

import {
  AREA_TYPE,
  STATIC_ROOT,
} from "../Constants";

import GameContext from "../GameContext";
import GameInfo from "./GameInfo";
import ActionArea, {
  ActionCard,
  CardGroup,
} from "./ActionArea";
import MusicPlayer from "./MusicPlayer";

export function EventModal(props) {
  const {
    actions,
    event,
    show,
    onHide,
    ...remainingProps
  } = props;
  const {
    addsCardsToDiscardPile,
    addsCardsToShop,
    displayName,
    description,
    image,
  } = event;
  const styles = {
    backgroundImage: image == null ? null : `url(${STATIC_ROOT}/${image})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
  };
  const getTab = (actionList, key, label) => {
    if (actionList.length === 0) {
      return [];
    }
    const actionCards = actionList.map((actionId, index) => (
      <ActionCard
        areaType={label}
        key={index}
        cardId={actionId}
        onClick={()=>{}}
        {...actions[actionId]}
      />
    ));
    return <Tab eventKey={key} title={label}>
      <CardGroup>
        {actionCards}
      </CardGroup>
    </Tab>;
  };
  const newActionsTab = getTab(
    addsCardsToDiscardPile, "new-actions", "Actions"
  );
  const newOpportunitiesTab = getTab(
    addsCardsToShop, "new-opportunites", AREA_TYPE.Opportunities
  );
  return (
    <Modal
      size = "xl"
      show = {show}
      onHide = {onHide}
      style = {styles}
      className = "event-modal"
      centered
      {...remainingProps}
    >
      <Modal.Header>
        <Modal.Title>
          {displayName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="game-tabs">
        <p>{description}</p>
        <Tabs>
          {newActionsTab}
          {newOpportunitiesTab}
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Continue</Button>
      </Modal.Footer>
    </Modal>
  );
}

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
      plugins: plugins,
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
        <Event/>
      </div>
      <MusicPlayer songUrl={songUrl}/>
    </GameContext.Provider>
  );
}

export default Board;
