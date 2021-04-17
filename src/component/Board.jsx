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

import {
  STATIC_ROOT,
} from "../Constants";

import GameContext from "../GameContext";
import GameInfo from "./GameInfo";
import ActionArea from "./ActionArea";
import MusicPlayer from "./ActionArea";

function EventModal(props) {
  const {
    G,
    moves,
    events,
  } = useContext(GameContext);
  const show = G.currentEvent in events;
  if (!show) {
    return <></>;
  }
  const onHide = () => moves.dismiss();
  const ev = events[G.currentEvent];
  const {
    displayName,
    description,
    image,
  } = ev;
  const styles = {
    backgroundImage: image == null ? null : `url(${STATIC_ROOT}/${image})`,
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

const Assets = function(actions, events) {
  const assets = {}; 
  for (let action of Object.values(assets)) {
    if (action.image !== null) {
      assets[action.image] = "img";
    }
  }
  for (let ev of Object.values(events)) {
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
  const {
    G,
    ctx,
    moves,
  } = props;

  // Pull these in from plugins instead.
  const {
    actions,
    events
  } = useContext(GameContext);

  // Pattern ripped from
  // https://jack72828383883.medium.com/ff1642708240
  const [isLoading, setIsLoading] = useState(true);
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
  const assetsToLoad = Assets(actions, events);
  const [loadingState, dispatch] = useReducer(reducer, {
    count: 0,
    total: Object.keys(assetsToLoad).length,
    percent: 0,
  });
  const [songUrl, playSong] = useState(null);
  const preload = async (assets: object) => {
    const promises = await Object.keys(assets).map((src) => {
      return new Promise(function (resolve, reject) {
        const assetType = assets[src];
        if (assetType === "img") {
          const img = new Image();
          img.src = `${STATIC_ROOT}/${src}`;
          img.onload = () => {
            // Incrementally update progress bar.
            dispatch({type: "increment"});
            console.log(`Loaded ${img.src}`);
            resolve(img);
          };
          img.onerror = () => {
            reject(`Could not load ${img.src}`);
          };
        }
      });
    });
    await Promise.all(promises);
  };
  useEffect(() => {
    preload(Assets(actions, events));
  }, [actions, events]);
  const {
    backgroundImage
  } = G;
  const styles = {
    backgroundImage: backgroundImage == null ? null : `url(${STATIC_ROOT}/${backgroundImage})`,
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
      moves: moves,
      actions: actions,
      events: events,
      songUrl: songUrl,
      playSong: playSong,
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
