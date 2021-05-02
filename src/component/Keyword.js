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
  const { children, description, tooltipClassName, runEffect, ...remaining } = props;
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
      <span className="card-keyword" {...remaining}>{children}</span>
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
      {'Obtain "' + actions[cardId].displayName + '"'}
    </Keyword>
  );
};

export const BoostGrowthMindset = (props) => {
  const { number } = props;
  return (
    <Keyword
      description={"Growth Mindset represents the number of cards you can draw at the beginning of the next turn. You lose one point per turn, and Growth Mindset is capped at 5."}
    >
      {"Gain " + number + " Growth Mindset"}
    </Keyword>
  );
};

export const BoostStudy = (props) => {
  const { number } = props;
  return (
    <Keyword
      description={"Study Points are necessary to progress through the story. Prioritize obtaining actions with Study Points!"}
    >
      <span className="study-points">{"Gain " + number + " Study Points"}</span>
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

const turnOrTurnsLeft = (turnsRemaining) => {
  return turnsRemaining === 1 ? "1 turn remaining" : turnsRemaining + " turns remaining";
}

export const GrowthMindset = (props) => {
  const {
    G,
  } = useContext(GameContext);
  const isInspired = "inspired" in G.statuses;
  const maybeStatusDescription = isInspired ?
    " The Inspired status prevents Growth Mindset from decreasing while active." : "";
  return (
    <Keyword
      description={
        "Growth Mindset represents the number of cards you can draw at the beginning of the next turn. You lose one point per turn, and Growth Mindset is capped at 5."
        + maybeStatusDescription
      }
    >
      Growth Mindset {isInspired && <Badge className="resource status positive">Inspired: {turnOrTurnsLeft(G.statuses.inspired)}</Badge>}
    </Keyword>
  );
};

export const Money = (props) => {
  const {
    G,
  } = useContext(GameContext);
  const isIndebted = "indebted" in G.statuses;
  const maybeStatusDescription = isIndebted ?
    " The Indebted status causes you to start with 1 fewer Money each turn." : "";
  return (
    <Keyword
      description={
        "Money is refreshed each turn and can be gained by performing certain actions. Most opportunities cost Money to obtain."
        + maybeStatusDescription
      }
    >
      Money {isIndebted && <Badge className="resource status negative">Indebted: {turnOrTurnsLeft(G.statuses.indebted)}</Badge>}
    </Keyword>
  );
};


export const Attention = (props) => {
  const {
    G,
  } = useContext(GameContext);
  const isEngrossed = "engrossed" in G.statuses;
  const maybeStatusDescription = isEngrossed ?
    " The Engrossed status causes you to start with 1 fewer Attention each turn." : "";
  return (
    <Keyword
      description={
        "Attention represents the maximum number of opportunities you can obtain per turn."
        + maybeStatusDescription
      }
      >
        Attention {isEngrossed && <Badge className="resource status negative">Engrossed: {turnOrTurnsLeft(G.statuses.engrossed)}</Badge>}
      </Keyword>
  );
};

export const Energy = (props) => {
  const {
    G,
  } = useContext(GameContext);
  const isEnergized = "energized" in G.statuses;
  const maybeStatusDescription = isEnergized ?
    " The Energized status causes you to start with 1 extra Energy each turn." : "";
  return (
    <Keyword
      description={
        "Energy represents the number of actions you can perform per turn. Some opportunities also cost Energy to obtain."
        + maybeStatusDescription
      }
      >
        Energy {isEnergized && <Badge className="resource status positive">Energized: {turnOrTurnsLeft(G.statuses.energized)}</Badge>}
      </Keyword>
  );
};

export const Study = (props) => {
  const {
    plugins,
  } = useContext(GameContext);
  const examStudyThreshold = plugins.schedule.api.getStudyThresholdForNextExam();
  const pointOrPoints = "point" + (examStudyThreshold > 1 ? "s" : "");
  const extraDescription = examStudyThreshold ?
    ` The next exam will require ${examStudyThreshold} ${pointOrPoints} to pass.` : "";
  return (
    <Keyword
      description={`Study Points carry between turns and are necessary to pass events.${extraDescription}`}
    >
      Study Points {examStudyThreshold && <Badge className="resource turn">Next Exam Target: {examStudyThreshold}</Badge>}
    </Keyword>
  );
};

export const Turn = (props) => {
  const {
    plugins,
    ctx,
  } = useContext(GameContext);
  // The plugin uses a cached copy of ctx.turn that doesn't get refreshed until
  // a move has been made in the new turn; thus we need to pass our prop value.
  const turnsRemaining = plugins.schedule.api.getTurnsUntilNextExam(ctx.turn);
  const examStudyThreshold = plugins.schedule.api.getStudyThresholdForNextExam(ctx.turn);
  const pointOrPoints = "point" + (examStudyThreshold > 1 ? "s" : "");
  const extraDescription = examStudyThreshold ?
    ` The next exam will require ${examStudyThreshold} ${pointOrPoints} to pass.` : "";
  return (
    <Keyword
      description={`You have ${MAX_TURN_COUNT} turns to play in total.${extraDescription}`}
    >
      Turn {turnsRemaining !== null && <Badge className="resource turn">{turnsRemaining} until next exam</Badge>}
    </Keyword>
  );
};


function ResourceBadge({type, number}) {
  return (
    <Badge className={"resource " + type}>
      {number}
    </Badge>
  )
}

export const MoneyResource = ({number}) => {
  return <Keyword
    description="Money is refreshed each turn and can be gained by performing certain actions. Most opportunities cost Money to obtain."
  >
    <ResourceBadge type="money" number={number}/>
  </Keyword>;
};

export const AttentionResource = ({number}) => {
  return <Keyword
    description="Attention represents the maximum number of opportunities you can obtain per turn. Each opportunity costs 1 attention to obtain."
  >
    <ResourceBadge type="attention" number={number}/>
  </Keyword>;
};

export const EnergyResource = ({number}) => {
  return <Keyword
    description="Energy represents the number of actions you can perform per turn. Some opportunities also cost Energy to obtain."
  >
    <ResourceBadge type="energy" number={number}/>
  </Keyword>;
};

export const ObtainCost = ({children}) => {
  return <Keyword
    description="The resources to the right resprent the respective costs to obtain from Opportunities."
  >
    {children}
  </Keyword>;
};

export const ActionMakes = () => {
  return <Keyword
    description="The resources to the right represent what is created when this action is performed."
  >
    Makes:
  </Keyword>;
};
