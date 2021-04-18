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
    console.log(`Playing song: ${songUrl}`);
    player.current.src = `${STATIC_ROOT}/${songUrl}`;
    player.current.play();
    setCurrentSong(songUrl);
  }, [player, songUrl]);
  return (
    <audio ref={player} autoPlay loop/>
  );
};

export default MusicPlayer;
