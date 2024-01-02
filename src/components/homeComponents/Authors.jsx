import { useEffect, useState } from "react";
import { getMainAuthors } from "/src/lib/authors";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from "swiper/modules";

export default function Authors() {
  const [authors, setAuthors] = useState();

  useEffect(() => {
    if (!authors) {
      setAuthors(getMainAuthors());
    }
  }, []);

  return (
    <section className="itemsListSection">
      <span className="p1">
        <h2>Authors</h2>
        <a href="/authors">See all</a>
      </span>
      <Swiper
        modules={[FreeMode]}
        freeMode={true}
        spaceBetween={10}
        onSlideChange={(swiper) => handleSlideChange(swiper)}
        slidesPerView={"auto"}
      >
        {authors
          ? authors.map((author) => (
              <SwiperSlide>
                {" "}
                <AuthorsListItem name={author} key={author} />
              </SwiperSlide>
            ))
          : null}
      </Swiper>
    </section>
  );
}

function AuthorsListItem(props) {
  return (
    <a href={`authors/${props.name}`} key={props.name}>
      <div className="authorsItem">
        <img src={`/authors/${props.name}/photo.png`} alt={props.name}></img>
      </div>
    </a>
  );
}
