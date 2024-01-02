import React from "react";

export default function Hero() {
  return (
    <section className="heroSection p1">
      <div className="heroSectionMain">
        <div className="heroItem">
          <img
            type="image/svg+xml"
            src="/img/bannerXmas.svg"
            alt=""
            style={{
              objectFit: "fill",
              maxHeight: "100%",
              maxWidth: "80%",
            }}
          />
        </div>
      </div>
    </section>
  );
}
