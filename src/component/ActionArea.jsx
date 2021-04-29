import React, {
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import {
  CSSTransition,
  TransitionGroup,
} from "react-transition-group";

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

function MaybeAnimatedListGroup({children, key, isAnimated}) {
  let content;
  if (isAnimated) {
    content = (
      <TransitionGroup component={null}>
        {
          children.map((child) =>
            (
              <CSSTransition
                key={child.key}
                appear={true}
                enter={true}
                exti={true}
                classNames="action-card"
                timeout={300}
              >
                {child}
              </CSSTransition>
            )
          )
        }
      </TransitionGroup>
    );
  } else {
    content = children;
  }
  return <ListGroup key={key} horizontal className="card-row">
    {content}
  </ListGroup>;
}

export function CardGroup(props) {
  const {
    label,
    maxColumns,
    maxRows,
    children,
    isAnimated,
    ...remainingProps
  } = props;
  const rows = _.chunk(children, (maxColumns || 4));
  const pages = _.chunk(rows, (maxRows || 1));
  const listGroups = pages.map((childPage, pageIndex) => <div key={pageIndex}>
    {
      childPage.map((childRow, rowIndex) => (
          <MaybeAnimatedListGroup isAnimated={isAnimated} key={rowIndex}>
            {
              childRow.map((child) => (
                <ListGroup.Item key={child.key}>
                  {child}
                </ListGroup.Item>
              ))
            }
          </MaybeAnimatedListGroup>
      ))
    }
  </div>);
  return <div {...remainingProps}>
    {children.length > 0 && label && <p><Badge>{label}</Badge></p> }
    {
      rows.length > (maxRows || 1) ?
        <Paginated>{listGroups}</Paginated> : listGroups
    }
  </div>;
}

function ActionCardFromStaticActions(props) {
  const { cardId, ...remainingProps } = props;
  const {
    actions,
  } = useContext(GameContext);
  return <ActionCard {...remainingProps} {...actions[cardId]} />
}

export function ActionCard(props) {
  const {
    areaType,
    canClickAction,
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
  const className = classNames({
    "action-card": true,
    "special-condition": isSpecialHandSelectionStage,
    "action-card-disabled": !canClickAction,
  });
  const overlayClass = classNames({
    "action-overlay": true,
    "special-condition": isSpecialHandSelectionStage,
    "action-card-disabled": !canClickAction,
  });
  return (
    <Card
      ref = {ref}
      onClick={onClick}
      className={className}
    >
      <div className={overlayClass}>
        {
          !canClickAction ? "NOT AVAILABLE" :
          gameStage ? gameStage.toUpperCase() : ""
        }
      </div>
      <Card.Header>
        <Container fluid>
          <Row>
            <Col xs={4} className="cost-label">
                Makes:
            </Col>
            <Col xs={3}/>
            <Col xs={1}>
              <Badge className="resource money">
                {producesMoney}
              </Badge>
            </Col>
            <Col xs={1}>
              <Badge className="resource attention">
                {producesAttention}
              </Badge>
            </Col>
            <Col xs={1}>
              <Badge className="resource energy">
                {producesEnergy}
              </Badge>
            </Col>
          </Row>
        </Container>
      </Card.Header>
      <Card.Body>
        <Card.Title>{areaType === AREA_TYPE.Opportunities && displayNameInShop ? displayNameInShop : displayName}</Card.Title>
        <div className="card-image">
          <Card.Img src={image !== null ? `${STATIC_ROOT}/${image}` : `${STATIC_ROOT}/images/card/Placeholder_16_9.svg`} className="card-image"/>
        </div>
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
              <Badge className="resource money">
                {moneyCost}
              </Badge>
            </Col>
            <Col xs={1}>
              <Badge className="resource attention">1</Badge>
            </Col>
            <Col xs={1}>
              <Badge className="resource energy">
                {energyCost}
              </Badge>
            </Col>
          </Row>
        </Container>
      </Card.Footer>
    </Card>
  );
}

function PlayableActionList(props) {
  const { actionsList, className, canClick, onClick, gameStage } = props;
  const { ctx } = useContext(GameContext);
  // When a card is clicked, one or more of the following can happen:
  // - The card is removed from the list.
  // - More cards are added to the end of the list.
  // - The list is totally cleared/redealt (new turn);
  // The reducer just uses this knowledge to assign stable ids to the actions.
  const initialActionsWithId = ({actionIds, turn}) => ({
    turn: turn,
    actions: actionIds.map(
      (a, i) => ({uniqueId: i, actionId:a})
    ),
  });
  const reducer = (state, update) => {
    switch (update.type) {
      case "new-turn": {
        if (state.turn !== update.turn) {
          return initialActionsWithId({
            actionIds: update.actionIds,
            turn: update.turn,
          })
        }
        return state;
      }
      case "actions-updated": {
        const newActionsWithId = [...state.actions];
        if (update.actionIds.length === 0) {
          return {
            ...state,
            actions: []
          };
        }
        if (newActionsWithId.length >= update.actionIds.length) {
          // Already handled.
          return {
            ...state,
            actions: newActionsWithId,
          };
        }
        while (newActionsWithId.length < update.actionIds.length) {
          const firstNewIndex = newActionsWithId.length;
          // Our IDs are stable as long as items are present, but each new item
          // we see should get a unique identifier.
          const uniqueId = Math.random();
          newActionsWithId.push({
            uniqueId: uniqueId,
            actionId: update.actionIds[firstNewIndex],
          });
        }
        return {
          ...state,
          actions: newActionsWithId
        };
      }
      case "action-clicked": {
        const newActionsWithId = [...state.actions];
        const indexOfUniqueId = newActionsWithId.findIndex(({uniqueId}) => uniqueId === update.uniqueId);
        newActionsWithId.splice(indexOfUniqueId, 1);
        return {
          ...state,
          actions: newActionsWithId,
        };
      }
      default:
        throw new Error("Unrecognized update type: " + update.type);
    }
  }

  const [ actionsWithId, dispatchActionsUpdate ] = useReducer(
    reducer,
    {
      turn: ctx.turn,
      actionIds: actionsList,
    },
    initialActionsWithId
  );

  useEffect(() => {
    dispatchActionsUpdate({
      type: "new-turn",
      turn: ctx.turn,
      actionIds: actionsList,
    });
  }, [ctx.turn, actionsList]);

  useEffect(() => {
    dispatchActionsUpdate({
      type: "actions-updated",
      actionIds: actionsList
    })
  }, [actionsList]);

  const removeByUniqueId = (uniqueId) => {
    dispatchActionsUpdate({
      type: "action-clicked",
      uniqueId: uniqueId,
    });
  };
  const isAnimated = [AREA_TYPE.Opportunities, AREA_TYPE.Hand].indexOf(className) >= 0;
  const actionGenerator = isAnimated ? actionsWithId.actions :
    actionsList.map((actionId, slotId) => ({actionId: actionId, uniqueId: slotId}));
  const actionCards = actionGenerator.map(({actionId, uniqueId}, slotId) => {
    // Gives us a hint to preserve keys.
    const canClickAction = canClick(actionId);
    const augmentedOnClick = () => {
      if (!canClickAction) {
        return;
      }
      removeByUniqueId(uniqueId);
      onClick(slotId);
    };
    return (
      <ActionCardFromStaticActions
        areaType={className}
        cardId={actionId}
        key={`${className}-action-card-${actionId}-${uniqueId}`}
        onClick={augmentedOnClick}
        canClickAction={canClickAction}
        gameStage={gameStage}
      />
    );
  });
  return (
    <CardGroup
      className={"action-list-" + className}
      maxRows={2}
      key={className}
      isAnimated={isAnimated}
    >
      {actionCards}
    </CardGroup>
  );
}

function ActionArea() {
  const {
    G,
    ctx,
    moves,
    actions,
  } = useContext(GameContext);
  const {
    hand,
    actionShop,
    deck,
    discard,
  } = G;
  const noop = (x) => {};
  const specialCondition = (ctx.activePlayers && ctx.activePlayers[ctx.playOrderPos]) || null;
  const isDiscard = specialCondition === "discard";
  const isForget = specialCondition === "forget";

  const gameStage = isDiscard ? "discard" : isForget ? "forget" : null;
  const actionData = {
    // actions : the sequence of actions to render.
    // canClick: a function for checking whether a given action can be clicked.
    // onClick : what happens when you click the action.
    [AREA_TYPE.Hand]: {
      actions: hand,
      canClick: (isDiscard || isForget) ? () => true :
        (actionId) => actions[actionId].canPerform(G, ctx),
      onClick: isDiscard ? moves.discardAction:
        isForget ? moves.forgetAction : moves.performAction
    },
    [AREA_TYPE.Opportunities]: {
      actions: actionShop,
      canClick: (isDiscard || isForget) ? () => false :
        (actionId) => actions[actionId].canBuy(G, ctx),
      onClick: (isDiscard || isForget) ? noop : moves.buyAction
    },
    [AREA_TYPE.Deck]: {
      actions: deck,
      canClick: () => false,
      onClick: noop
    },
    [AREA_TYPE.DiscardPile]: {
      actions: discard,
      canClick: () => false,
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
        return <>{areaType} {hasNewOpps && <Badge className="new-cards">New</Badge>}</>
      default:
        return <>{areaType}</>;
    }
  }
  const tabs = Object.keys(actionData).map((areaType) => (
    <Tab eventKey={areaType} title={getTitle(areaType)} key={"tab-" + areaType} disabled={actionData[areaType].actions.length === 0}>
      <PlayableActionList
        key={"action-list-" + areaType}
        actionsList={actionData[areaType].actions}
        className={areaType}
        canClick={actionData[areaType].canClick}
        onClick={actionData[areaType].onClick}
        gameStage={gameStage}
      />
    </Tab>
  ));
  return (
    <div className="game-tabs">
      <Tabs id="actions" activeKey={tab} onSelect={(k)=>switchTo(k)}>
        {tabs}
        <Tab eventKey="next-turn" title={specialCondition ? specialCondition.toUpperCase() + "ING..." : "Next Turn"} key="next-turn" disabled={specialCondition}>
          <div className="confirm-next-turn">
            <Button
              onClick={() => {
                moves.endTurn();
                setTab(AREA_TYPE.Hand);
              }}
              className="game"
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
