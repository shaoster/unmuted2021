import React, {
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import {
  Badge,
  Button,
  Tab,
  Tabs,
} from "react-bootstrap";

import {
  AREA_TYPE,
} from "../Constants";

import GameContext from "../GameContext";
import ActionCard from "./ActionCard";
import CardGroup from "./CardGroup";
import EventModal from "./EventModal";

function ActionCardFromStaticActions(props) {
  const { cardId, ...remainingProps } = props;
  const {
    actions,
  } = useContext(GameContext);
  return <ActionCard {...remainingProps} {...actions[cardId]} />
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

function Instructions(props) {
  const [ showActionLifecycle, setShowActionLifecycle ] = useState(false);
  const actionLifecycle = {
    displayName: "",
    image: "images/event/Instructions_3_2.png",
    description: "",
    addsCardsToDiscardPile: [],
    addsCardsToShop: [],
  };
  const actionLifeCycleModal = <EventModal event={actionLifecycle} show={showActionLifecycle} onHide={() => setShowActionLifecycle(false)} buttonText="Return to Game" />
  return <div className="confirm-next-turn">
    <h3>Useful Infographics</h3>
    <Button onClick={() => setShowActionLifecycle(true)} className="game">Action Lifecycle</Button>
    {actionLifeCycleModal}
  </div>
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
    switch (tab) {
      case AREA_TYPE.Opportunities:
        setHasNewOpps(false);
        setTab(tab);
        break;
      default:
        setTab(tab);
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
      <Tabs id="actions" activeKey={tab} onSelect={(k)=> switchTo(k)}>
        <Tab key="instructions" eventKey="instructions" title="?">
          <Instructions/>
        </Tab>
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
