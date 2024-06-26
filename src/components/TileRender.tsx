import { CSSProperties } from "react";
import './DisplayGameBoard.css'

export function TileRender(props: {
  top: number[];
  bottom: number[];
  orientation: 'up' | 'down';
  style?: CSSProperties;
  tileStyle?: string;
    // 'playable-visible' = black outline, dark green fill, no numbers
    // 'playable-hidden' = completely transparent
    // 'most-recent' = red star in center of tile
  draggable?: boolean; // Makes tile draggable
  onClick?: (event: React.DragEvent<HTMLDivElement>) => void;
  onDragStart?: (event: React.DragEvent<HTMLDivElement>) => void; // sets data of dragged tile
  onDragOver?: (event: React.DragEvent<HTMLDivElement>) => void; // enables dropping of dragged tile
  onDrop?: (event: React.DragEvent<HTMLDivElement>) => void; // places tile when dropped onto valid space
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
    <div
      className={classNames.join(' ')}
      style={props.style}
      draggable={props.draggable}
      onClick={props.onClick}
      onDragStart={props.onDragStart}
      onDragOver={props.onDragOver}
      onDrop={props.onDrop}
    >
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