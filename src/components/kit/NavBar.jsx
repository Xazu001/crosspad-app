import { useEffect, useState } from "react";

export default function NavBar(props) {
  const [isMobile, setIsMobile] = useState(false);
  const { showSelects, setShowSelects } = props.globalState;
  const [midiToggled, setMidiToggled] = useState(false);
  const [fadersToggled, setFadersToggled] = useState(false);
  const [aboutMeToggled, setAboutMeToggled] = useState(false);
  const [closeToggled, setCloseToggled] = useState(false);

  useEffect(() => {
    setIsMobile("ontouchstart" in window);
    const buttonWidth = document.querySelector("nav button").offsetWidth;
    document.querySelector(".close").style.width = `${buttonWidth}px`;
  }, []);

  function abort() {
    history.back();
  }

  const mainView = document.querySelector(".mainView");
  const padsSection = document.querySelector(".padsSection");
  const fadersSection = document.querySelector(".fadersSection");
  const midiSection = document.querySelector("#MidiSection");
  const logoSection = document.querySelector("header");
  const upperSection = document.querySelector(".upperSectionApp");
  const bottomSection = document.querySelector(".bottomSection");

  function close() {
    if (midiToggled) {
      setMidiToggled(false);
      setShowSelects(false);
    }
    if (fadersToggled) {
      setFadersToggled(false);
    }
    upperSection.classList.remove("h0");
    bottomSection.style.transform = `translateY(0)`;
    upperSection.style.transform = `translateY(0)`;
    if (aboutMeToggled) {
      document.querySelector(".aboutMeSection").style.transform =
        "translateY(100%)";
      setAboutMeToggled(false);
    }
  }

  useEffect(() => {
    if (midiToggled) {
      setShowSelects(true);
      setCloseToggled(true);
      upperSection.classList.add("h0");
      fadersSection.style.display = "none";
      midiSection.style.display = "block";
      bottomSection.style.transform = `translateY(-${logoSection.offsetHeight}px)`;
      upperSection.style.transform = `translateY(-${logoSection.offsetHeight}px)`;
    } else if (!midiToggled) {
      setCloseToggled(false);
    }
  }, [midiToggled]);

  useEffect(() => {
    if (fadersToggled) {
      setCloseToggled(true);
      upperSection.classList.add("h0");
      midiSection.style.display = "none";
      fadersSection.style.display = "block";
      bottomSection.style.transform = `translateY(-${logoSection.offsetHeight}px)`;
      upperSection.style.transform = `translateY(-${logoSection.offsetHeight}px)`;
    } else if (!fadersToggled) {
      setCloseToggled(false);
    }
  }, [fadersToggled]);

  useEffect(() => {
    if (aboutMeToggled) {
      document.querySelector(".aboutMeSection").style.transition = "0.7s";
      fadersSection.style.display = "none";
      midiSection.style.display = "none";
      setCloseToggled(true);

      document.querySelector(".aboutMeSection").style.transform =
        "translateY(0%)";
    } else if (!aboutMeToggled) {
      setCloseToggled(false);
    }
  }, [aboutMeToggled]);

  useEffect(() => {
    if (midiToggled || fadersToggled || aboutMeToggled) {
      document.querySelector(".navBarMain").classList.add("navBarClose");
    } else {
      document.querySelector(".navBarMain").classList.remove("navBarClose");
    }
  }, [midiToggled, fadersToggled, aboutMeToggled]);

  return (
    <>
      <nav className="navBar">
        <div className="navBarMain">
          <button
            className={`navItem abort ${
              midiToggled || fadersToggled || aboutMeToggled
                ? "hideNavItem"
                : ""
            }`}
            onClick={abort}
            onTouchStart={abort}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 25 24"
              style={{ scale: "1.30" }}
              fill="none"
            >
              <path
                d="M20.25 13.0001H8.664L13.164 17.5001L11.75 18.9141L4.836 12.0001L11.75 5.08606L13.164 6.50006L8.664 11.0001H20.25V13.0001Z"
                fill="white"
              />
            </svg>
          </button>

          <button
            className={`navItem ${
              midiToggled || fadersToggled || aboutMeToggled
                ? "hideNavItem"
                : ""
            }`}
            onClick={
              isMobile
                ? null
                : () => {
                    setMidiToggled(true);
                  }
            }
            onTouchStart={() => {
              setMidiToggled(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 21 20"
              fill="none"
              style={{ scale: "0.95" }}
            >
              <path
                d="M2.25 0H18.25V9H20.25V20H0.25V9H2.25V0ZM2.25 11V18H18.25V11H2.25ZM16.25 9V2H4.25V9H16.25ZM6.25 4.496H8.254V6.5H6.25V4.496ZM12.25 4.496H14.254V6.5H12.25V4.496Z"
                fill="white"
              />
            </svg>
          </button>
          <button
            className={`navItem ${
              midiToggled || fadersToggled || aboutMeToggled
                ? "hideNavItem"
                : ""
            }`}
            onClick={
              isMobile
                ? null
                : () => {
                    setFadersToggled(true);
                  }
            }
            onTouchStart={() => {
              setFadersToggled(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 25 24"
              fill="none"
              style={{ scale: "1.1" }}
            >
              <path
                d="M8.75 4.00001C8.48478 4.00001 8.23043 4.10537 8.04289 4.2929C7.85536 4.48044 7.75 4.73479 7.75 5.00001C7.75 5.26523 7.85536 5.51958 8.04289 5.70712C8.23043 5.89465 8.48478 6.00001 8.75 6.00001C9.01522 6.00001 9.26957 5.89465 9.45711 5.70712C9.64464 5.51958 9.75 5.26523 9.75 5.00001C9.75 4.73479 9.64464 4.48044 9.45711 4.2929C9.26957 4.10537 9.01522 4.00001 8.75 4.00001ZM5.92 4.00001C6.1266 3.41448 6.50974 2.90744 7.0166 2.5488C7.52346 2.19015 8.12909 1.99756 8.75 1.99756C9.37091 1.99756 9.97654 2.19015 10.4834 2.5488C10.9903 2.90744 11.3734 3.41448 11.58 4.00001H22.75V6.00001H11.58C11.3734 6.58554 10.9903 7.09258 10.4834 7.45122C9.97654 7.80986 9.37091 8.00246 8.75 8.00246C8.12909 8.00246 7.52346 7.80986 7.0166 7.45122C6.50974 7.09258 6.1266 6.58554 5.92 6.00001H2.75V4.00001H5.92ZM13.92 11C14.1266 10.4145 14.5097 9.90744 15.0166 9.5488C15.5235 9.19015 16.1291 8.99756 16.75 8.99756C17.3709 8.99756 17.9765 9.19015 18.4834 9.5488C18.9903 9.90744 19.3734 10.4145 19.58 11H22.75V13H19.58C19.3734 13.5855 18.9903 14.0926 18.4834 14.4512C17.9765 14.8099 17.3709 15.0025 16.75 15.0025C16.1291 15.0025 15.5235 14.8099 15.0166 14.4512C14.5097 14.0926 14.1266 13.5855 13.92 13H2.75V11H13.92ZM16.75 11C16.4848 11 16.2304 11.1054 16.0429 11.2929C15.8554 11.4804 15.75 11.7348 15.75 12C15.75 12.2652 15.8554 12.5196 16.0429 12.7071C16.2304 12.8947 16.4848 13 16.75 13C17.0152 13 17.2696 12.8947 17.4571 12.7071C17.6446 12.5196 17.75 12.2652 17.75 12C17.75 11.7348 17.6446 11.4804 17.4571 11.2929C17.2696 11.1054 17.0152 11 16.75 11ZM8.75 18C8.48478 18 8.23043 18.1054 8.04289 18.2929C7.85536 18.4804 7.75 18.7348 7.75 19C7.75 19.2652 7.85536 19.5196 8.04289 19.7071C8.23043 19.8947 8.48478 20 8.75 20C9.01522 20 9.26957 19.8947 9.45711 19.7071C9.64464 19.5196 9.75 19.2652 9.75 19C9.75 18.7348 9.64464 18.4804 9.45711 18.2929C9.26957 18.1054 9.01522 18 8.75 18ZM5.92 18C6.1266 17.4145 6.50974 16.9074 7.0166 16.5488C7.52346 16.1902 8.12909 15.9976 8.75 15.9976C9.37091 15.9976 9.97654 16.1902 10.4834 16.5488C10.9903 16.9074 11.3734 17.4145 11.58 18H22.75V20H11.58C11.3734 20.5855 10.9903 21.0926 10.4834 21.4512C9.97654 21.8099 9.37091 22.0025 8.75 22.0025C8.12909 22.0025 7.52346 21.8099 7.0166 21.4512C6.50974 21.0926 6.1266 20.5855 5.92 20H2.75V18H5.92Z"
                fill="white"
              />
            </svg>
          </button>
          <button
            className={`navItem ${
              midiToggled || fadersToggled || aboutMeToggled
                ? "hideNavItem"
                : ""
            }`}
            onClick={
              isMobile
                ? null
                : () => {
                    setAboutMeToggled(true);
                  }
            }
            onTouchStart={() => {
              setAboutMeToggled(true);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 25 24"
              fill="none"
              style={{ scale: "1.1" }}
            >
              <path
                d="M12.25 21C13.4319 21 14.6022 20.7672 15.6942 20.3149C16.7861 19.8626 17.7782 19.1997 18.614 18.364C19.4497 17.5282 20.1126 16.5361 20.5649 15.4442C21.0172 14.3522 21.25 13.1819 21.25 12C21.25 10.8181 21.0172 9.64778 20.5649 8.55585C20.1126 7.46392 19.4497 6.47177 18.614 5.63604C17.7782 4.80031 16.7861 4.13738 15.6942 3.68508C14.6022 3.23279 13.4319 3 12.25 3C9.86305 3 7.57387 3.94821 5.88604 5.63604C4.19821 7.32387 3.25 9.61305 3.25 12C3.25 14.3869 4.19821 16.6761 5.88604 18.364C7.57387 20.0518 9.86305 21 12.25 21ZM23.25 12C23.25 18.075 18.325 23 12.25 23C6.175 23 1.25 18.075 1.25 12C1.25 5.925 6.175 1 12.25 1C18.325 1 23.25 5.925 23.25 12ZM11.25 17.5V10H13.25V17.5H11.25ZM13.25 8.5H11.246V6.496H13.25V8.5Z"
                fill="white"
              />
              <path
                d="M12.25 21C13.4319 21 14.6022 20.7672 15.6942 20.3149C16.7861 19.8626 17.7782 19.1997 18.614 18.364C19.4497 17.5282 20.1126 16.5361 20.5649 15.4442C21.0172 14.3522 21.25 13.1819 21.25 12C21.25 10.8181 21.0172 9.64778 20.5649 8.55585C20.1126 7.46392 19.4497 6.47177 18.614 5.63604C17.7782 4.80031 16.7861 4.13738 15.6942 3.68508C14.6022 3.23279 13.4319 3 12.25 3C9.86305 3 7.57387 3.94821 5.88604 5.63604C4.19821 7.32387 3.25 9.61305 3.25 12C3.25 14.3869 4.19821 16.6761 5.88604 18.364C7.57387 20.0518 9.86305 21 12.25 21ZM23.25 12C23.25 18.075 18.325 23 12.25 23C6.175 23 1.25 18.075 1.25 12C1.25 5.925 6.175 1 12.25 1C18.325 1 23.25 5.925 23.25 12ZM11.25 17.5V10H13.25V17.5H11.25ZM13.25 8.5H11.246V6.496H13.25V8.5Z"
                fill="white"
              />
            </svg>
          </button>
          <button
            className={`navItem close ${closeToggled ? "" : "hideNavItem"}`}
            onClick={isMobile ? null : close}
            onTouchStart={close}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 14 14"
              fill="none"
              style={{ scale: "0.9" }}
            >
              <path
                d="M2.04999 0.635986L6.99999 5.58599L11.95 0.635986L13.364 2.04999L8.41399 6.99999L13.364 11.95L11.949 13.364L6.99899 8.41399L2.04999 13.364L0.635986 11.95L5.58599 6.99999L0.635986 2.04999L2.04999 0.635986Z"
                fill="white"
              />
            </svg>
          </button>
        </div>
      </nav>
    </>
  );
}
