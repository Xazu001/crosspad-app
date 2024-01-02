import { useState } from "react";
import { useEffect } from "react";
import {
  biquadFilter,
  gainNode,
  setPlaybackRateForAllSources,
} from "/src/lib/music/audio";
import Slider from "@mui/material/Slider";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

export default function FadersSection(props) {
  const [volumeValue, setVolumeValue] = useState(1);
  const [frequencyValue, setFrequencyValue] = useState(20000);
  const [vFrequencyValue, setVFrequencyValue] = useState(20000);
  const [pitchValue, setPitchValue] = useState(1);

  useEffect(() => {
    const crosspadVolume = localStorage.getItem("crosspadVolume");
    if (crosspadVolume) {
      setVolumeValue(JSON.parse(crosspadVolume));
    }
  }, []);

  useEffect(() => {
    const newValue = Math.pow(
      10,
      (vFrequencyValue / 20000) * Math.log10(20000 / 1)
    );
    setFrequencyValue(newValue);
  }, [vFrequencyValue]);

  useEffect(() => {
    biquadFilter.frequency.value = frequencyValue;
    gainNode.gain.value = volumeValue;
    setPlaybackRateForAllSources(pitchValue);
  }, [volumeValue, frequencyValue, pitchValue]);

  const transformPitchValue = (pitchValue) => {
    const pitchIncrement = 0.05;

    const result = (pitchValue - 1) / pitchIncrement;
    if (result % pitchValue != 0) {
      return Math.round(result);
    } else {
      return result;
    }
  };

  function handleChange(e) {
    setVolumeValue(e.target.value);
    const toLocalStorage = e.target.value;
    localStorage.setItem("crosspadVolume", JSON.stringify(toLocalStorage));
  }

  const cache = createCache({
    key: "css",
    prepend: true,
  });

  const style = {
    border: "1px solid #333333",
    height: "5rem",
    color: "#333333",
    borderRadius: "4px",
    padding: "0 !important",
    overflow: "hidden",
    alignItems: "center",
    display: "flex",
    "& .MuiSlider-rail": {
      color: "transparent",
    },
    "& .MuiSlider-track": {
      height: "100%",
    },
    "& .MuiSlider-thumb": {
      width: "0",
      "&:hover, &.Mui-focusVisible": {
        boxShadow: `0`,
      },
      "&.Mui-active": {
        boxShadow: `0`,
      },
    },
  };

  return (
    <div className="fadersSection">
      <div className="fadersShadow"></div>
      <div className="fadersHide">
        <div className="faderItem">
          <label htmlFor="volumeFader" className="control-label">
            Volume
          </label>
          <div className="faderValue">
            <p>{Math.round((100 / 1) * volumeValue)}%</p>
          </div>
          <CacheProvider value={cache}>
            <Slider
              id="volumeFader"
              sx={style}
              min={0}
              max={1}
              step={0.02}
              value={volumeValue}
              onChange={handleChange}
            ></Slider>
          </CacheProvider>
        </div>
        <div className="faderItem">
          <label htmlFor="frequencyFader" className="control-label">
            LPF
          </label>
          <div className="faderValue">
            <p>{(vFrequencyValue - 10000) / 100}%</p>
          </div>
          <CacheProvider value={cache}>
            <Slider
              id="frequencyFader"
              sx={style}
              min={10000}
              max={20000}
              step={100}
              value={vFrequencyValue}
              onChange={(e) => setVFrequencyValue(e.target.value)}
            ></Slider>
          </CacheProvider>
        </div>
        <div className="faderItem">
          <label htmlFor="pitchSlider" className="control-label">
            Master Pitch
          </label>
          <div className="faderValue">
            <p>{transformPitchValue(pitchValue) + " "}</p>
          </div>
          <CacheProvider value={cache}>
            <Slider
              id="pitchFader"
              sx={style}
              min={0.4}
              max={1.6}
              step={0.05}
              value={pitchValue}
              onChange={(e) => setPitchValue(e.target.value)}
            ></Slider>
          </CacheProvider>

          <span id="pitchSlider" value={pitchValue}></span>
        </div>
      </div>
    </div>
  );
}

{
  /* <input
            type="range"
            id="volumeFader"
            className="control-slider"
            min="0"
            max="1"
            step="0.02"
            value={volumeValue}
            onChange={(e) => {
              setVolumeValue(e.target.value);
              const toLocalStorage = e.target.value;
              localStorage.setItem(
                "crosspadVolume",
                JSON.stringify(toLocalStorage)
              );
            }}
          ></input> */
}
