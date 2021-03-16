import React, {
  useContext,
  useState,
} from "react";

import {
  Badge,
  Button,
  Container,
  Col,
  Card,
  CardColumns,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";

import GameContext from "../GameContext";
import Actions from "../Action";

function ActionCard(props) {
  const [isSelected, setIsSelected] = useState(false);
  const { cardId, slotId } = props;
  const {
    G,
    moves 
  } = useContext(GameContext);
  const {
    type,
    displayName,
    description,
    moneyCost,
    actionCost,
    producesEvents,
    alwaysPresent
  } = Actions[cardId];
  return (
    <Card
      onClick={() => moves.performAction(type, slotId)}
      onMouseEnter={() => setIsSelected(true)}
      onMouseLeave={() => setIsSelected(false)}
      border="primary"
      bg={isSelected && "info" || null }
    >
      <Card.Header>
        <Container fluid>
          <Row>
            <Col xs={1}>
              <Badge variant="warning">
                {moneyCost}
              </Badge>
            </Col>
            <Col xs={8}/>
            <Col xs={1}>
              <Badge variant="primary">
                {actionCost}
              </Badge>
            </Col>
          </Row>
        </Container>
      </Card.Header>
      <Card.Body>
        <Card.Title>{displayName}</Card.Title>
        <Card.Text>{description}</Card.Text>
      </Card.Body>
    </Card>
  );
}

function ActionList(props) {
  const { actions } = props;
  const actionCards = actions.map((actionId, slotId) => (
    <ActionCard cardId={actionId} slotId={slotId} key={slotId}/>
  ));
  console.log(actionCards);
  return (
    <CardColumns>
      {actionCards}
    </CardColumns>
  );
}

function ActionArea() {
  const {
    G,
    moves 
  } = useContext(GameContext);
  const {
    actionBoard,
  } = G;
  const cardTypes = Object.keys(actionBoard);
  const tabs = cardTypes.map((actionType) => (
    <Tab eventKey={actionType} title={actionType}>
      <ActionList actions={actionBoard[actionType]} />
    </Tab>
  ));
  return <Tabs defaultActiveKey={cardTypes[0]} id="actions">
    {tabs}
  </Tabs>
}

export default ActionArea;
