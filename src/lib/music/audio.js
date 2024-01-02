import { useState } from "react";
import SampleBoard from "/src/components/kit/SampleBoard";


let audioBufferSource;

export let activeSources = new Array(16).fill(null).map(() => []);

export const audioContext = new (window.AudioContext || window.webkitAudioContext)();

export function resumeAudio() {
    audioBufferSource = audioContext.createBufferSource();

    audioBufferSource.connect(audioContext.destination);
    audioBufferSource.start();
}

//GAIN
export const gainNode = audioContext.createGain(); // For volume control if needed

//FILTER
export const biquadFilter = audioContext.createBiquadFilter(); // Filter node
biquadFilter.type = 'lowpass'; // Types: lowpass, highpass, bandpass, etc.
biquadFilter.frequency.setValueAtTime(20000, audioContext.currentTime); // Setting the frequency to 1kHz initially
biquadFilter.Q.setValueAtTime(10, audioContext.currentTime); // Setting a higher Q for resonance

//COMPRESSOR
const compressor = audioContext.createDynamicsCompressor();
compressor.threshold.setValueAtTime(-50, audioContext.currentTime);  // Threshold in dB
compressor.knee.setValueAtTime(40, audioContext.currentTime);        // Knee in dB
compressor.ratio.setValueAtTime(12, audioContext.currentTime);       // Compression ratio
compressor.attack.setValueAtTime(0, audioContext.currentTime);       // Attack time in seconds
compressor.release.setValueAtTime(0.25, audioContext.currentTime);   // Release time in seconds

//DELAY
const delay = audioContext.createDelay(5.0); // max delay time of 5 seconds
delay.delayTime.setValueAtTime(0.0, audioContext.currentTime); // initial delay time set to 0.5 seconds

// const initButton = document.getElementById("initSound");

// initButton.addEventListener('click', initSound);



export function playSample(index, sampleBoard) {
    stopAllSourcesForSample(index);

    const chokeGroup = document.getElementById(`choke-group-${index}`).value;
    if (chokeGroup !== "none") {
        for (let i = 0; i < 16; i++) {
            if (i !== index && document.getElementById(`choke-group-${i}`).value === chokeGroup) {
                stopAllSourcesForSample(i);
            }
        }
    }


    const source = audioContext.createBufferSource();


    activeSources.push(source);

    source.buffer = sampleBoard[index];

    source.start();

    biquadFilter.connect(audioContext.destination);
    // buffers

    // Connect source to gainNode
    source.connect(gainNode);

    // Connect gainNode to delay
    gainNode.connect(biquadFilter);


    activeSources[index].push(source);
    console.log(activeSources)

    source.onended = function () {
        const index = activeSources.indexOf(source);
        if (index !== -1) {
            activeSources.splice(index, 1);
        }
    };

    const pitchValue = document.getElementById("pitchSlider").getAttribute("value");
    setPlaybackRateForAllSources(pitchValue);
}

export function playSampleCycle(index, sampleBoard, shouldBePlayed, setShouldBePlayed) {
    stopAllSourcesForSample(index);

    const chokeGroup = document.getElementById(`choke-group-${index}`).value;
    if (chokeGroup !== "none") {
        for (let i = 0; i < 16; i++) {
            if (i !== index && document.getElementById(`choke-group-${i}`).value === chokeGroup) {
                stopAllSourcesForSample(i);
            }
        }
    }

    const source = audioContext.createBufferSource();

    activeSources.push(source);

    source.buffer = sampleBoard[index][shouldBePlayed[index]];

    const currentCount = shouldBePlayed[index];
    const maxLength = sampleBoard[index].length;
    if (currentCount < maxLength - 1) {
        shouldBePlayed[index] = currentCount + 1;
    } else {
        shouldBePlayed[index] = 0;
    }


    setShouldBePlayed([...shouldBePlayed]);

    source.start();

    biquadFilter.connect(audioContext.destination);
    // buffers

    // Connect source to gainNode
    source.connect(gainNode);

    // Connect gainNode to delay
    gainNode.connect(biquadFilter);


    activeSources[index].push(source);

    source.onended = function () {
        const index = activeSources.indexOf(source);
        if (index !== -1) {
            activeSources.splice(index, 1);
        }
    };

    const pitchValue = document.getElementById("pitchSlider").getAttribute("value");
    setPlaybackRateForAllSources(pitchValue);
}




export function volumeFader() {
    gainNode.gain.value = volumeFader.value;
};



export function initSound() {
    audioContext.resume().then(() => {
        initButton.style.display = 'none';
        adjustPitch(value)
    });
}

export function setPlaybackRateForAllSources(value) {
    for (let sourcesArray of activeSources) {
        if (Array.isArray(sourcesArray)) {  // Dodane sprawdzenie, czy sourcesArray jest tablicą
            for (let source of sourcesArray) {
                if (source.playbackRate) {
                    source.playbackRate.setValueAtTime(value, audioContext.currentTime);
                }
            }
        }
    }
}

export function adjustPitch(value) {
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            doAdjustPitch(value);
        });
    } else {
        doAdjustPitch(value);
    }
}

export function doAdjustPitch(value) {
    for (let source of activeSources) {
        if (source.playbackRate) { // Check if playbackRate property exists
            source.playbackRate.setValueAtTime(value, audioContext.currentTime);
        } else {
            console.warn('Source has no playbackRate property:', source);
        }
    }
}

//

export function stopAllSourcesForSample(index) {
    activeSources[index].forEach(source => source && source.stop());
    activeSources[index] = [];
}