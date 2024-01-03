import { useState, useEffect } from "react";
import { getAllAuthors } from "/src/lib/authors.js";
import Abort from "/src/components/abort.jsx";

function Authors() {
  const [authors, setAuthors] = useState();
  useEffect(() => {
    if (!authors) {
      setAuthors(getAllAuthors());
    }
  }, []);

  return (
    <main
      className="authors"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#252525",
      }}
    >
      <div
        className="authorsMain p1"
        style={{
          paddingTop: "2rem",
          borderRadius: "0 0 16px 16px",
          flexGrow: "1",
          display: "grid",
          gap: "1rem",
          height: "100%",
          background: "var(--bgColor)",
          overflow: "scroll",
        }}
      >
        {authors
          ? authors.map((author) => <AuthorItem author={author} />)
          : null}
      </div>
      <nav className="navBar">
        <div className="navBarMain">
          <Abort></Abort>
        </div>
      </nav>
    </main>
  );
}

function AuthorItem(props) {
  return (
    <a href={`/authors/${props.author}`}>
      <div
        className="authorItem"
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          cursor: "pointer",
          flexShrink: "0",
        }}
      >
        <img
          src={`https://r2.crosspad.app/authors/${props.author}/photo.png`}
          alt=""
          style={{
            aspectRatio: "1",
            width: "100%",
            borderRadius: "100%",
          }}
        />
        <label style={{ fontSize: "2rem", color: "white" }}>
          {props.author}
        </label>
      </div>
    </a>
  );
}

export default Authors;
