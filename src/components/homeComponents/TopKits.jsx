import { useState, useEffect } from "react";
import topKits from "/src/lib/topKits.json";
import { Link } from "wouter";

function getTopKits() {
  return topKits;
}

function KitsList({ kits }) {
  return (
    <div className="topKitsMain">
      {kits.map(({ kit, author }, index) => (
        <KitItem kit={kit} author={author} key={index} />
      ))}
    </div>
  );
}

function KitItem(props) {
  return (
    <Link href={`/authors/${props.author}/${props.kit}`}>
      <div className="topKitsItem">
        <img src={`/authors/${props.author}/logo.png`} alt="" />
        <h3>{props.kit}</h3>
      </div>
    </Link>
  );
}

export default function TopKits() {
  const [kits, setKits] = useState();

  return (
    <section className="topKitsSection">
      <h2>TOP KITS!</h2>
      <KitsList kits={getTopKits()}></KitsList>
    </section>
  );
}
