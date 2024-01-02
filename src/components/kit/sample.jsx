import SampleBoard from "../../components/kit/SampleBoard";
import { useState, useEffect } from "react";
import FadersSection from "../../components/kit/FadersSection";
import { presetsInput } from "/src/lib/presets";
import DescribeSection from "../../components/kit/DescribeSection";
import NavBar from "../../components/kit/NavBar";
import MidiSection from "../../components/kit/MidiSection";
import Loader from "../../components/kit/Loader";

let lock = false;

export default function Sample(props) {
  function zamienTablice(tablica) {
    const part1 = tablica.slice(0, 4);
    const part2 = tablica.slice(4, 8);
    const part3 = tablica.slice(8, 12);
    const part4 = tablica.slice(12);

    const nowaTablica = [];
    nowaTablica.push(...part4, ...part3, ...part2, ...part1);

    return nowaTablica;
  }

  const [stylesData, setStylesData] = useState();
  const [dataFetched, setDataFetched] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `/authors/${props.author}/kits/${props.name}/style.json`
      );
      if (!response.ok) {
        throw new Error("Błąd pobierania danych");
      }
      const jsonData = await response.json();
      setStylesData(jsonData);
      setDataFetched(true);
    } catch (error) {
      console.error("Wystąpił błąd:", error);
    }
  };

  useEffect(() => {
    if (!dataFetched) {
      fetchData();
    }
    if (dataFetched) {
      document
        .querySelector(":root")
        .style.setProperty("--padColor", stylesData.padColor);
      document
        .querySelector(":root")
        .style.setProperty("--padOnHover", stylesData.padOnHover);
      if (stylesData.bgColor) {
        document
          .querySelector(":root")
          .style.setProperty("--bgColorApp", stylesData.bgColor);
      } else {
        document
          .querySelector(":root")
          .style.setProperty("--bgColorApp", "#121212");
      }
      if (stylesData.banner) {
        document
          .querySelector(":root")
          .style.setProperty("--banner", stylesData.banner);
      } else {
        document
          .querySelector(":root")
          .style.setProperty("--banner", "#252525");
      }
    }
  }, [dataFetched]);

  function changeAllArrays(table) {
    const modifiedTable = { ...table }; // Tworzy kopię, aby nie modyfikować oryginału
    for (const key in modifiedTable) {
      if (modifiedTable.hasOwnProperty(key)) {
        modifiedTable[key] = zamienTablice(modifiedTable[key]);
      }
    }
    return modifiedTable;
  }

  const [preset, setPreset] = useState("default");
  const [presets, setPresets] = useState(changeAllArrays(presetsInput));

  const localDefaultNotes = localStorage.getItem("localDefaultNotes");

  useEffect(() => {
    if (localDefaultNotes) {
      setPreset("localDefaultNotes");
    }
  }, []);

  useEffect(() => {
    setNotes(presets[preset]);
  }, [preset, presets]);

  const [notes, setNotes] = useState(presets[preset]);
  const [oldNotes, setOldNotes] = useState(presets[preset]);
  const [showSelects, setShowSelects] = useState(false);
  const [defaultChokeGroup, setDefaultChokeGroup] = useState([
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
  const [isCycle, setIsCycle] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [actives, setActives] = useState(new Array(16).fill(false));
  const [shouldBePlayed, setShouldBePlayed] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [midiMessage, setMidiMessage] = useState(null);
  const [progressState, setProgress] = useState(0);
  const [padsFetched, setPadsFetched] = useState(false);
  const [handChanged, setHandChanged] = useState(false);

  useEffect(() => {
    setNotes(presets[preset]);
  }, [presets]);

  useEffect(() => {
    if (!notes) return;
    if (handChanged) {
      const toLocalStorage = notes;
      localStorage.setItem("localDefaultNotes", JSON.stringify(toLocalStorage));
      setHandChanged(false);
    }
  }, [handChanged]);

  useEffect(() => {
    if (handChanged) {
      const toLocalStorage = presets[preset];
      localStorage.setItem("localDefaultNotes", JSON.stringify(toLocalStorage));
      setHandChanged(false);
    }
  }, [preset]);

  useEffect(() => {
    if (localDefaultNotes) {
      const newPresets = presets;
      newPresets["localDefaultNotes"] = JSON.parse(
        localStorage.getItem("localDefaultNotes")
      );
      setPresets(newPresets);
    }
  }, []);

  const globalState = {
    handChanged,
    setHandChanged,
    preset,
    setPreset,
    presets,
    setPresets,
    notes,
    setNotes,
    oldNotes,
    setOldNotes,
    showSelects,
    setShowSelects,
    defaultChokeGroup,
    setDefaultChokeGroup,
    isCycle,
    setIsCycle,
    refresh,
    setRefresh,
    actives,
    setActives,
    shouldBePlayed,
    setShouldBePlayed,
    midiMessage,
    setMidiMessage,
    progressState,
    setProgress,
    padsFetched,
    setPadsFetched,
  };

  const [dots, setDots] = useState(".");

  useEffect(() => {
    const mainView = document.querySelector(".mainView");
    const bottomSection = document.querySelector(".bottomSection");
    const padsSection = document.querySelector(".padsSection");

    if (padsFetched) {
      bottomSection.style.height = `${
        mainView.offsetHeight - padsSection.offsetHeight
      }px`;
    }
  }, [padsFetched]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prevDots) => {
        switch (prevDots) {
          case ".":
            return "..";
          case "..":
            return "...";
          case "...":
            return ".";
          default:
            return ".";
        }
      });
    }, 350);

    if (padsFetched) {
      clearInterval(intervalId);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [padsFetched]);

  const isIOS = /iPhone/i.test(navigator.userAgent);

  console.log(props.name);

  return (
    <main className="app">
      <section className="loadingScreen">
        <img
          id="logo"
          src={`/authors/${props.author}/kits/${props.name}/logo.svg `}
          alt={`${props.name}`}
          rel="preload"
        ></img>
        <h4 style={{ fontWeight: "lighter" }}>Loading content{dots}</h4>
        {/* <h2>{Math.round(progressState * 6.25) + "%"}</h2> */}
        <h3
          style={{
            color: "#AD2831",
            position: "absolute",
            bottom: "2rem",
            fontSize: "1.5rem",
            display: isIOS ? "block" : "none",
          }}
        >
          Remember to be in a ring mode on IOS!
        </h3>
        {dataFetched ? <Loader progressState={progressState}></Loader> : null}
      </section>

      <NavBar
        {...props}
        globalState={globalState}
        stylesData={stylesData}
      ></NavBar>
      <section className="mainView">
        <section className="upperSectionApp">
          <header className="">
            <section className="info p1">
              <div className="infoLeft">
                {/* <div className="infoImg">
                  <div className="img">
                    <img src={`/authors/${props.author}/photo.png`} alt="" />
                  </div>
                </div> */}
                <div className="infoImg">
                  <div className="img">
                    <img src={`/authors/${props.author}/logo.svg`} alt="" />
                  </div>
                </div>

                <p>{props.author}</p>
              </div>
              <div className="infoRight">
                <p>{props.name}</p>
              </div>
            </section>
            <section className="logoBannerSection p1">
              <div className="logoBannerMain">
                <img
                  src={`/authors/${props.author}/kits/${props.name}/logo.svg`}
                  alt=""
                />
              </div>
            </section>
          </header>
          <div className="mainApp fxGrow">
            {dataFetched ? (
              <SampleBoard
                {...props}
                globalState={globalState}
                fetchSrc={`/authors/${props.author}/kits/${props.name}`}
                stylesData={stylesData}
              />
            ) : null}
          </div>
        </section>
        <section className="bottomSection p1">
          <FadersSection
            globalState={globalState}
            stylesData={stylesData}
          ></FadersSection>
          <MidiSection
            globalState={globalState}
            stylesData={stylesData}
          ></MidiSection>
        </section>
      </section>

      <DescribeSection
        fetchSrc={`/authors/${props.author}/kits/${props.name}`}
        author={props.author}
        name={props.name}
        stylesData={stylesData}
      ></DescribeSection>
    </main>
  );
}
