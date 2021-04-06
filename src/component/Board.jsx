import React, {
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import {
  Button,
  Container,
  Col,
  Modal,
  Row,
  ProgressBar,
} from "react-bootstrap";

import GameContext from "../GameContext";
import GameInfo from "./GameInfo";
import ActionArea from "./ActionArea";

import Actions from "../Action";
import Events from "../Event";

function EventModal(props) {
  const {
    G,
    moves,
  } = useContext(GameContext);
  console.log(moves);
  const show = G.currentEvent in Events;
  if (!show) {
    return <></>;
  }
  const onHide = () => moves.dismiss();
  const ev = Events[G.currentEvent];
  const {
    displayName,
    description,
    image,
  } = ev;
  const styles = {
    backgroundImage: image == null ? null : `url(${image})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% 100%",
  };
  return (
    <Modal
      size = "lg"
      show = {show}
      onHide = {onHide}
      style = {styles} 
      className = "event-modal"
      centered
    >
      <Modal.Header>
        <Modal.Title>
          {displayName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {description}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Continue</Button>
      </Modal.Footer>
    </Modal>
  ); 
}

const Assets = function() {
  const assets = {}; 
  for (let action of Object.values(Actions)) {
    if (action.image !== null) {
      assets[action.image] = "img";
    }
  }
  for (let ev of Object.values(Events)) {
    if (ev.image !== null) {
      assets[ev.image] = "img";
    }
  }
  return assets;
}

const Loading = function(props) {
  const {
    count,
    total,
    percent,
    startGame
  } = props;
  return (
    <div id="loading">
      <ProgressBar now={percent}/>
      <hr/>
      <p>
        {
          count < total ? (
            `Loaded ${count}/${total} assets...`
          ) : (
            <Button onClick={startGame}>New Game</Button>
          )
        }
      </p>
    </div>
  )
};

const Board = function(props) {
  // Pattern ripped from
  // https://jack72828383883.medium.com/ff1642708240
  const [isLoading, setIsLoading] = useState(true);
  const assetsToLoad = Assets();

  const reducer = (state, action) => {
    switch (action.type) {
      case "increment":
        return {
          count: state.count + 1,
          total: state.total,
          percent: (100.0 * (state.count + 1) / state.total)
        };
      default:
        throw new Error(`Unsupported action type ${action.type}`);
    }
  };
  const [loadingState, dispatch] = useReducer(reducer, {
    count: 0,
    total: Object.keys(assetsToLoad).length,
    percent: 0,
  });
  const preload = async (assets: object) => {
    const promises = await Object.keys(assets).map((src) => {
      return new Promise(function (resolve, reject) {
        const assetType = assets[src];
        if (assetType === "img") {
          const img =  new Image();
          img.src = src;
          img.onload = () => {
            // Incrementally update progress bar.
            dispatch({type: "increment"});
            resolve()
          };
          img.onerror = reject();
        }
      });
    });
    await Promise.all(promises);
  };
  useEffect(() => {
    preload(assetsToLoad);
  }, [assetsToLoad]);
  const {
    G,
    ctx,
    moves,
  } = props;
  const {
    backgroundImage
  } = G;
  const styles = {
    backgroundImage: backgroundImage == null ? null : `url(${backgroundImage})`,
    backgroundSize: "cover",
  };
  if (isLoading) {
    // TODO: In theory we should introduce an intermediate "loaded-but-not-started" state.
    return <Loading startGame={() => setIsLoading(false)} {...loadingState} />;
  }
  // Game has started.
  return (
    <GameContext.Provider value={{
      G: G,
      ctx: ctx,
      moves: moves
    }}>
      <div style={styles} id="bg-container"/>
      <div id="game-wrapper">
        <Container fluid id="game-container">
          <Row>
            <Col>
              <GameInfo/> 
            </Col>
          </Row>
          <Row>
            <Col>
              <ActionArea/>
            </Col>
          </Row>
        </Container>
        <EventModal/>
      </div>
    </GameContext.Provider>
  );
}

export default Board;
