import * as audio from "/src/lib/music/audio";
import * as midi from "/src/lib/music/midi";
import { useState, useEffect } from "react";

const FILE_ORDER = [13, 14, 15, 16, 9, 10, 11, 12, 5, 6, 7, 8, 1, 2, 3, 4];
const pads = document.getElementsByClassName("pad");
const mappedKeys = [
  "1",
  "2",
  "3",
  "4",
  "q",
  "w",
  "e",
  "r",
  "a",
  "s",
  "d",
  "f",
  "z",
  "x",
  "c",
  "v",
];
let initializeInput = true;
let inputHandlers = [];

function NoteSelectGenerate(props) {
  const { notes, setNotes, setOldNotes, showSelects, setHandChanged } =
    props.globalState;

  return (
    <select
      id={`midi-note-${props.index}`}
      value={notes[props.index]}
      onChange={(e) => {
        setOldNotes(notes);
        const newNotes = [...notes];
        newNotes[props.index] = parseInt(e.target.value);
        setHandChanged(true);
        setNotes(newNotes);
      }}
    >
      <option key={0} value={0}>
        Note 0
      </option>
      {[...Array(127)].map((_, j) => (
        <option key={j} value={j + 1}>
          Note {j + 1}
        </option>
      ))}
    </select>
  );
}

function ChokeSelectGenerate(props) {
  const { defaultChokeGroup, setDefaultChokeGroup } = props.globalState;
  const [chokeGroupState, setChokeState] = useState([
    "n",
    "n",
    "n",
    "n",
    "n",
    "n",
    "n",
    "n",
    "n",
    "n",
    "n",
    "n",
    "n",
    "n",
    "n",
    "n",
  ]);
  const [dataFetched, setDataFetched] = useState(false); // Dodajemy stan, aby śledzić, czy dane zostały pobrane

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://r2.crosspad.app/authors/${props.author}/kits/${props.name}/musicInfo.json`
        );
        if (!response.ok) {
          throw new Error("Błąd pobierania danych");
        }
        const jsonData = await response.json();
        setDefaultChokeGroup(jsonData.defaultChokeGroup);

        setDataFetched(true); // Oznaczamy, że dane zostały pobrane
      } catch (error) {
        console.error("Wystąpił błąd:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (dataFetched) {
      const newArray = [];
      newArray[props.index] = defaultChokeGroup[FILE_ORDER[props.index] - 1];
      setChokeState(newArray);
    }
  }, [dataFetched]);

  return (
    <select
      id={`choke-group-${props.index}`}
      value={chokeGroupState[props.index]}
      onChange={(e) => setChokeState(parseInt(e.target.value))} // Konwersja na liczbę
    >
      <option value="none">None</option>
      {[...Array(16)].map((_, j) => (
        <option key={j} value={j + 1}>
          Group {j + 1}
        </option>
      ))}

      {/* Używamy 0 zamiast "none" dla opcji "None" */}
    </select>
  );
}

