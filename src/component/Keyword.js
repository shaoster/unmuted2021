import React, {
  useEffect,
  useContext,
} from "react";

import {
  Badge,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

import {
  MAX_TURN_COUNT,
} from "../Constants";

import GameContext from "../GameContext";

function CardOrCards(number) {
  return "" + number + " " + (number > 1 ? "cards" : "card");
}

export const Description = (props) => {
  const { description, runEffect, className, passthrough } = props;
  useEffect(
    () => {
      if (runEffect) {
        runEffect();
      }
    }
  );
  return (
    <Tooltip id="keyword-description" className={className} {...passthrough}>
      {description}
    </Tooltip>
  );
};

export const Keyword = (props) => {
  const { children, description, tooltipClassName, runEffect } = props;
  const renderDescription = (descriptionProps) => (
    <Description
      description={description}
      className={tooltipClassName}
      runEffect={runEffect}
      passthrough={descriptionProps}
    />
  );
  return (
    <OverlayTrigger
      placement="right"
      overlay={renderDescription}
    >
      <span className="card-keyword">{children}</span>
    </OverlayTrigger>
  );
};

export const Discard = (props) => {
  const { number } = props;
  return (
    <Keyword
      description={"Place cards from your hand into your discard pile until you have placed " + CardOrCards(number) + " or your hand is empty."}
    >
      {"Discard " + number}
    </Keyword>
  );
};

export const Draw = (props) => {
  const { number } = props;
  return (
    <Keyword
      description={"Place " + CardOrCards(number) + " from your deck into your hand. If your deck is empty, your discard pile will automatically be shuffled into your deck."}
    >
      {"Draw " + number}
    </Keyword>
  );
};

export const Forget = (props) => {
  const { number } = props;
  return (
    <Keyword
      description={"Permanently remove cards from your hand until you have removed " + CardOrCards(number) + " or your hand is empty."}
    >
      {"Forget " + number}
    </Keyword>
  );
};

export const ForgetSelf = () => {
  return (
    <Keyword
      description={"Permanently remove this card from your hand upon being played."}
    >
      Forget Self
    </Keyword>
  );
};

export const Gain = (props) => {
  const { cardId, renderCard, tooltipClassName, runEffect } = props;
  const {
    actions
  } = useContext(GameContext);
  const card = renderCard({
    cardId: cardId,
    onClick: s=>{},
    ...actions[cardId],
  });
  return (
    <Keyword
      description={card}
      tooltipClassName={tooltipClassName}
      runEffect={runEffect}
    >
      {"Gain " + actions[cardId].displayName}
    </Keyword>
  );
};

export const BoostGrowthMindset = (props) => {
  const { number } = props;
  return (
    <Keyword
      description={"Growth Mindset represents the number of cards you can draw at the beginning of the next turn. You lose one point per turn, and Growth Mindset is capped at 5."}
    >
      {"+" + number + " Growth Mindset"}
    </Keyword>
  );
};

export const BoostStudy = (props) => {
  const { number } = props;
  return (
    <Keyword
      description={"Study Points are necessary to progress through the story. Prioritize obtaining actions with Study Points!"}
    >
      <span className="study-points">{"+" + number + " Study Points"}</span>
    </Keyword>
  );
};

export const YOLO = (props) => {
  return (
    <Keyword
      description={"If this card remains in your hand at the end of the turn, it will be permanently removed from your deck."}
    >
      #YOLO
    </Keyword>
  );
};

// GameInfo Keywords

export const GrowthMindset = (props) => {
  const {
    G,
  } = useContext(GameContext);
  const isInspired = (G.statuses.inspired || 0) > 0;
  const maybeStatusDescription = isInspired ?
    " The Inspired status prevents Growth Mindset from decreasing while active." : "";
  return (
    <Keyword
      description={
        "Growth Mindset represents the number of cards you can draw at the beginning of the next turn. You lose one point per turn, and Growth Mindset is capped at 5."
        + maybeStatusDescription
      }
    >
      Growth Mindset {isInspired && <Badge pill variant="info" className="status">Inspired</Badge>}
    </Keyword>
  );
};

export const Money = (props) => {
  const {
    G,
  } = useContext(GameContext);
  const isIndebted = (G.statuses.indebted || 0) > 0;
  const maybeStatusDescription = isIndebted ?
    " The Indebted status causes you to start with 1 fewer Money each turn." : "";
  return (
    <Keyword
      description={
        "Money is refreshed each turn and can be gained by performing certain actions. Most opportunities cost Money to obtain."
        + maybeStatusDescription
      }
    >
      Money {isIndebted && <Badge pill variant="danger" className="status">Indebted</Badge>}
    </Keyword>
  );
};


export const Attention = (props) => {
  const {
    G,
  } = useContext(GameContext);
  const isEngrossed = (G.statuses.engrossed || 0) > 0;
  const maybeStatusDescription = isEngrossed ?
    " The Engrossed status causes you to start with 1 fewer Attention each turn." : "";
  return (
    <Keyword
      description={
        "Attention represents the maximum number of opportunities you can obtain per turn."
        + maybeStatusDescription
      }
      >
        Attention {isEngrossed && <Badge pill variant="danger" className="status">Engrossed</Badge>}
      </Keyword>
  );
};

export const Energy = (props) => {
  const {
    G,
  } = useContext(GameContext);
  const isEnergized = (G.statuses.energized || 0) > 0;
  const maybeStatusDescription = isEnergized ?
    " The Energized status causes you to start with 1 extra Energy each turn." : "";
  return (
    <Keyword
      description={
        "Energy represents the number of actions you can perform per turn. Some opportunities also cost Energy to obtain."
        + maybeStatusDescription
      }
      >
        Energy {isEnergized && <Badge pill variant="info" className="status">Energized</Badge>}
      </Keyword>
  );
};

export const Turn = (props) => {
  const {
    plugins,
  } = useContext(GameContext);
  const turnsRemaining = plugins.schedule.api.getTurnsUntilNextExam();
  const examStudyThreshold = plugins.schedule.api.getStudyThresholdForNextExam();
  const pointOrPoints = "point" + (examStudyThreshold > 1 ? "s" : "");
  const extraDescription = examStudyThreshold ?
    ` The next exam will require ${examStudyThreshold} ${pointOrPoints} to pass.` : "";
  return (
    <Keyword
      description={`You have ${MAX_TURN_COUNT} turns to play in total.${extraDescription}`}
    >
      Turn {turnsRemaining && <Badge pill variant="warning" className="status">{turnsRemaining} until next exam</Badge>}
    </Keyword>
  );
};
