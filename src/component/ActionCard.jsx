import {
  Container,
  Col,
  Card,
  ListGroup,
  Row,
} from "react-bootstrap";

import {
  AREA_TYPE,
  STATIC_ROOT,
} from "../Constants";

import {
  BoostGrowthMindset,
  BoostStudy,
  Discard,
  Draw,
  Forget,
  ForgetSelf,
  Gain,
  YOLO,
  MoneyResource,
  AttentionResource,
  EnergyResource,
  ActionMakes,
  ObtainCost,
} from "./Keyword";

const classNames = require("classnames");

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
              <ActionMakes/>
            </Col>
            <Col xs={3}/>
            <Col xs={1}>
              <MoneyResource number={producesMoney}/>
            </Col>
            <Col xs={1}>
              <AttentionResource number={producesAttention}/>
            </Col>
            <Col xs={1}>
              <EnergyResource number={producesEnergy}/>
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
          {/* Consider breaking into lines. */}
          {description}
        </Card.Text>
      </Card.Body>
      <Card.Footer className={areaType}>
        <Container fluid>
          <Row>
            <Col xs={6} className={`cost-label`}>
              <ObtainCost>
                { areaType === AREA_TYPE.Opportunities ? "To Obtain:" : "Obtained For:" }
              </ObtainCost>
            </Col>
            <Col xs={1}/>
            <Col xs={1}>
              <MoneyResource number={moneyCost}/>
            </Col>
            <Col xs={1}>
              <AttentionResource number={1}/>
            </Col>
            <Col xs={1}>
              <EnergyResource number={energyCost}/>
            </Col>
          </Row>
        </Container>
      </Card.Footer>
    </Card>
  );
}

export default ActionCard;
