import { CSSProperties } from "react";

export function BlockRender(props: {
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
    'block-inner', 
    props.orientation === 'up'
      ? 'block-up'
      : 'block-down',
    props.blockStyle
      ? props.blockStyle
      : '',
  ];
  return (
    <div className="block" style={props.style}>
      <div className={classNames.join(' ')}>
        <div>{props.top.join(' ')}</div>
        <div>{props.bottom.join(' ')}</div>
        <div className="clickzone" onClick={props.onClick}></div>
      </div>
    </div>
  );
}