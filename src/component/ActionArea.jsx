import React, {
  useContext,
  useState,
} from "react";

import {
  Badge,
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
    moves 
  } = useContext(GameContext);
  const {
    type,
    displayName,
    description,
    moneyCost,
    actionCost,
    producesStatuses,
    producesEvents, // Visually indicate this.
    alwaysPresent, // Visually indicate this.
  } = Actions[cardId];
  const statusBadges = Object.keys(producesStatuses).map(k => (
    <Badge variant={producesStatuses[k].length > 0 ? "success" : "secondary"}>
      {(producesStatuses[k].length > 0 ? (producesStatuses[k]) : "None") + ": " + k}
    </Badge>
  ));
  return (
    <Card
      onClick={() => moves.performAction(type, slotId)}
      onMouseEnter={() => setIsSelected(true)}
      onMouseLeave={() => setIsSelected(false)}
      border="primary"
      bg={(isSelected && "info") || null }
    >
      <Card.Header>
        <Container fluid>
          <Row>
            <Col xs={1}>
              <Badge variant="warning">
                {moneyCost}
              </Badge>
            </Col>
            <Col xs={9}/>
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
      <Card.Footer>
        <p>Statuses:&nbsp;{statusBadges}</p>
      </Card.Footer>
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
      {actionCards.length > 0 ? actionCards :
        <Badge><h1>No Actions Available</h1></Badge>}
    </CardColumns>
  );
}

function ActionArea() {
  const {
    G,
    moves,
  } = useContext(GameContext);
  const {
    actionBoard,
  } = G;
  const cardTypes = Object.keys(actionBoard);
  const tabs = cardTypes.map((actionType) => (
    <Tab eventKey={actionType} title={actionType} key={actionType}>
      <ActionList actions={actionBoard[actionType]} />
    </Tab>
  ));
  return <Tabs defaultActiveKey={cardTypes[0]} id="actions">
    {tabs}
  </Tabs>
}

export default ActionArea;
