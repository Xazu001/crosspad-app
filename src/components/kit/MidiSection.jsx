import { useState, useEffect } from "react";

export default function MidiSection(props) {
  const { preset, setPreset } = props.globalState;
  const { presets, setPresets } = props.globalState;
  const { oldNotes, setOldNotes } = props.globalState;
  const { handChanged, setHandChanged } = props.globalState;
  const { notes, setNotes } = props.globalState;

  useEffect(() => {
    const newestMessageElement = document.querySelector(
      ".newestMessage .noteValue"
    );

    // Funkcja obsługi zmian w treści elemencie o klasie newestMessage
    const handleMutation = (mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "characterData" &&
          mutation.target === newestMessageElement
        ) {
          // Tutaj możesz reagować na zmiany w tekście elementu .newestMessage
          const newText = newestMessageElement.textContent;
        }
      }
    };

    // Utwórz obiekt MutationObserver
    const observer = new MutationObserver(handleMutation);

    // Skonfiguruj obserwację na zmiany w treści elementu .newestMessage
    const config = { characterData: true, subtree: true };

    // Rozpocznij obserwację zmian w elemencie .newestMessage
    if (newestMessageElement) {
      observer.observe(newestMessageElement, config);
    }

    // Pamiętaj o zatrzymaniu obserwatora po zakończeniu komponentu
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div id="MidiSection" style={{}}>
      <div className="midiHide">
        <div className="midiSectionItem">
          <p id="midiDeviceLabel">Select MIDI device:</p>
          <select id="midiDevices"></select>
        </div>
        <div className="midiSectionItem">
          <p id="presetLabel" className="centered-text">
            Select Controller Preset:
          </p>
          <select
            id="presetSelector"
            onChange={(e) => {
              setHandChanged(true);
              setOldNotes(notes);
              setPreset(e.target.value);
            }}
            value={preset}
          >
            {Object.keys(presets).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        <p id="midiMonitorLabel">MIDI Monitor</p>
        <pre id="midiMonitor">
          <div className="newestMessage">
            <p className="commandValue"></p>
            <p className="noteValue"></p>
            <p className="velocityValue"></p>
          </div>
          <div className="middleMessage">
            <p className="commandValue"></p>
            <p className="noteValue"></p>
            <p className="velocityValue"></p>
          </div>
          <div className="lastMessage"></div>
        </pre>
      </div>
    </div>
  );
}
