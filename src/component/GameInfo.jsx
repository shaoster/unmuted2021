import React, {
  useContext,
} from "react";

import {
  Badge,
  ProgressBar,
  Table,
} from "react-bootstrap";

import { MAX_GROWTH_MINDSET } from "../Constants";
import GameContext from "../GameContext";
import {
  Attention,
  Energy,
  GrowthMindset,
  Money,
  Study,
  Turn,
} from "./Keyword";

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
    plugins,
  } = useContext(GameContext);
  const {
    growthMindsetPoints,
    money,
    attention,
    energy,
    studyPoints,
  } = G;
  const targetStudyPoints = plugins.schedule.api.getStudyThresholdForNextExam() || 1;
  return (
    <Table responsive bordered id="player-info">
      <thead>
        <tr className="info-label-row">
          <th><Turn/></th>
          <th><Study/></th>
          <th><GrowthMindset/></th>
          <th><Money/></th>
          <th><Attention/></th>
          <th><Energy/></th>
        </tr>
      </thead>
      <tbody>
        <tr className="info-data-row">
          <td><Badge variant="dark">{ctx.turn}</Badge></td>
          <td>
            <ProgressBar
              now={studyPoints + 0.1}
              max={targetStudyPoints + 0.1}
              label={studyPoints}
              animated={studyPoints >= targetStudyPoints}
            />
          </td>
          <td>
            <ProgressBar
              now={growthMindsetPoints}
              max={MAX_GROWTH_MINDSET}
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
