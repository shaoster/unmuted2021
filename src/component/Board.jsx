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
  const styles = {
    backgroundImage: image == null ? null : `url(${image})`,
    backgroundSize: "cover",
  };
  return (
    <Modal
      size = "lg"
      show = {show}
      onHide = {onHide}
      style = {styles} 
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
    backgroundImage: backgroundImage == null ? null : `url(${backgroundImage})`,
    backgroundSize: "cover",
  };
  console.log(styles);
  return (
    <GameContext.Provider value={{
      G: G,
      ctx: ctx,
      moves: moves
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
    </GameContext.Provider>
  );
}

export default Board;
