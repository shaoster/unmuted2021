import React, { useContext } from "react";

import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import Button from "react-bootstrap/Card";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";
import Nav from "react-bootstrap/Nav";

import GameContext from "../GameContext";
import Actions from "../Action";

function ActionCard(props) {
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
    <Card style={{ width: "36rem" }} onClick={() => moves.performAction(type, slotId)}>
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
    <CardDeck>
      {actionCards}
    </CardDeck>
  );
}

function ActionNavItem(props) {
  const { actionType } = props;
  const route = "/" + actionType;
  return (
    <Nav.Item>
      <Nav.Link href={route}>{actionType}</Nav.Link>
    </Nav.Item>
  );
}

function ActionNav(props) {
  const { actionTypes } = props;
  const navActions = actionTypes.map((actionType) => (
    <ActionNavItem actionType={actionType} key={actionType} />
  ));
  return (
    <Nav justify variant="tabs">
      { navActions }
    </Nav>
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
  const defaultRoute = (
    <Route exact path="/">
      <Redirect to={"/" + cardTypes[0]}/>
    </Route>
  );
  const actionRoutes = cardTypes.map((actionType) => (
    <Route path={"/" + actionType} key={actionType}>
      <ActionList actions={actionBoard[actionType]} />
    </Route>
  ));
  return <>
    <Router>
      <ActionNav actionTypes = { cardTypes } />
      <Switch>
        {defaultRoute}
        {actionRoutes}
      </Switch>
    </Router>
  </>
}

export default ActionArea;
