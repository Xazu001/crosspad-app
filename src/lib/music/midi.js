let midiHandlers = {};
let lock = false;
let addedDevices = [];

export function requestMIDI() {
    addedDevices = [];
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess()
            .then(onMIDISuccess, onMIDIFailure);
    }
    else {
        console.warn("WebMIDI is not supported in this browser.");
    }
}

export function changeMIDIleds(notes, oldNotes) {
    if (navigator.requestMIDIAccess) {
        navigator.requestMIDIAccess()
            .then((midiAccess) => nieMamPomyslu(midiAccess, notes, oldNotes))
            .catch(onMIDIFailure);
    }
}

function nieMamPomyslu(midiAccess, note, oldNote) {

    const midiDevices = midiAccess.inputs;
    let outputs = midiAccess.outputs;
    let output = null;

    midiDevices.forEach(function (midiDevice) {

        if (outputs) {
            outputs.forEach(function (output) {

                output.send([0x90, oldNote, 0]);

                output.send([0x90, note, 30]);
            });
        }
    });
}


export function onMIDISuccess(midiAccess) {

    lock = true;
    const midiDevicesSelect = document.getElementById('midiDevices');
    const inputs = midiAccess.inputs.values();


    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
        const deviceId = input.value.id;

        if (!addedDevices.includes(deviceId)) {
            const option = document.createElement('option');
            option.value = deviceId;
            option.text = input.value.name;
            midiDevicesSelect.appendChild(option);

            addedDevices.push(deviceId); // Dodaj identyfikator urządzenia do tablicy dodanych urządzeń

            input.value.onmidimessage = onMIDIMessage;
        }

    }
}

export function onMIDIFailure(error) {
    console.warn("Could not access your MIDI devices.", error);
}

export function onMIDIMessage(event) {
    const command = event.data[0];
    const note = event.data[1];
    const velocity = (event.data.length > 2) ? event.data[2] : 0;

    handleMidiMessage(command, note, velocity);
}

export function setMidiHandler(note, func) {
    midiHandlers[note] = func;
}


export function clearMidiHandlers(notes) {
    delete midiHandlers[notes]
}

export function handleMidiMessage(command, note, velocity) {

    const channel = command % 16 + 1;
    let noteOnCommand = 144 + (channel - 1);
    let noteOffCommand = 128 + (channel - 1);


    const commandElement = document.querySelector(".commandValue");
    const noteElement = document.querySelector(".noteValue");
    const velocityElement = document.querySelector(".velocityValue");


    commandElement.textContent = command;
    noteElement.textContent = note;
    velocityElement.textContent = velocity;

    const handler = midiHandlers[note];

    if (handler && velocity > 0 && noteOnCommand == command) {
        handler[0]()
    }
    else if (handler) {
        handler[1]();
    };


}