function SampleButton(props) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);
  const [midiActive, setMidiActive] = useState(false);
  const { notes, setNotes, oldNotes, setOldNotes } = props.globalState;
  const { preset, setPreset } = props.globalState;
  const { shouldBePlayed, setShouldBePlayed } = props.globalState;
  const { isCycle, setIsCycle } = props.globalState;
  const { actives, setActives } = props.globalState;
  const { showSelects, setShowSelects } = props.globalState;
  const { padsFetched, setPadsFetched } = props.globalState;

  function preventDefaultF(event) {
    event.preventDefault();
  }

  useEffect(() => {
    document.querySelector(".navBar").style.setProperty("z-index", "999");
    if (dataFetched) {
      document.querySelector(".loadingScreen").style.transition = "1s";

      setTimeout(() => {
        document.querySelector(".loadingScreen").style.opacity = "0";
        setTimeout(() => {
          document.querySelector(".loadingScreen").style.display = "none";
        }, 500);
      }, 500);
      document
        .querySelectorAll(".pad")
        .forEach((el) => el.style.setProperty("transition", "0.56s"));
      setTimeout(() => {
        document.querySelector(".navBar").style.setProperty("z-index", "99999");
      }, 1000);

      setPadsFetched(true);
    }
  }, [dataFetched]);

  useEffect(() => {
    const pads = document.querySelectorAll(".pad");
    setIsMobile("ontouchstart" in window);
  }, []);

  const onLoad = () => {
    setDataFetched(true);
  };

  const onTouchStart = () => {
    setMidiActive(true);
    if (isCycle) {
      audio.playSampleCycle(
        props.index,
        props.sampleList,
        shouldBePlayed,
        setShouldBePlayed
      );
    } else {
      audio.playSample(props.index, props.sampleList);
    }

    setTimeout(() => {
      setMidiActive(false);
    }, 1000);
  };

  function onMouseDown() {
    const updatedActives = [...actives];
    updatedActives[props.index] = true;
    setActives(updatedActives);
    setMidiActive(true);
    if (isCycle) {
      audio.playSampleCycle(
        props.index,
        props.sampleList,
        shouldBePlayed,
        setShouldBePlayed
      );
    } else if (!isCycle) {
      audio.playSample(props.index, props.sampleList);
    }
  }

  const onMouseUp = () => {
    const updatedActives = [...actives];
    updatedActives[props.index] = false;
    setActives(updatedActives);
    setMidiActive(false);
  };

  useEffect(() => {
    const pads = document.querySelectorAll(".pad");
    pads.forEach((pad) => [
      pad.addEventListener("touchstart", preventDefaultF),
      pad.addEventListener("touchmove", preventDefaultF),
      pad.addEventListener("touchend", preventDefaultF),
    ]);
  }, []);

  useEffect(() => {
    midi.clearMidiHandlers(oldNotes[props.index]);
  }, [preset]);

  useEffect(() => {
    midi.clearMidiHandlers(oldNotes[props.index]);
    midi.setMidiHandler(notes[props.index], [onMouseDown, onMouseUp]);
    // midi.changeMIDIleds(notes[props.index], oldNotes[props.index]);
  }, [notes]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
      const updatedActives = [...actives];
      updatedActives[props.index] = false;
      setActives(updatedActives);
      setMidiActive(false);
    }
  };

  const keyText = (idx) => {
    document.querySelectorAll(".keyboard")[idx].innerText = mappedKeys[idx];
  };

  useEffect(() => {
    keyText(props.index);
  }, []);

  useEffect(() => {
    onLoad();
  }, []);
  return (
    <div className={`padsContainerItem br`}>
      <div
        className={`pad ${midiActive ? "active" : ""} ${
          actives[props.index] || midiActive ? "active" : ""
        } ${isHovered ? "hovered" : ""}`}
        onMouseDown={isMobile || showSelects ? null : onMouseDown}
        onMouseUp={isMobile ? null : onMouseUp}
        onMouseEnter={showSelects ? null : handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={isMobile ? onTouchStart : null}
        onTouchEnd={isMobile ? onMouseUp : null}
      ></div>
      <div className={`selectsOnPad ${showSelects ? "" : "o0"} `}>
        <ChokeSelectGenerate {...props} />
        <NoteSelectGenerate
          {...props}
          index={props.index}
          notes={notes}
          setNotes={setNotes}
          chokeGroupState={ChokeSelectGenerate.chokeGroupState}
        />
        <div className="keyboard"></div>
      </div>
    </div>
  );
}

