const Loader = (props) => {
  // const {progressState, setProgress} = props.progressState
  return (
    <>
      <div className="loadingMain">
        <div className="loadingText">
          <h3>
            {props.progressState
              ? `${Math.round(props.progressState * 6.25)}%`
              : null}
          </h3>
        </div>

        <div className="loadingBar"></div>
        <div className="loadingShadow"></div>
        <div className="loadingBar"></div>
        <div className="loadingShadow"></div>
        <div className="loadingBar"></div>
        <div className="loadingShadow"></div>
        <div className="loadingBar"></div>
        <div className="loadingShadow"></div>
        <div className="loadingBar"></div>
        <div className="loadingShadow"></div>
        <div className="loadingBar"></div>
      </div>
    </>
  );
};
export default Loader;
