import { CSSProperties } from "react";
import './DisplayGameBoard.css'

export function TileRender(props: {
  top: number[];
  bottom: number[];
  orientation: 'up' | 'down';
  onClick?: () => void;
  style?: CSSProperties;
  tileStyle?: string;
    // 'selected' = yellow shading in hand
    // 'playable' = black outline, no numbers
    // 'most-recent' = red star in center of tile
}) {

  const classNames = [
    props.orientation === 'up'
      ? 'tile-container'
      : 'tile-container-inverted',
    props.tileStyle
      ? props.tileStyle
      : '',
  ];
  return (
    <div className= {classNames.join(' ')} style={props.style} onClick={props.onClick}>
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
    </div>
  );
}