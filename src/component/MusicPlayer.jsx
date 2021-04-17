const MusicPlayer = (props) => {
  const {
    songUrl
  } = props;
  return (
    <audio className="audio-element">
      <source src={songUrl}/>
    </audio
  );
};
