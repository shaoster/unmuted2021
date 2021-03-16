import React from "react";

import {
  Container,
  Row,
  Col
} from "react-bootstrap";

import GameContext from "../GameContext";
import PlayerInfo from "./PlayerInfo";
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
      <Container fluid>
        <Row>
          <Col>
            <h1>Apex 2021</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <PlayerInfo/> 
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
