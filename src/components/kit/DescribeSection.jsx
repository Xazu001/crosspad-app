import { useEffect, useState } from "react";

export default function DescribeSection(props) {
  const [data, setData] = useState();
  const [socialMedia, setSocialMedia] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://r2.crosspad.app/authors/${props.author}/kits/${props.name}/infos.json`
        );
        if (!response.ok) {
          throw new Error("Błąd pobierania danych");
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Wystąpił błąd:", error);
      }
    };

    const fetchSocialMedia = async () => {
      try {
        const response = await fetch(
          `https://r2.crosspad.app/authors/${props.author}/infos.json`
        );
        if (!response.ok) {
          throw new Error("Błąd pobierania danych");
        }
        const jsonData = await response.json();
        setSocialMedia(jsonData);
      } catch (error) {
        console.error("Wystąpił błąd:", error);
      }
    };

    fetchSocialMedia();
    fetchData();
  }, []);

  return (
    <section className="aboutMeSection">
      <div className="aboutMe centered-text">
        <div className="about">
          <a href={`/authors/${props.author}`}>
            <img
              src={`https://r2.crosspad.app/authors/${props.author}/photo.png`}
              alt="photo"
              className="photo"
            />
          </a>
          <h2
            style={{
              textTransform: "uppercase",
              marginBottom: "0.8rem",
            }}
          >
            {props.author}
          </h2>
          <div className="socialMedia">
            {socialMedia && socialMedia.facebook && (
              <a href={socialMedia && socialMedia.facebook} target="_blank">
                <i className="fa-brands fa-square-facebook"></i>
              </a>
            )}
            {socialMedia && socialMedia.instagram && (
              <a href={socialMedia && socialMedia.instagram} target="_blank">
                <i className="fa-brands fa-instagram"></i>
              </a>
            )}
            {socialMedia && socialMedia.youtube && (
              <a href={socialMedia && socialMedia.youtube} target="_blank">
                <i className="fa-brands fa-youtube"></i>
              </a>
            )}
            {socialMedia && socialMedia.spotify && (
              <a href={socialMedia && socialMedia.spotify} target="_blank">
                <i className="fa-brands fa-spotify"></i>
              </a>
            )}
            {socialMedia && socialMedia.tiktok && (
              <a href={socialMedia && socialMedia.tiktok} target="_blank">
                <i className="fa-brands fa-tiktok"></i>
              </a>
            )}
            {socialMedia && socialMedia.soundcloud && (
              <a href={socialMedia && socialMedia.soundcloud} target="_blank">
                <i className="fa-brands fa-soundcloud"></i>
              </a>
            )}
            {socialMedia && socialMedia.bandcamp && (
              <a href={socialMedia && socialMedia.bandcamp} target="_blank">
                <i className="fa-brands fa-bandcamp"></i>
              </a>
            )}
            {socialMedia && socialMedia.www && (
              <a href={socialMedia && socialMedia.www} target="_blank">
                <i class="fa-solid fa-globe"></i>
              </a>
            )}
          </div>

          <span>
            <h3>About kit</h3>
            <a href={`/authors/${props.author}`}>See all</a>
          </span>
          <p style={{ textAlign: "left" }}>{data && data.about}</p>
        </div>
        <div className="backBlob"></div>
      </div>
    </section>
  );
}
