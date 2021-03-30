import React, {
  useContext,
} from "react";

import {
  Badge,
  ProgressBar,
  Table,
} from "react-bootstrap";

import { MAX_GROWTH_MINDSET } from "../Game";
import GameContext from "../GameContext";

const GROWTH_MINDSET_COLOR = {
  0: "danger",
  1: "danger",
  2: "danger",
  3: "warning",
  4: "success",
  5: "info",
};


function GameInfo() {
  const {
    G,
    ctx,
    moves,
  } = useContext(GameContext);
  const {
    growthMindsetPoints,
    money,
    attention,
    energy
  } = G;
  return (
    <Table responsive bordered id="player-info">
      <thead>
        <tr className="info-label-row">
          <th>Day #</th>
          <th>Growth Mindset</th>
          <th>Money</th>
          <th>Attention</th>
          <th>Energy</th>
        </tr>
      </thead>
      <tbody>
        <tr className="info-data-row">
          <td><Badge variant="dark">{ctx.turn}</Badge></td>
          <td>
            <ProgressBar
              now={(growthMindsetPoints * 100.0 /MAX_GROWTH_MINDSET).toPrecision(3)}
              label={growthMindsetPoints}
              variant={GROWTH_MINDSET_COLOR[growthMindsetPoints]}
              animated={growthMindsetPoints === MAX_GROWTH_MINDSET}
            />
          </td>
          <td><Badge variant="warning">{money}</Badge></td>
          <td><Badge variant="primary">{attention}</Badge></td>
          <td><Badge variant="success">{energy}</Badge></td>
        </tr>
      </tbody>
    </Table>
  );
}

export default GameInfo;
