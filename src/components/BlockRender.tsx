import { CSSProperties } from "react";

export function BlockRender(props: {
  top: number[];
  bottom: number[];
  orientation: 'up' | 'down';
  style?: CSSProperties;
}) {
  function onClick() {
    // console.log('i clicked on:', props.placedBlock);
    // const newBoard = new Map(props.game.gameBoard);
    // newBoard.delete(toKey(props.coord));
    // props.setGame(newGame);
  }

  const classNames = [
    'block-inner', 
    props.orientation === 'up'
      ? 'block-up'
      : 'block-down',
  ];
  return (
    <div className="block" style={props.style} onClick={onClick}>
      <div className={classNames.join(' ')}>
        <div>{props.top.join(' ')}</div>
        <div>{props.bottom.join(' ')}</div>
        <div className="clickzone" onClick={onClick}></div>
      </div>
    </div>
  );
}