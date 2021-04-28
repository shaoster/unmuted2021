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
  ListGroup,
  Pagination,
  Row,
  Tab,
  Tabs,
} from "react-bootstrap";

import {
  AREA_TYPE,
  STATIC_ROOT,
} from "../Constants";
import GameContext from "../GameContext";
import {
  BoostGrowthMindset,
  BoostStudy,
  Discard,
  Draw,
  Forget,
  ForgetSelf,
  Gain,
  YOLO,
} from "./Keyword";

const _ = require("lodash");
const classNames = require("classnames");

function Paginated(props) {
  const {
    children,
    ...remainingProps
  } = props;
  const [ currentPageIndex, setCurrentPageIndex ] = useState(0);
  const navs = (
    <Pagination>
      {
        children.map((child, index) => (
          <Pagination.Item
            key={index + 1}
            active={index===currentPageIndex}
            onClick={()=>setCurrentPageIndex(index)}
          >
            {index + 1}
          </Pagination.Item>
        ))
      }
    </Pagination>
  );
  return <div {...remainingProps}>
    {children[currentPageIndex]}
    {navs}
  </div>;
}

export function CardGroup(props) {
  const {
    label,
    maxColumns,
    maxRows,
    children,
    ...remainingProps
  } = props;
  const rows = _.chunk(children, (maxColumns || 4));
  const pages = _.chunk(rows, (maxRows || 1));
  const listGroups = pages.map((childPage, pageIndex) => <div key={pageIndex}>
    {
      childPage.map((childRow, rowIndex) => (
        <ListGroup horizontal className="card-row" key={rowIndex}>
          {
            childRow.map((child) => (
              <ListGroup.Item>
                {child}
              </ListGroup.Item>
            ))
          }
        </ListGroup>
      ))
    }
  </div>);
  console.log(listGroups);
  return <div {...remainingProps}>
    {children.length > 0 && label && <p><Badge>{label}</Badge></p> }
    {
      rows.length > (maxRows || 1) ?
        <Paginated>{listGroups}</Paginated> : listGroups
    }
  </div>;
}

function ActionCardFromStaticActions(props) {
  const { cardId } = props;
  const {
    actions,
  } = useContext(GameContext);
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
    producesStudyPoints,
    drawsCards,
    discardsCards,
    gainsCards,
    forgetsOnDiscard,
    forgetsSelf,
    forgetsCards,
  } = props;
  const isSpecialHandSelectionStage = (
    (areaType === AREA_TYPE.Hand) &&
    (gameStage === "discard" || gameStage === "forget")
  );
  const bg = isSpecialHandSelectionStage ? "danger" : null;
  const className = classNames({
    "action-card": true,
    "special-condition": isSpecialHandSelectionStage
  });
  return (
    <Card
      ref = {ref}
      onClick={onClick}
      onMouseEnter={() => setIsSelected(true)}
      onMouseLeave={() => setIsSelected(false)}
      bg={bg}
      border={isSelected ? "warning" : "secondary"}
      className={className}
    >
      <Card.Header>
        <Container fluid>
          <Row>
            <Col xs={4} className="cost-label">
                Makes:
            </Col>
            <Col xs={3}/>
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
        <Card.Title>{areaType === AREA_TYPE.Opportunities && displayNameInShop ? displayNameInShop : displayName}</Card.Title>
        <Card.Img src={image !== null ? `${STATIC_ROOT}/${image}` : `${STATIC_ROOT}/images/card/Placeholder_16_9.svg`} className="card-image"/>
        <ListGroup className="extra-rules">
          {
            (producesGrowthMindset > 0) && (
              <ListGroup.Item key="growth-mindset"><BoostGrowthMindset number={producesGrowthMindset}/></ListGroup.Item>
            )
          }
          {
            (producesStudyPoints > 0) && (
              <ListGroup.Item key="boost-study"><BoostStudy number={producesStudyPoints}/></ListGroup.Item>
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
                  runEffect={()=>{}}
                />
              </ListGroup.Item>
            )
          }
        </ListGroup>
        <Card.Text className="flavor">
          {description}
        </Card.Text>
      </Card.Body>
      <Card.Footer className={areaType}>
        <Container fluid>
          <Row>
            <Col xs={6} className={`cost-label`}>
                { areaType === AREA_TYPE.Opportunities ? "To Obtain:" : "Obtained For:" }
            </Col>
            <Col xs={1}/>
            <Col xs={1}>
              <Badge variant="warning">
                {moneyCost}
              </Badge>
            </Col>
            <Col xs={1}>
              <Badge variant="primary">1</Badge>
            </Col>
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
    <CardGroup className={"action-list-" + className} maxRows={2} key={className}>
      {actionCards.length > 0 ? actionCards :
        <Badge><h1>No Actions Available</h1></Badge>}
    </CardGroup>
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
    [AREA_TYPE.Hand]: {
      actions: hand,
      onClick: isDiscard ? moves.discardAction: isForget ? moves.forgetAction : moves.performAction
    },
    [AREA_TYPE.Opportunities]: {
      actions: actionShop,
      onClick: isDiscard ? noop : moves.buyAction
    },
    [AREA_TYPE.Deck]: {
      actions: [...deck].sort(), // Hide the order of the cards.
      onClick: noop
    },
    [AREA_TYPE.DiscardPile]: {
      actions: discard,
      onClick: noop
    },
  };
  const [tab, setTab] = useState(AREA_TYPE.Hand);
  const [hasNewOpps, setHasNewOpps] = useState(false);
  const switchTo = (tab) => {
    setTab(tab);
    switch (tab) {
      case AREA_TYPE.Opportunities:
        setHasNewOpps(false);
        break;
      default:
        break;
    }
  };
  // Whenever we update the action shop, update this flag.
  useEffect(() => {
    if (actionShop.length > 0 && tab !== AREA_TYPE.Opportunities) {
      setHasNewOpps(true);
    }
    // We take an undeclared dependency on `tab` because changes to the tab
    // should never trigger this effect.
    // eslint-disable-next-line
  }, [actionShop, setHasNewOpps]);
  const getTitle = (areaType) => {
    switch (areaType) {
      case AREA_TYPE.Opportunities:
        return <p>{areaType} {hasNewOpps && <Badge variant="info">New</Badge>}</p>
      default:
        return <p>{areaType}</p>;
    }
  }
  const tabs = Object.keys(actionData).map((areaType) => (
    <Tab eventKey={areaType} title={getTitle(areaType)} key={areaType} disabled={actionData[areaType].actions.length === 0}>
      <ActionList
        actionsList={actionData[areaType].actions}
        className={areaType}
        onClick={actionData[areaType].onClick}
        gameStage={gameStage}
      />
    </Tab>
  ));
  return (
    <div className="game-tabs">
      <Tabs id="actions" activeKey={tab} onSelect={(k)=>switchTo(k)}>
        {tabs}
        <Tab eventKey="next-turn" title="Next Turn" key="next-turn">
          <div className="confirm-next-turn">
            <Button
              onClick={() => {
                moves.endTurn();
                setTab(AREA_TYPE.Hand);
              }}
            >
              Confirm End Turn
            </Button>
          </div>
        </Tab>
      </Tabs>
    </div>
  )
}

export default ActionArea;
