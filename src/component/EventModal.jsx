import {
  Button,
  Modal,
  Tab,
  Tabs,
} from "react-bootstrap";

import {
  AREA_TYPE,
  STATIC_ROOT,
} from "../Constants";

import ActionCard from "./ActionCard";
import CardGroup from "./CardGroup";

export function EventModal(props) {
  const {
    actions,
    event,
    show,
    onHide,
    buttonText,
    ...remainingProps
  } = props;
  const {
    addsCardsToDiscardPile,
    addsCardsToShop,
    displayName,
    description,
    image,
  } = event;
  const styles = {
    backgroundImage: image == null ? null : `url(${STATIC_ROOT}/${image})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
  };
  const getTab = (actionList, key, label) => {
    if (actionList.length === 0) {
      return [];
    }
    const actionCards = actionList.map((actionId, index) => (
      <ActionCard
        areaType={label}
        key={index}
        cardId={actionId}
        onClick={()=>{}}
        {...actions[actionId]}
      />
    ));
    return <Tab eventKey={key} title={label}>
      <CardGroup>
        {actionCards}
      </CardGroup>
    </Tab>;
  };
  const newActionsTab = getTab(
    addsCardsToDiscardPile, "new-actions", "Actions"
  );
  const newOpportunitiesTab = getTab(
    addsCardsToShop, "new-opportunites", AREA_TYPE.Opportunities
  );
  return (
    <Modal
      size = "xl"
      show = {show}
      onHide = {onHide}
      style = {styles}
      className = "event-modal"
      animation = {false}
      centered
      {...remainingProps}
    >
      <Modal.Header>
        <Modal.Title>
          {displayName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="game-tabs">
        {description.split("\n").map((line, key) => <p key={key}>{line}</p>)}
        <div className="event-modal-action-preview">
          <Tabs>
            {newActionsTab}
            {newOpportunitiesTab}
          </Tabs>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide} className="game">{buttonText ? buttonText : "Continue"}</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EventModal;
