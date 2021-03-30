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
  Image,
  ListGroup,
  OverlayTrigger,
  Row,
  Tab,
  Tabs,
  Tooltip
} from "react-bootstrap";

import GameContext from "../GameContext";
import Actions from "../Action";

function CardReference(props) {
  const { cardId, slotId } = props;
  console.log(cardId);
  return (
    <OverlayTrigger
      id={"trigger-" + slotId}
      placement="right"
      overlay={<Tooltip id="card-preview"><ActionCard cardId={cardId} onClick={(s)=>{}}/></Tooltip>}
    >
      <b>{Actions[cardId].displayName}</b>
    </OverlayTrigger>
  );
}

function ActionCard(props) {
  const [isSelected, setIsSelected] = useState(false);
  const { cardId, slotId, onClick } = props;
  const {
    ctx,
  } = useContext(GameContext);
  const {
    displayName,
    image,
    description,
    moneyCost,
    energyCost,
    producesGrowthMindset,
    producesMoney,
    producesAttention,
    producesEnergy,
    drawsCards,
    discardsCards,
    gainsCards,
    forgetsSelf,
    forgetsCards,
  } = Actions[cardId];
  const isDiscard = ctx.activePlayers && ctx.activePlayers[ctx.playOrderPos] === "discard";
  const isForget = ctx.activePlayers && ctx.activePlayers[ctx.playOrderPos] === "forget";
  console.log(onClick);
  return (
    <Card
      onClick={() => onClick(slotId)}
      onMouseEnter={() => setIsSelected(true)}
      onMouseLeave={() => setIsSelected(false)}
      bg={isDiscard || isForget ? "danger" : null}
      border={isSelected ? "warning" : "secondary"}
    >
      <Card.Header>
        <Container fluid>
          <Row>
            <Col xs={4} className="cost-label">
                Makes:
            </Col>
            <Col xs={4}/>
            <Col xs={1}>
              <Badge variant="warning">
                {producesMoney}
              </Badge>
            </Col>
            <Col xs={1}>
              <Badge variant="primary">
                {producesAttention}
              </Badge>
            </Col>
            <Col xs={1}>
              <Badge variant="success">
                {producesEnergy}
              </Badge>
            </Col>
          </Row>
        </Container>
      </Card.Header>
      <Card.Body>
        <Card.Title>{displayName}</Card.Title>
        <Image src={image} rounded className="card-image"/>
        <ListGroup className="extra-rules">
          { 
            (producesGrowthMindset > 0) && (
              <ListGroup.Item>+{producesGrowthMindset} <b>Growth Mindset</b></ListGroup.Item>
            )
          }
          { 
            (drawsCards > 0) && (
              <ListGroup.Item><b>Draw</b> {drawsCards}</ListGroup.Item>
            )
          }
          {
            (discardsCards > 0) && (
              <ListGroup.Item><b>Discard</b> {discardsCards}</ListGroup.Item>
            )
          }
          {
            (forgetsSelf) && (
              <ListGroup.Item><b>Forget</b> <em>Self</em></ListGroup.Item>
            )
          }
          { 
            (forgetsCards > 0) && (
              <ListGroup.Item><b>Forget</b> {forgetsCards}</ListGroup.Item>
            )
          }
          {
            gainsCards.map((cardId) => <ListGroup.Item>
                Gain <CardReference cardId={cardId} slotId={slotId}/>
              </ListGroup.Item>
            )
          }
        </ListGroup>
        <Card.Text className="flavor">
          {description}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        <Container fluid>
          <Row>
            <Col xs={4} className="cost-label">
                Costs:
            </Col>
            <Col xs={4}/>
            <Col xs={1}>
              <Badge variant="warning">
                {moneyCost}
              </Badge>
            </Col>
            <Col xs={1}/>
            <Col xs={1}>
              <Badge variant="success">
                {energyCost}
              </Badge>
            </Col>
          </Row>
        </Container>
      </Card.Footer>
    </Card>
  );
}

function ActionList(props) {
  const { actions, className, onClick } = props;
  const actionCards = actions.map((actionId, slotId) => (
    <ActionCard cardId={actionId} slotId={slotId} key={slotId} onClick={onClick} />
  ));
  return (
    <CardColumns className={"action-list-" + className}>
      {actionCards.length > 0 ? actionCards :
        <Badge><h1>No Actions Available</h1></Badge>}
    </CardColumns>
  );
}

function ActionArea() {
  const {
    G,
    ctx,
    moves,
  } = useContext(GameContext);
  const {
    hand,
    actionShop,
    deck,
    discard,
  } = G;
  const noop = (x) => {};
  const isDiscard = ctx.activePlayers && ctx.activePlayers[ctx.playOrderPos] === "discard";
  const isForget = ctx.activePlayers && ctx.activePlayers[ctx.playOrderPos] === "forget";
  const actionData = {
    "Hand": {
      actions: hand,
      onClick: isDiscard ? moves.discardAction: isForget ? moves.forgetAction : moves.performAction
    },
    "Shop": {
      actions: actionShop,
      onClick: isDiscard ? noop : moves.buyAction
    },
    "Deck": {
      actions: [...deck].sort(), // Hide the order of the cards.
      onClick: noop
    },
    "Discard Pile": {
      actions: discard,
      onClick: noop
    },
  };
  const [tab, setTab] = useState("Hand");
  const tabs = Object.keys(actionData).map((areaType) => (
    <Tab eventKey={areaType} title={areaType} key={areaType}>
      <ActionList actions={actionData[areaType].actions} onClick={actionData[areaType].onClick} className={areaType}/>
    </Tab>
  ));
  return <Tabs id="actions" activeKey={tab} onSelect={(k)=>setTab(k)}>
    {tabs}
    <Tab eventKey="next-turn" title="Next Turn" key="next-turn">
      <Button
        onClick={() => {
          moves.endTurn();
          setTab("Hand");
        }}
        className="confirm-next-turn"
      >
        Confirm End Turn
      </Button>
    </Tab>
  </Tabs>
}

export default ActionArea;
