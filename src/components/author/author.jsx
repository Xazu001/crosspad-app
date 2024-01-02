import { useEffect, useState } from "react";
import { activeSources } from "/src/lib/music/audio";
import Abort from "/src/components/abort";

function KitItem(props) {
  return (
    <>
      <a href={`/authors/${props.author}/${props.kitName}`}>
        <div className="authorKitItem br">
          <img
            src={`/authors/${props.author}/kits/${props.kitName}/logo.svg`}
            alt=""
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
            }}
          />
        </div>
      </a>
    </>
  );
}

function KitsList({ kits, author }) {
  console.log(author);
  return (
    <>
      <div className="kitsList p1">
        <h3>Kits</h3>
        <div className="kitsListMain">
          {kits.map((kitName, index) => (
            <KitItem kitName={kitName} key={index} author={author} />
          ))}
        </div>
      </div>
    </>
  );
}

export default function Author(props) {
  const [dataFetched, setDataFetched] = useState();
  if (activeSources) {
    activeSources.forEach(function (source) {
      if (source instanceof AudioBufferSourceNode) {
        source.stop();
      }
    });
  }

  const [data, setData] = useState(null);
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllKits = async () => {
    try {
      const response = await fetch(`/authors/${props.name}/kits.json`);
      if (!response.ok) {
        throw new Error("Błąd pobierania danych");
      }

      const newKits = await response.json();
      setKits(newKits);
      setLoading(false);
    } catch (error) {
      console.error("Wystąpił błąd:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${props.name}/infos.json`);
        if (!response.ok) {
          throw new Error("Błąd pobierania danych");
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Wystąpił błąd:", error);
      }
    };

    fetchData();
    getAllKits();
  }, [props.name]);

  return (
    <h1>Dupa</h1>
    // <main
    //   className="author"
    //   style={{
    //     display: "flex",
    //     flexDirection: "column",
    //     justifyContent: "space-between",
    //     background: "#252525",
    //   }}
    // >
    //   <div
    //     className="authorMain"
    //     style={{
    //       borderRadius: "0 0 16px 16px",
    //       width: "100%",
    //       display: "flex",
    //       flexDirection: "column",
    //       alignItems: "center",
    //       flexGrow: "1",
    //       overflowY: "scroll",
    //       background: "var(--bgColor)",
    //       paddingTop: "2rem",
    //     }}
    //   >
    //     <img
    //       src={`/authors/${props.name}/photo.png`}
    //       className="photo"
    //       alt=""
    //     />
    //     <h2>{props.name}</h2>

    //     <div className="socialMedia">
    //       {data && data.facebook && (
    //         <a href={data && data.facebook} target="_blank">
    //           <i className="fa-brands fa-square-facebook"></i>
    //         </a>
    //       )}
    //       {data && data.instagram && (
    //         <a href={data && data.instagram} target="_blank">
    //           <i className="fa-brands fa-instagram"></i>
    //         </a>
    //       )}
    //       {data && data.youtube && (
    //         <a href={data && data.youtube} target="_blank">
    //           <i className="fa-brands fa-youtube"></i>
    //         </a>
    //       )}
    //       {data && data.spotify && (
    //         <a href={data && data.spotify} target="_blank">
    //           <i className="fa-brands fa-spotify"></i>
    //         </a>
    //       )}
    //       {data && data.tiktok && (
    //         <a href={data && data.tiktok} target="_blank">
    //           <i className="fa-brands fa-tiktok"></i>
    //         </a>
    //       )}
    //       {data && data.soundcloud && (
    //         <a href={data && data.soundcloud} target="_blank">
    //           <i className="fa-brands fa-soundcloud"></i>
    //         </a>
    //       )}
    //       {data && data.bandcamp && (
    //         <a href={data && data.bandcamp} target="_blank">
    //           <i className="fa-brands fa-bandcamp"></i>
    //         </a>
    //       )}
    //       {data && data.www && (
    //         <a href={data && data.www} target="_blank">
    //           <i class="fa-solid fa-globe"></i>
    //         </a>
    //       )}
    //     </div>
    //     <p className="p1">{data && data.about}</p>

    //     {!loading ? <KitsList kits={kits} author={props.name} /> : null}
    //   </div>

    //   <nav className="navBar">
    //     <div className="navBarMain">
    //       <Abort></Abort>
    //     </div>
    //   </nav>
    // </main>
  );
}
