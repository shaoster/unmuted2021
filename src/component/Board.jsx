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
import MusicPlayer from "./MusicPlayer";

function EventModal(props) {
  const {
    G,
    moves,
    events,
    playSong,
  } = useContext(GameContext);
  const show = G.currentEvent in events;
  const onHide = () => moves.dismiss();
  const ev = events[G.currentEvent];
  useEffect(() => {
    if (ev && ev.song && show) {
      playSong(ev.song);
    }
  }, [ev, playSong, show]);
  if (!show) {
    return <></>;
  }
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
    if (ev.song !== null) {
      assets[ev.song] = "audio";
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

const LoadAsset = (asset, src, updateProgress, resolve) => {
  // Incrementally update progress bar.
  updateProgress();
  console.log(`Loaded ${src}`);
  resolve(asset);
};

// Pattern ripped from
// https://jack72828383883.medium.com/ff1642708240
const Preload = async (assets: object, updateProgress) => {
  const promises = await Object.keys(assets).map((src) => {
    if (src === "undefined") {
      throw new Error("Could not resolve URL for asset.")
    }
    return new Promise(function (resolve, reject) {
      const assetType = assets[src];
      let asset;
      switch (assetType) {
        case "img":
          asset = new Image();
          asset.onload = () => {
            LoadAsset(asset, src, updateProgress, resolve);
          };
          break;
        case "audio":
          asset = new Audio();
          // Audio files have different handlers.
          asset.oncanplaythrough = () => {
            LoadAsset(asset, src, updateProgress, resolve);
          };
          break;
        default:
          throw new Error(`Unrecognized asset type: ${assetType}`);
      }
      asset.src = `${STATIC_ROOT}/${src}`;
      asset.onerror = () => {
        reject(`Could not load ${assetType}: ${asset.src}`);
      };
    });
  });
  await Promise.all(promises);
};

const Board = function(props) {
  const {
    G,
    ctx,
    moves,
    plugins,
  } = props;
  const actions = plugins.actions.api.getActions();
  const events = plugins.schedule.api.getEvents();
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
  // TODO: Clean up this assets computation.
  const assetsToLoad = Assets(actions, events);
  const [loadingState, dispatch] = useReducer(reducer, {
    count: 0,
    total: Object.keys(assetsToLoad).length,
    percent: 0,
  });
  const [songUrl, playSong] = useState("af.mp3");
  useEffect(() => {
    let hasPreloaded = false;
    Preload(
      // Preload all the images and audio.
      Assets(
        plugins.actions.api.getActions(),
        plugins.schedule.api.getEvents()
      ),
      // And update the progress bar when each item is loaded.
      () => {
        if (!hasPreloaded) {
          dispatch({type: "increment"})
        }
      }
    );
    return () => {
      hasPreloaded = true;
    };
  }, [dispatch, plugins]);
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
      <MusicPlayer songUrl={songUrl}/>
    </GameContext.Provider>
  );
}

export default Board;
