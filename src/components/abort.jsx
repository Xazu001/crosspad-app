function Abort() {
  function abort() {
    history.back();
  }

  return (
    <button
      className={`close`}
      style={{
        cursor: "pointer",
        width: "25%",
      }}
      onClick={abort}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 14 14"
        fill="none"
        style={{ scale: "0.9", height: "3rem" }}
      >
        <path
          d="M2.04999 0.635986L6.99999 5.58599L11.95 0.635986L13.364 2.04999L8.41399 6.99999L13.364 11.95L11.949 13.364L6.99899 8.41399L2.04999 13.364L0.635986 11.95L5.58599 6.99999L0.635986 2.04999L2.04999 0.635986Z"
          fill="white"
        />
      </svg>
    </button>
  );
}

export default Abort;
