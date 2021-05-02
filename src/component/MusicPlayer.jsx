import React, {
  createRef,
  useEffect,
  useState,
} from "react";
import {
  STATIC_ROOT,
} from "../Constants";

const MusicPlayer = (props) => {
  const {
    songUrl
  } = props;
  const [currentSong, setCurrentSong] = useState(null);
  const player = createRef();
  useEffect(() => {
    if (songUrl === currentSong) {
      return;
    }
    player.current.pause();
    player.current.src = `${STATIC_ROOT}/${songUrl}`;
    player.current.play();
    console.log(`Switching song from: ${currentSong} to ${player.current.src}`);
    setCurrentSong(songUrl);
  }, [currentSong, player, songUrl]);
  return (
    <audio ref={player}/>
  );
};

export default MusicPlayer;
