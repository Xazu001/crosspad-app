import { useState, useEffect } from "react";
import { getAllAuthors } from "/src/lib/authors.js";
import Abort from "/src/components/abort.jsx";

export default function KitsPage() {
  const [authors, setAuthors] = useState();
  const [kits, setKits] = useState();
  const [loading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const fetchedKits = await Promise.all(
        authors.map(async (author) => {
          const sciezkaPliku = `https://r2.crosspad.app/authors/${author}/kits.json`;
          const response = await fetch(sciezkaPliku);

          if (!response.ok) {
            throw new Error(
              `Błąd sieci: ${response.status} - ${response.statusText}`
            );
          }

          const kitsData = await response.json();

          const kitsWithAuthor = kitsData.map((kit) => ({
            kit,
            author,
          }));

          setKits(kitsWithAuthor);
          return kitsWithAuthor;
        })
      );

      setIsLoading(false);
      return fetchedKits.flat(); // Spłaszcz tablicę zagnieżdżonych tablic
    } catch (error) {
      setIsLoading(false);
      console.error(`Błąd pobierania pliku: ${error.message}`);
      return [];
    }
  };

  useEffect(() => {
    const fetchDataAndSetKits = async () => {
      if (!authors) {
        setAuthors(getAllAuthors());
      }

      if (authors) {
        const kitsData = await fetchData();

        setKits(kitsData);
      }
    };

    fetchDataAndSetKits();
  }, [authors, loading]);

  return (
    <main
      className="kits"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#252525",
        overflow: "hidden",
      }}
    >
      <section
        className="kitsListSection p1"
        style={{
          borderRadius: "0 0 16px 16px",
          gap: "0.5rem",
          flexDirection: "column",
          flexGrow: "1",
          paddingTop: "2rem",
          overflow: "hidden",
          background: "var(--bgColor)",
          transform: "translateY(0%)",
        }}
      >
        {!loading && <KitsList kits={kits} />}
      </section>

      <nav className="navBar">
        <div className="navBarMain">
          <Abort></Abort>
        </div>
      </nav>
    </main>
  );
}

function KitsList({ kits }) {
  return (
    <div
      className="kitsListMain"
      style={{
        overflow: "hidden",
        overflowY: "scroll",
      }}
    >
      {kits.map(({ kit, author }, index) => (
        <KitItem kit={kit} author={author} key={index} />
      ))}
    </div>
  );
}

function KitItem(props) {
  return (
    <>
      <a href={`/authors/${props.author}/${props.kit}`}>
        <div className="kitItem br">
          <div className="kitItemMain" style={{ padding: ".5rem" }}>
            <img
              src={`https://r2.crosspad.app/authors/${props.author}/kits/${props.kit}/logo.svg`}
              alt=""
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
              }}
            />
          </div>
        </div>
      </a>
    </>
  );
}
