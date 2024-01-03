import { useState, useEffect } from "react";
import { getMainAuthors } from "/src/lib/authors";
import kitsList from "/src/lib/mainKits.json";

function KitsList({ kits }) {
  return (
    <>
      {kits.map(({ kit, author }, index) => (
        <KitItem kit={kit} author={author} key={index} />
      ))}
    </>
  );
}

function KitItem(props) {
  return (
    <>
      <a href={`/authors/${props.author}/${props.kit}`}>
        <div className="kitItem br">
          <div className="kitItemMain" style={{ padding: "0.5rem" }}>
            <img
              src={`https://r2.crosspad.app/authors/${props.author}/kits/${props.kit}/logo.svg`}
              alt=""
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
              }}
            />
            {/* <p>{props.author}</p> */}
            {/* <p>{props.kit}</p> */}
          </div>
        </div>
      </a>
    </>
  );
}

export default function Kits() {
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

          return kitsWithAuthor;
        })
      );

      setIsLoading(false);
      return fetchedKits.flat(); // Spłaszcz tablicę zagnieżdżonych tablic
    } catch (error) {
      setIsLoading(false);
      console.error(`Błąd pobierania pliku: ${error}`);
      return [];
    }
  };

  useEffect(() => {
    const fetchDataAndSetKits = async () => {
      if (!authors) {
        setAuthors(getMainAuthors());
      }

      if (authors) {
        const kitsData = await fetchData();

        setKits(kitsData);
      }
    };

    fetchDataAndSetKits();
  }, [authors, loading]);

  return (
    <section className="kitsListSection p1">
      <span>
        <h2>Kits</h2>
        <a href="/kits">See all</a>
      </span>
      <div className="kitsListMain">{<KitsList kits={kitsList} />}</div>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "2.6rem 0",
        }}
      >
        <div
          style={{
            padding: "1.2rem 2.6rem",
            background: "var(--itemsColor)",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src="/img/newkit2.svg"
            alt="new kit every week"
            style={{ height: "1.8rem" }}
          />
        </div>
      </div>
    </section>
  );
}
