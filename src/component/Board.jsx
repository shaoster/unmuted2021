import React from "react";

import {
  Container,
  Row,
  Col
} from "react-bootstrap";

import GameContext from "../GameContext";
import ActionArea from "./ActionArea";

function Board(props) {
  const {
    G,
    moves
  } = props;
  return (
    <GameContext.Provider value={{
      G: G,
      moves: moves
    }}>
      <Container>
        <Row></Row>
        <Row>
          <Col xs={8}>
            <ActionArea/>
          </Col>
        </Row>
      </Container>
    </GameContext.Provider>
  );
}

export default Board;
