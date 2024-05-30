/*
https://en.wikipedia.org/wiki/Triominoes
gameBoard.has("0,0");
gameBoard.get("0,0");
gameBoard.keys();
gameBoard.values();
gameBoard.entries();

Homework:
- 

KNOWN BUGS:
- PAUL: reloading the page takes you back to JoinGame screen.
- investigate scoring (seems like you can get bridge/hexagon at same time)
- game doesn't trigger 'end' action until someone tries to play

FOR LATER:
- Add button that turns available spaces on/off
- Create -/+ zoom button for GameBoardView
- Change GameLog wording to gain/loses and color code green/red.
- Change pointsFromPlay to return (points, hex, bridge) for HEXAGON & BRIDGE chime / text.
- Figure out why right container takes up whole screen instead of collapsing when screen too narrow.
- Optimize for mobile & tablets
- Add ability for players to undo by selecting point in data log

End states:
  1) A player plays their last tile (any hand[i] === 0)
     That player earns 25 points + the total points of everyone else's tiles
  2) The drawPile is empty and all players pass, meaning no more moves possible.
     Each player loses points equal to sum of their own tiles
*/