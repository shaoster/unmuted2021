import React, {
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Badge,
  Button,
  Container,
  Col,
  Card,
  CardColumns,
  ListGroup,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";

import { run as runHolder } from 'holderjs/holder';
import { STATIC_ROOT } from "../Constants";
import GameContext from "../GameContext";
import {
  BoostGrowthMindset,
  Discard,
  Draw,
  Forget,
  ForgetSelf,
  Gain,
  YOLO,
} from "./Keyword";

function ActionCardFromStaticActions(props) {
  const { cardId } = props;
  const {
    actions,
  } = useContext(GameContext);
  console.log(actions);
  return <ActionCard {...props} {...actions[cardId]} />
}

export function ActionCard(props) {
  const [isSelected, setIsSelected] = useState(false);
  const {
    areaType,
    onClick,
    ref,
    gameStage,
    displayName,
    displayNameInShop,
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
    forgetsOnDiscard,
    forgetsSelf,
    forgetsCards,
  } = props;
  useEffect(() => {
    if (image === null) {
      runHolder("card-image");
    }
  }, [image]);
  return (
    <Card
      ref = {ref}
      onClick={onClick}
      onMouseEnter={() => setIsSelected(true)}
      onMouseLeave={() => setIsSelected(false)}
      bg={gameStage === "discard" || gameStage === "forget" ? "danger" : null}
      border={isSelected ? "warning" : "secondary"}
      className="action-card"
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
        <Card.Title>{areaType === "Shop" && displayNameInShop ? displayNameInShop : displayName}</Card.Title>
        <Card.Img src={image !== null ? `${STATIC_ROOT}/${image}` : "holder.js/256x144"} className="card-image"/>
        <ListGroup className="extra-rules">
          {
            (producesGrowthMindset > 0) && (
              <ListGroup.Item key="growth-mindset"><BoostGrowthMindset number={producesGrowthMindset}/></ListGroup.Item>
            )
          }
          {
            (drawsCards > 0) && (
              <ListGroup.Item key="draws-cards"><Draw number={drawsCards}/></ListGroup.Item>
            )
          }
          {
            (discardsCards > 0) && (
              <ListGroup.Item key="discards-cards"><Discard number={discardsCards}/></ListGroup.Item>
            )
          }
          {
            (forgetsOnDiscard) && (
              <ListGroup.Item key="forgets-on-discard"><YOLO/></ListGroup.Item>
            )
          }
          {
            (forgetsSelf) && (
              <ListGroup.Item key="forgets-self"><ForgetSelf/></ListGroup.Item>
            )
          }
          {
            (forgetsCards > 0) && (
              <ListGroup.Item key="forgets-cards"><Forget number={forgetsCards}/></ListGroup.Item>
            )
          }
          {
            gainsCards.map((cardId, gainedCardIndex) =>
              <ListGroup.Item key={"gains-" + gainedCardIndex}>
                <Gain
                  cardId={cardId}
                  renderCard={ActionCard}
                  tooltipClassName="card-preview"
                  runEffect={()=>runHolder("card-image")}
                />
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
  const { actionsList, className, onClick, gameStage } = props;
  const actionCards = actionsList.map((actionId, slotId) => (
    <ActionCardFromStaticActions
      areaType={className}
      cardId={actionId}
      key={slotId}
      onClick={() => onClick(slotId)}
      gameStage={gameStage} />
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
  const gameStage = isDiscard ? "discard" : isForget ? "forget" : null;
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
      <ActionList
        actionsList={actionData[areaType].actions}
        className={areaType}
        onClick={actionData[areaType].onClick}
        gameStage={gameStage}
      />
    </Tab>
  ));
  return (
    <div id="game-tabs">
      <Tabs id="actions" activeKey={tab} onSelect={(k)=>setTab(k)}>
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
    </div>
  )
}

export default ActionArea;