export default function SampleBoard(props) {
  const [samplesToUse, setSamplesToUse] = useState(null);
  const [samples, setSamples] = useState([]);
  const { isCycle, setIsCycle } = props.globalState;
  const { actives, setActives } = props.globalState;
  const { shouldBePlayed, setShouldBePlayed } = props.globalState;
  const { progressState, setProgress } = props.globalState;
  const [dataFetched, setDataFetched] = useState(false);

  let progress = 0;

  const onKeyDown = (event) => {
    const key = event.key;
    const index = mappedKeys.indexOf(key);

    if (!actives[index]) {
      if (isCycle) {
        audio.playSampleCycle(
          index,
          samples,
          shouldBePlayed,
          setShouldBePlayed
        );
      } else {
        audio.playSample(index, samples);
      }

      const updatedActives = [...actives];
      updatedActives[index] = true;
      setActives(updatedActives);
    }
  };

  const onKeyUp = (event) => {
    const updatedActives = [...actives];
    const key = event.key;
    const index = mappedKeys.indexOf(key);

    updatedActives[index] = false;
    setActives(updatedActives);
  };

  inputHandlers = [onKeyDown, onKeyUp];

  function preloadSamples(samplesId, fileOrder, isCycle, sampleBoard) {
    progress = 0;
    setProgress(0);
    if (isCycle) {
      const tasks = [];

      for (let i = 0; i <= 15; i++) {
        let index = FILE_ORDER[i] - 1;
        for (const wavFile of sampleBoard[i]) {
          const url = `https://r2.crosspad.app/authors/${props.author}/kits/${props.name}/SAMPLES/${wavFile}`;

          const promise = fetch(url)
            .then((response) => {
              progress += 1 / parseInt(sampleBoard[i].length);
              setProgress(Math.round(progress));
              return response.arrayBuffer();
            })
            .then((data) => audio.audioContext.decodeAudioData(data));

          tasks[index] = tasks[index] || [];
          tasks[index].push(promise);
        }
        tasks[index] = Promise.all(tasks[index]);
      }

      return Promise.all(tasks);
    } else if (!isCycle) {
      const tasks = new Array(fileOrder.length);

      for (let i = 1; i <= 16; i++) {
        const url = `https://r2.crosspad.app/authors/${props.author}/kits/${props.name}/SAMPLES/${i}.wav`;

        const promise = fetch(url)
          .then((response) => {
            progress += 1;
            setProgress(Math.round(progress));
            return response.arrayBuffer();
          })
          .then((data) => audio.audioContext.decodeAudioData(data));

        tasks[fileOrder[i - 1] - 1] = promise;
      }
      return Promise.all(tasks);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://r2.crosspad.app/authors/${props.author}/kits/${props.name}/musicInfo.json`
        );
        if (!response.ok) {
          throw new Error("Błąd pobierania danych");
        }
        const jsonData = await response.json();
        if (jsonData.isCycle) {
          setIsCycle(true);
          setSamplesToUse(jsonData.samplesToUse);
          setDataFetched(true);
        } else {
          setIsCycle(false);
          setDataFetched(true);
        }
      } catch (error) {
        console.error("Wystąpił błąd:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    async function updateSamples() {
      if (dataFetched) {
        if (isCycle) {
          const preloaded = await preloadSamples(
            props.name,
            FILE_ORDER,
            isCycle,
            samplesToUse
          );
          setSamples(preloaded);
        } else {
          const preloaded = await preloadSamples(props.name, FILE_ORDER);
          setSamples(preloaded);
        }
      }
    }
    updateSamples();
  }, [samplesToUse, dataFetched]);

  useEffect(() => {
    midi.requestMIDI();
    midi.handleMidiMessage();
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", (e) => inputHandlers[0](e));
    document.addEventListener("keyup", (e) => inputHandlers[1](e));
  }, []);

  return (
    <div className="padsSection p1">
      <div className="padsContainer" id="padsContainer">
        {samples.map((sample, idx) => (
          <SampleButton
            index={idx}
            sample={sample}
            pads={pads}
            sampleList={samples}
            key={idx}
            {...props}
          />
        ))}
      </div>
    </div>
  );
}
