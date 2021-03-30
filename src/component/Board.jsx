import React from "react";

import {
  Container,
  Row,
  Col
} from "react-bootstrap";

import GameContext from "../GameContext";
import GameInfo from "./GameInfo";
import ActionArea from "./ActionArea";

function Board(props) {
  const {
    G,
    ctx,
    moves,
  } = props;
  return (
    <GameContext.Provider value={{
      G: G,
      ctx: ctx,
      moves: moves
    }}>
      <Container fluid>
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
    </GameContext.Provider>
  );
}

export default Board;
