import React, {
  useContext,
} from "react";

import {
  Badge,
  Table,
} from "react-bootstrap";

import GameContext from "../GameContext";

function Statuses(props) {
  const { statuses } = props;
  const statusBadges = Object.keys(statuses).map((s) => (
    <Badge pill variant="danger">
      {s}
    </Badge>
  ));
  return <>{statusBadges}</>
}

function GameInfo() {
  const {
    G,
    ctx,
    moves,
  } = useContext(GameContext);
  const {
    money,
    actionPoints,
    interviewStrength,
    statuses,
  } = G;
  console.log(G);
  return (
    <Table responsive bordered id="player-info">
      <thead>
        <tr>
          <th>Day #</th>
          <th>Money</th>
          <th>Action Points</th>
          <th>Interview Strength</th>
          <th>Active Statuses</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><Badge variant="dark">{ctx.turn}</Badge></td>
          <td><Badge variant="warning">{money}</Badge></td>
          <td><Badge variant="primary">{actionPoints}</Badge></td>
          <td><Badge variant="success">{interviewStrength}</Badge></td>
          <td><Statuses statuses={statuses}/></td>
        </tr>
      </tbody>
    </Table>
  );
}

export default GameInfo;
