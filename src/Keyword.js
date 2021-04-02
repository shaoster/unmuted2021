import React, {
  useEffect,
}from "react";

import {
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

import Actions from "./Action";

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
  const { value, description, tooltipClassName, runEffect } = props;
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
      <span className="card-keyword">{value}</span>
    </OverlayTrigger>
  );
};

export const Discard = (props) => {
  const { number } = props;
  return (
    <Keyword
      value={"Discard " + number}
      description={"Place cards from your hand into your discard pile until you have placed " + CardOrCards(number) + " or your hand is empty."}
    />
  );
};

export const Draw = (props) => {
  const { number } = props;
  return (
    <Keyword
      value={"Draw " + number}
      description={"Place " + CardOrCards(number) + " from your deck into your hand. If your deck is empty, your discard pile will automatically be shuffled into your deck."}
    />
  );
};

export const Forget = (props) => {
  const { number } = props;
  return (
    <Keyword
      value={"Forget " + number}
      description={"Permanently remove cards from your hand until you have removed " + CardOrCards(number) + " or your hand is empty."}
    />
  );
};

export const ForgetSelf = () => {
  return (
    <Keyword
      value={"Forget Self"}
      description={"Permanently remove this card from your hand upon being played."}
    />
  );
};

export const Gain = (props) => {
  const { cardId, renderCard, tooltipClassName, runEffect } = props;
  const card = renderCard({
    cardId: cardId,
    onClick: s=>{}
  });
  return (
    <Keyword
      value={Actions[cardId].displayName}
      description={card}
      tooltipClassName={tooltipClassName}
      runEffect={runEffect}
    />
  );
};

export const BoostGrowthMindset = (props) => {
  const { number } = props;
  return (
    <Keyword
      value={"+" + number + " Growth Mindset"}
      description={"Growth Mindset represents the number of cards you can draw at the beginning of the next turn. You lose one point per turn, and Growth Mindset is capped at 5."}
    />
  );
};
