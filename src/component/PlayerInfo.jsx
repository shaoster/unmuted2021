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

function PlayerInfo() {
  const {
    G,
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
          <th>Money</th>
          <th>Action Points</th>
          <th>Interview Strength</th>
          <th>Active Statuses</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{money}</td>
          <td>{actionPoints}</td>
          <td>{interviewStrength}</td>
          <td><Statuses statuses={statuses}/></td>
        </tr>
      </tbody>
    </Table>
  );
}

export default PlayerInfo;
