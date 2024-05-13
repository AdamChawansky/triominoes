import { CSSProperties } from "react";

export function TileRender(props: {
  top: number[];
  bottom: number[];
  orientation: 'up' | 'down';
  onClick?: () => void;
  style?: CSSProperties;
  blockStyle?: string;
    // 'selected' = yellow shading in hand
    // 'playable' = yellow shading w/o numbers
    // 'most-recent' = invert color of last tile played
}) {

  const classNames = [
    props.blockStyle
      ? props.blockStyle
      : '',
  ];
  return (
    <div className= {props.orientation === 'up' ? "tile-container" : "tile-container-inverted"} style={props.style}>
      <div className={classNames.join(' ')}>
        {props.orientation === 'up' ? (
          <>
            <span className="number bottom-left">{props.bottom[0]}</span>
            <span className="number bottom-right">{props.bottom[1]}</span>
            <span className="number top-center">{props.top[0]}</span>
          </>
        ) : (
          <>
            <span className="number top-left">{props.top[0]}</span>
            <span className="number top-right">{props.top[1]}</span>
            <span className="number bottom-center">{props.bottom[0]}</span>
          </>
        )}
        <button className="tile-button" onClick={props.onClick}></button>
      </div>
    </div>
  );
}