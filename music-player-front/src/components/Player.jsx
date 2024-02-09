import { useEffect, useState } from "react";
import useSound from "use-sound"; // for handling the sound
import music from "../assets/motivational-electronic-distant-132919.mp3"; // importing the music
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"; // icons for play and pause
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi"; // icons for next and previous track
import { IconContext } from "react-icons"; // for customazing the icons
import "./css/player.css"; // styling the player

export default function Player() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState({
    min: "",
    sec: "",
  });
  const [currTime, setCurrTime] = useState({
    min: "",
    sec: "",
  });

  const [seconds, setSeconds] = useState();

  const [play, { pause, duration, sound }] = useSound(music);

  useEffect(() => {
    if (duration) {
      const sec = duration / 1000;
      const min = Math.floor(sec / 60);
      const secRemain = Math.floor(sec % 60);
      setTime({
        min: min,
        sec: secRemain,
      });
    }
  }, [isPlaying]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        setSeconds(sound.seek([]));
        const min = Math.floor(sound.seek([]) / 60);
        const sec = Math.floor(sound.seek([]) % 60);
        setCurrTime({
          min,
          sec,
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sound]);

  const playingButton = () => {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
    } else {
      play();
      setIsPlaying(true);
    }
  };

  return (
    <div className='MusikPlayer'>
      {/* <h2>Playing Now</h2> */}
      <img className='musicCover' src='https://picsum.photos/200/200' />
      <div className='songNames'>
        <h3 className='title'>Rubaiyy</h3>
        <p className='subTitle'>Qala</p>
      </div>
      <div>
        <input
          type='range'
          min='0'
          max={duration / 1000}
          default='0'
          value={seconds}
          className='timeline'
          id='music-bar'
          onChange={(e) => {
            sound.seek([e.target.value]);
          }}
        />
        <div className='time'>
          <p>
            {currTime.min}:{currTime.sec}
          </p>
          <p>
            {time.min}:{time.sec}
          </p>
        </div>
      </div>
      <div className='playButtons'>
        <button className='playButton'>
          <IconContext.Provider value={{ size: "3em", color: "#FF3345" }}>
            <BiSkipPrevious />
          </IconContext.Provider>
        </button>
        {!isPlaying ? (
          <button className='playButton' onClick={playingButton}>
            <IconContext.Provider value={{ size: "3em", color: "#FF3345" }}>
              <AiFillPlayCircle />
            </IconContext.Provider>
          </button>
        ) : (
          <button className='playButton' onClick={playingButton}>
            <IconContext.Provider value={{ size: "3em", color: "#FF3345" }}>
              <AiFillPauseCircle />
            </IconContext.Provider>
          </button>
        )}
        <button className='playButton'>
          <IconContext.Provider value={{ size: "3em", color: "#FF3345" }}>
            <BiSkipNext />
          </IconContext.Provider>
        </button>
      </div>
    </div>
  );
}
