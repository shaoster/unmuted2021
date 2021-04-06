import React, {
  useContext,
} from "react";

import {
  Button,
  Container,
  Col,
  Modal,
  Row,
} from "react-bootstrap";

import GameContext from "../GameContext";
import GameInfo from "./GameInfo";
import ActionArea from "./ActionArea";

import Events from "../Event";

function EventModal(props) {
  const {
    G,
    moves,
  } = useContext(GameContext);
  console.log(moves);
  const show = G.currentEvent in Events;
  if (!show) {
    return <></>;
  }
  const onHide = () => moves.dismiss();
  const ev = Events[G.currentEvent];
  const {
    displayName,
    description,
    image,
  } = ev;
  return (
    <Modal
      size = "lg"
      show = {show}
      onHide = {onHide}
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
function Board(props) {
  const {
    G,
    ctx,
    moves,
  } = props;

  const {
    backgroundImage
  } = G;
  const styles = {
    backgroundImage: backgroundImage == null ? null : `url(${backgroundImage})`
  };
  return (
    <GameContext.Provider value={{
      G: G,
      ctx: ctx,
      moves: moves
    }}>
      <Container fluid id="game-container" styles={styles}>
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
    </GameContext.Provider>
  );
}

export default Board;
